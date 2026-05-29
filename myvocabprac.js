import axios from "axios";
import fs from "fs";
import FormData from "form-data";

// 🔑 API Keys
const SPEECHMATICS_KEY = "bfQLKDqy5BXexh7shY5IDVSKmHmVOaPc";
const API_KEY = "elto_9sHnHUdslEA7cnsP2vph3UgLGAgi6TL5";
const BASE_URL = "https://api.vogent.ai/api";

// Ollama Configuration
const OLLAMA_URL = "http://localhost:11434/api/generate";
const OLLAMA_MODEL = "mistral";  // Much faster than llama3!

const AUDIO_FILE = "sample_3.mp3";

// ========================================
// STEP 1: Speech to Text (Speechmatics)
// ========================================
async function transcribe() {
  if (!fs.existsSync(AUDIO_FILE)) {
    console.error(`❌ File nahi mili: "${AUDIO_FILE}"`);
    return;
  }

  const form = new FormData();
  form.append("data_file", fs.createReadStream(AUDIO_FILE));
  form.append("config", JSON.stringify({
    type: "transcription",
    transcription_config: { language: "en" },
  }));

  try {
    console.log("=".repeat(55));
    console.log("🎓 MY VOCAB PRACTICE — English Speaking Coach");
    console.log("=".repeat(55));
    console.log("\n🚀 Step 1: Uploading audio to Speechmatics...");

    const response = await axios.post(
      "https://asr.api.speechmatics.com/v2/jobs/",
      form,
      { headers: { Authorization: `Bearer ${SPEECHMATICS_KEY}`, ...form.getHeaders() } }
    );

    const jobId = response.data.id;
    console.log("✅ Job Created! ID:", jobId);
    checkStatus(jobId);

  } catch (error) {
    console.error("❌ Speechmatics Upload Error:", error.response?.data || error.message);
  }
}

// ========================================
// STEP 2: Check Transcription Status
// ========================================
async function checkStatus(jobId) {
  try {
    const response = await axios.get(
      `https://asr.api.speechmatics.com/v2/jobs/${jobId}`,
      { headers: { Authorization: `Bearer ${SPEECHMATICS_KEY}` } }
    );

    const status = response.data.job.status;

    if (status === "done") {
      console.log("✨ Transcription complete!");
      getTranscript(jobId);
    } else if (status === "rejected") {
      console.error("❌ Job reject ho gayi.");
    } else {
      console.log(`⏳ Status: ${status}... 3 seconds mein dobara check karenge.`);
      setTimeout(() => checkStatus(jobId), 3000);
    }
  } catch (error) {
    console.error("❌ Status Check Error:", error.message);
  }
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

    const transcript = response.data.results
      .map(item => item.alternatives ? item.alternatives[0].content : "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    console.log("\n📝 Student said:", transcript);

    await callOllamaCoach(transcript);

  } catch (error) {
    console.error("❌ Transcript Fetch Error:", error.message);
  }
}

// ========================================
// STEP 4: Gemini English Coach
// ========================================
async function callOllamaCoach(text) {
  const prompt = `You are a friendly and intelligent English speaking coach. When the user speaks, respond naturally like a real teacher in conversation. Begin with a short encouragement related only to the student’s effort in learning English, such as improving vocabulary, practicing speaking, or trying to form sentences. Do not praise the student’s activities or content of the sentence (for example, do not say things like “It is great that you are sharing your day”). After the encouragement, gently correct grammar mistakes and suggest better vocabulary if possible. Speak directly to the student in an encouraging and supportive tone while focusing on improving the sentence. Keep the reply short, only 3–4 complete sentences, and always finish the last sentence completely. Ignore punctuation errors from speech-to-text and treat the input as spoken language. Do not use bullet points, numbering, or robotic formatting, - Focus ONLY on grammar mistakes.
- Do NOT point out capitalization mistakes.
- Do NOT point out punctuation spacing mistakes.
- Do NOT correct minor formatting issues.
- Ignore capitalization errors like "i" instead of "I".
- Ignore extra spaces before or after punctuation.
- Only mention grammar issues such as verb tense, subject-verb agreement, articles, prepositions, and sentence structure.
- If the sentence has no grammar mistake, praise the user and encourage them and do not ask follow-up questions. Only correct, improve, and briefly explain the student’s sentence: "${text}"`

  try {
    console.log(`\n🤖 Step 4: Getting coach response from Ollama (${OLLAMA_MODEL})...`);

      const response = await axios.post(
        OLLAMA_URL,
        {
          model: OLLAMA_MODEL,
          prompt: prompt,
          stream: false,
          num_predict: 80,    // Ultra-short responses - instant
          temperature: 0.2,   // Very low = fastest output
          top_p: 0.9,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 30000,  // 30 seconds - Mistral is fast
        }
      );

      const coachSays = response.data?.response;

      if (coachSays && coachSays.trim()) {
        const cleanResponse = coachSays.trim();

        console.log("\n👨‍🏫 --- COACH RESPONSE ---");
        console.log(cleanResponse);
        console.log("---------------------------\n");

        await textToSpeech(cleanResponse);
        return;
      }

      throw new Error("Empty response from Ollama");

    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        console.error("❌ Ollama not running at", OLLAMA_URL);
        console.error("   To start: ollama serve");
        console.error("   To install Mistral: ollama pull mistral");
      } else {
        console.error("❌ Ollama error:", error.message);
      }
    }
}

// ========================================
// STEP 5: Text to Speech (Vogent)
// ========================================
async function textToSpeech(text) {
  try {
    console.log("🔊 Step 5: Converting to speech via Vogent...");

    const response = await axios.post(
      `${BASE_URL}/tts`,
      {
        text: text,
        voiceId: "36b87413-6d7b-421d-8745-bc0897770d1e", // ✅ FIXED: voice_id → voiceId
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
        timeout: 60000,
      }
    );

    const audioPath = "coach_response.mp3";
    fs.writeFileSync(audioPath, response.data);
    const fileSize = (response.data.byteLength / 1024).toFixed(1);
    console.log(`✅ Audio saved: "${audioPath}" (${fileSize} KB)`);
    console.log("🎧 File play karein coach ki awaaz sunne ke liye!");

  } catch (error) {
    const errorMsg = error.response?.data instanceof Buffer
      ? error.response.data.toString()
      : (error.response?.data || error.message);

    console.error("❌ TTS Error:", errorMsg);
  }
}


transcribe();