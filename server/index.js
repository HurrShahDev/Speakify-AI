import express from "express";
import cors from "cors";
import axios from "axios";
import FormData from "form-data";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "../client/dist")));

// API Keys (should be in .env in production)
const SPEECHMATICS_KEY = process.env.SPEECHMATICS_KEY || "bfQLKDqy5BXexh7shY5IDVSKmHmVOaPc";
const VOGENT_API_KEY = process.env.VOGENT_API_KEY || "elto_9sHnHUdslEA7cnsP2vph3UgLGAgi6TL5";
const VOGENT_BASE_URL = "https://api.vogent.ai/api";
const VOGENT_VOICE_ID = "36b87413-6d7b-421d-8745-bc0897770d1e";

// Gemini Configuration - Using REST API directly
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

// ========================================
// Conversation History Storage
// ========================================
// Simple in-memory store for conversation history (per session/user)
// Format: { sessionId: [{ userText, coachResponse, timestamp }, ...] }
const conversationHistory = new Map();

function getOrCreateConversation(sessionId) {
  if (!conversationHistory.has(sessionId)) {
    conversationHistory.set(sessionId, []);
  }
  return conversationHistory.get(sessionId);
}

function addToConversation(sessionId, userText, coachResponse) {
  const conversation = getOrCreateConversation(sessionId);
  conversation.push({
    userText,
    coachResponse,
    timestamp: new Date().toISOString()
  });
  // Keep only last 5 exchanges to avoid token overflow
  if (conversation.length > 5) {
    conversation.shift();
  }
}

function getConversationContext(sessionId) {
  const conversation = getOrCreateConversation(sessionId);
  if (conversation.length === 0) return "";
  
  let context = "\n📚 PREVIOUS CONVERSATION:\n";
  conversation.forEach((exchange, idx) => {
    context += `\nExchange ${idx + 1}:\n`;
    context += `Student: "${exchange.userText}"\n`;
    context += `Coach: "${exchange.coachResponse}"\n`;
  });
  context += "\n---\n\n";
  return context;
}

// ========================================
// STEP 1: Speech to Text (Speechmatics)
// ========================================
async function transcribeAudio(audioFilePath) {
  if (!fs.existsSync(audioFilePath)) {
    throw new Error(`Audio file not found: "${audioFilePath}"`);
  }

  const form = new FormData();
  form.append("data_file", fs.createReadStream(audioFilePath));
  form.append("config", JSON.stringify({
    type: "transcription",
    transcription_config: { language: "en" },
  }));

  try {
    const response = await axios.post(
      "https://asr.api.speechmatics.com/v2/jobs/",
      form,
      { headers: { Authorization: `Bearer ${SPEECHMATICS_KEY}`, ...form.getHeaders() } }
    );

    const jobId = response.data.id;
    console.log(`  ✅ Job ID: ${jobId}`);
    return jobId;
  } catch (error) {
    console.error("  ❌ Speechmatics Upload Error:");
    console.error(`    Status: ${error.response?.status}`);
    console.error(`    Message: ${error.response?.data?.detail || error.message}`);
    throw error;
  }
}

// ========================================
// STEP 2: Check Transcription Status
// ========================================
async function waitForTranscriptionCompletion(jobId, maxAttempts = 30) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await axios.get(
        `https://asr.api.speechmatics.com/v2/jobs/${jobId}`,
        { headers: { Authorization: `Bearer ${SPEECHMATICS_KEY}` } }
      );

      const status = response.data.job.status;
      console.log(`  Attempt ${attempt + 1}/${maxAttempts}: Status = ${status}`);

      if (status === "done") {
        console.log(`  ✅ Transcription ready!`);
        return jobId;
      } else if (status === "rejected") {
        throw new Error(`Transcription job was rejected: ${response.data.job.error_detail}`);
      }

      // Wait before retry
      if (attempt < maxAttempts - 1) {
        console.log(`  ⏳ Waiting 2 seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      if (attempt === maxAttempts - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  throw new Error("Transcription timeout after 30 attempts");
}

// ========================================
// STEP 3: Get Transcript Text
// ========================================
async function getTranscript(jobId) {
  try {
    const response = await axios.get(
      `https://asr.api.speechmatics.com/v2/jobs/${jobId}/transcript`,
      { headers: { Authorization: `Bearer ${SPEECHMATICS_KEY}` } }
    );

    console.log(`  ✅ Transcript API response received`);
    console.log(`  📊 Total results: ${response.data.results.length}`);

    const transcript = response.data.results
      .map((item, idx) => {
        if (item.alternatives && item.alternatives.length > 0) {
          const text = item.alternatives[0].content;
          const confidence = item.alternatives[0].confidence || "N/A";
          console.log(`    [${idx}] "${text}" (confidence: ${confidence})`);
          return text;
        }
        return "";
      })
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    console.log(`  ✅ Final transcript: "${transcript}"`);
    return transcript;
  } catch (error) {
    console.error("  ❌ Transcript Fetch Error:");
    console.error(`    Status: ${error.response?.status}`);
    console.error(`    Message: ${error.response?.data?.detail || error.message}`);
    throw error;
  }
}

// ========================================
// Basic Grammar Correction Fallback
// ========================================
function getBasicGrammarCorrection(text) {
  // Simple regex-based grammar patterns
  const corrections = [
    { pattern: /\bi\s+/gi, replace: "I ", reason: "Capitalize 'I'" },
    { pattern: /\b(go|goes|went)\s+to[^d]/gi, replace: (match) => {
      return match.includes("went") ? "went to " : "went to ";
    }, reason: "Use past tense: 'went' (not 'go')" },
    { pattern: /\byesterday\s+\./g, replace: "yesterday.", reason: "Remove space before period" },
  ];

  let corrected = text;
  let usedCorrections = [];

  // Apply corrections
  for (const { pattern, replace, reason } of corrections) {
    if (pattern.test(corrected)) {
      if (typeof replace === 'function') {
        corrected = corrected.replace(pattern, replace);
      } else {
        corrected = corrected.replace(pattern, replace);
      }
      usedCorrections.push(reason);
    }
  }

  // Build encouraging response
  let response = "Great effort practicing English! ";
  
  if (usedCorrections.length > 0) {
    response += `I noticed: ${usedCorrections.join(" and ")}. `;
    response += "Keep practicing - you're doing well!";
  } else {
    response += "Your sentence is great! Keep up this good work.";
  }

  return response;
}

// ========================================
// Gemini 3 Integration - Grammar Coaching (Improved for Conversation)
// ========================================
async function getCoachResponse(text, sessionId = "default") {
  if (!text || text.trim() === "") {
    throw new Error("Empty text provided for coach response");
  }

  const conversationContext = getConversationContext(sessionId);

  const GRAMMAR_PROMPT = `You are a friendly, encouraging English grammar coach for non-native speakers. Your goal is to help them improve naturally through conversation, not just correction.

${conversationContext}

CURRENT STUDENT MESSAGE: "${text}"

YOUR RESPONSE STRUCTURE (MUST FOLLOW THIS):

1. **OPENING APPRECIATION** (1-2 sentences):
   - Start by appreciating their effort specifically
   - Example: "Great job practicing! I love your confidence when speaking."
   - Make them feel encouraged first

2. **GRAMMAR & VOCABULARY REVIEW** (if needed, 2-3 sentences):
   - If there ARE mistakes: List them clearly with explanations
   - Format: "I noticed: [mistake] → [correction]. This is because [brief grammar rule]."
   - If NO mistakes: Praise the grammar and vocabulary used
   - Always be positive and educational

3. **IMPROVEMENT SUGGESTIONS** (1-2 sentences):
   - Suggest better vocabulary or phrasing for the same meaning
   - Example: "Instead of 'very good', you could say 'excellent' or 'outstanding'"
   - Explain why the alternative is better (more natural, more professional, etc.)

4. **NATURAL CONVERSATION CONTINUATION** (2-3 sentences):
   - Continue the conversation naturally, as a friend would
   - Ask a follow-up question to keep them talking
   - Build on what they said
   - Make it feel like a real dialogue, not a lesson

IMPORTANT RULES:
- Do NOT mention capitalization, punctuation, or spacing (this is spoken English)
- Focus ONLY on actual grammar mistakes (verb tense, subject-verb agreement, articles, word order, prepositions, pronouns, etc.)
- Be warm, encouraging, and conversational
- Make them want to keep talking
- Keep response to 5-7 sentences maximum
- Write in a natural, spoken English style

Example response:
"Great job expressing yourself clearly! I heard 'I goes to school' — we use 'go' for 'I', so it's 'I go to school'. Also, you could say 'I go to school every day' or 'I attend school daily' — they have slightly different feels. That's getting better! How many hours do you usually spend there?"`;

  try {
    console.log(`  🤖 Using Gemini API for grammar coaching...`);
    console.log(`  ⏳ Analyzing grammar...`);

    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key not configured");
    }

    // Use REST API directly with the provided endpoint
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: GRAMMAR_PROMPT
              }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY
        },
        timeout: 30000
      }
    );

    // Extract text from Gemini response
    const coachSays = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!coachSays) {
      throw new Error("Empty response from Gemini");
    }

    console.log(`    ✅ Got response from Gemini`);
    
    // Store in conversation history
    addToConversation(sessionId, text, coachSays);
    
    return coachSays.trim();
  } catch (error) {
    const errorMsg = error.message || "Unknown error";
    console.error(`    ❌ Gemini error: ${errorMsg}`);

    if (errorMsg.includes("API key")) {
      console.error(`       Set GEMINI_API_KEY in .env file`);
    }

    // Fallback to basic grammar correction
    console.log(`\n🔄 Falling back to basic grammar correction...`);
    const response = getBasicGrammarCorrection(text);
    
    // Store in conversation history
    addToConversation(sessionId, text, response);
    
    return response;
  }
}

// ========================================
// STEP 5: Text to Speech (Vogent)
// ========================================
async function textToSpeech(text) {
  try {
    console.log(`  📤 Sending text to Vogent (length: ${text.length} chars)`);

    const response = await axios.post(
      `${VOGENT_BASE_URL}/tts`,
      {
        text: text,
        voiceId: VOGENT_VOICE_ID,
      },
      {
        headers: {
          Authorization: `Bearer ${VOGENT_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
        timeout: 60000,
      }
    );

    console.log(`  ✅ Audio received from Vogent: ${(response.data.byteLength / 1024).toFixed(2)} KB`);
    return response.data; // Return Buffer
  } catch (error) {
    console.error("  ❌ Vogent TTS Error:");
    console.error(`    Status: ${error.response?.status}`);
    console.error(`    Message: ${error.response?.data || error.message}`);
    throw error;
  }
}

// ========================================
// API Routes
// ========================================

/**
 * POST /api/analyze
 * Accepts an audio file, transcribes it, gets coaching feedback, and returns audio response
 */
app.post("/api/analyze", async (req, res) => {
  console.log("\n" + "=".repeat(60));
  console.log("🎤 NEW ANALYSIS REQUEST STARTED");
  console.log("=".repeat(60));

  try {
    if (!req.files || !req.files.audio) {
      console.error("❌ No audio file provided");
      return res.status(400).json({ error: "No audio file provided" });
    }

    // Get session ID from request (for conversation history)
    const sessionId = req.body.sessionId || req.headers['x-session-id'] || "default";
    console.log(`📌 Session ID: ${sessionId}`);

    const audioFile = req.files.audio;
    const tempPath = path.join(__dirname, "../temp_audio_" + Date.now() + ".mp3");
    const fileSize = (audioFile.size / 1024).toFixed(2);

    console.log(`📥 Audio file received: ${fileSize} KB`);
    console.log(`💾 Saving to: ${tempPath}`);

    // Save uploaded file
    await audioFile.mv(tempPath);
    console.log("✅ File saved successfully");

    // Step 1: Transcribe
    console.log("\n📝 STEP 1: Transcribing audio with Speechmatics...");
    const jobId = await transcribeAudio(tempPath);
    console.log(`✅ Transcription job created: ${jobId}`);

    // Step 2: Wait for completion
    console.log("\n⏳ STEP 2: Waiting for transcription to complete...");
    await waitForTranscriptionCompletion(jobId);
    console.log("✅ Transcription completed");

    // Step 3: Get transcript
    console.log("\n🔤 STEP 3: Fetching transcript text...");
    const transcript = await getTranscript(jobId);
    console.log("\n" + "─".repeat(60));
    console.log("📣 STUDENT SAID:");
    console.log("─".repeat(60));
    console.log(`"${transcript}"`);
    console.log("─".repeat(60) + "\n");

    // Step 4: Get coach response (with conversation context)
    console.log("🤖 STEP 4: Generating AI coach response with conversation context...");
    const coachResponse = await getCoachResponse(transcript, sessionId);
    console.log("\n" + "─".repeat(60));
    console.log("👨‍🏫 COACH RESPONSE:");
    console.log("─".repeat(60));
    console.log(coachResponse);
    console.log("─".repeat(60) + "\n");

    // Step 5: Convert to speech
    console.log("🔊 STEP 5: Converting coach response to speech with Vogent...");
    const audioBuffer = await textToSpeech(coachResponse);
    const audioSize = (audioBuffer.byteLength / 1024).toFixed(2);
    console.log(`✅ Audio generated: ${audioSize} KB`);

    // Clean up temp file
    fs.unlinkSync(tempPath);
    console.log("🗑️  Temporary file cleaned up");

    // Return response with audio as base64
    console.log("\n" + "=".repeat(60));
    console.log("✅ ANALYSIS COMPLETE - Sending response to client");
    console.log("=".repeat(60) + "\n");

    res.json({
      success: true,
      transcript,
      coachResponse,
      audioBase64: audioBuffer.toString("base64"),
    });
  } catch (error) {
    console.error("\n" + "❌ ".repeat(30));
    console.error("ERROR DURING ANALYSIS:");
    console.error("❌ ".repeat(30));
    console.error(`Message: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    console.error("❌ ".repeat(30) + "\n");

    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/transcribe
 * Transcribe audio file without coaching response
 */
app.post("/api/transcribe", async (req, res) => {
  try {
    if (!req.files || !req.files.audio) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    const audioFile = req.files.audio;
    const tempPath = path.join(__dirname, "../temp_audio_" + Date.now() + ".mp3");

    await audioFile.mv(tempPath);

    const jobId = await transcribeAudio(tempPath);
    await waitForTranscriptionCompletion(jobId);
    const transcript = await getTranscript(jobId);

    fs.unlinkSync(tempPath);

    res.json({ success: true, transcript });
  } catch (error) {
    console.error("Transcription Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/coach
 * Get coaching feedback for text (without transcription)
 */
app.post("/api/coach", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const coachResponse = await getCoachResponse(text);
    res.json({ success: true, coachResponse });
  } catch (error) {
    console.error("Coach Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/tts
 * Convert text to speech
 */
app.post("/api/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const audioBuffer = await textToSpeech(text);
    res.type("audio/mpeg").send(audioBuffer);
  } catch (error) {
    console.error("TTS Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Serve React app for other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 AI GRAMMAR COACH SERVER STARTED");
  console.log("=".repeat(60));
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`\n🔑 API Configuration:`);
  console.log(`   ✅ GEMINI_API: ${GEMINI_API_KEY ? "CONFIGURED ✓" : "❌ NOT SET"}`);
  console.log(`   ✅ SPEECHMATICS_KEY: ${SPEECHMATICS_KEY ? SPEECHMATICS_KEY.substring(0, 10) + "..." : "❌ NOT SET"}`);
  console.log(`   ✅ VOGENT_API_KEY: ${VOGENT_API_KEY ? VOGENT_API_KEY.substring(0, 10) + "..." : "❌ NOT SET"}`);
  console.log("\n📝 All systems ready! Audio analysis enabled.");
  console.log("=".repeat(60) + "\n");
});
