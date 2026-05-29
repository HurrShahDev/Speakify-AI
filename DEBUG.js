#!/usr/bin/env node
/**
 * Debug Helper - Shows terminal output from API calls
 * Run this to see what the server is doing step-by-step
 */

import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_URL = "http://localhost:5000";

console.log(`
╔${"═".repeat(58)}╗
║  AI Grammar Coach - Terminal Debug Output Monitor    ║
║                                                      ║
║  This shows what happens in the server terminal     ║
║  when you make requests through the UI              ║
╚${"═".repeat(58)}╝

🎯 TEST SCENARIO:
─────────────────────────────────────────────────────
1. Make sure the server is running: npm run dev
2. Open the UI at http://localhost:5173
3. Click the microphone button and speak
4. Watch this terminal to see:
   - Speech-to-text output
   - Grammar analysis process
   - Coach feedback response
   - Any errors or issues

📊 SERVER OUTPUT FORMAT:
─────────────────────────────────────────────────────
You should see output like:

[0] ============================================================
[0] 🎤 NEW ANALYSIS REQUEST STARTED
[0] ============================================================
[0] 📥 Audio file received: XX.XX KB
[0]
[0] 📝 STEP 1: Transcribing audio with Speechmatics...
[0]   ✅ Job ID: abc-123-def
[0]
[0] ⏳ STEP 2: Waiting for transcription to complete...
[0]   Attempt 1/30: Status = submitted
[0]   Attempt 2/30: Status = done
[0]   ✅ Transcription ready!
[0]
[0] 🔤 STEP 3: Fetching transcript text...
[0]   ✅ Transcript API response received
[0]   📊 Total results: 5
[0]     [0] "I have" (confidence: 0.95)
[0]     [1] "been learning" (confidence: 0.98)
[0]     [2] "English" (confidence: 0.99)
[0]   ✅ Final transcript: "I have been learning English"
[0]
[0] ─────────────────────────────────────────────────────────────────
[0] 📣 STUDENT SAID:
[0] ─────────────────────────────────────────────────────────────────
[0] "I have been learning English"
[0] ─────────────────────────────────────────────────────────────────
[0]
[0] 🤖 STEP 4: Generating AI coach response from Ollama...
[0]   🦙 Using local Ollama (llama3)
[0]     Status: 200
[0]     ✅ Got response from Ollama
[0]
[0] ─────────────────────────────────────────────────────────────────
[0] 👨‍🏫 COACH RESPONSE:
[0] ─────────────────────────────────────────────────────────────────
[0] Great effort practicing English! Keep it up...
[0] ─────────────────────────────────────────────────────────────────
[0]
[0] 🔊 STEP 5: Converting coach response to speech with Vogent...
[0]   📤 Sending text to Vogent (length: 45 chars)
[0]   ✅ Audio received from Vogent: 12.34 KB
[0]
[0] ============================================================
[0] ✅ ANALYSIS COMPLETE - Sending response to client
[0] ============================================================

✅ TROUBLESHOOTING GUIDE:
─────────────────────────────────────────────────────────────
❌ "Job ID: undefined"
   → Speechmatics API key is wrong
   → Check .env file for SPEECHMATICS_KEY
   → Test: curl -H "Authorization: Bearer KEY" ...

❌ "Status = rejected"
   → Audio format not supported
   → Try shorter, clearer speech
   → Check audio quality

❌ "Ollama not running"
   → Ollama service is not started
   → Run: ollama serve
   → Make sure model llama3 is installed: ollama pull llama3
   → Check: http://localhost:11434/api/generate (should be reachable)

❌ "Connection refused"
   → Ollama is not running or not accessible
   → Start Ollama: ollama serve
   → Check firewall settings

❌ "Vogent TTS Error: 401"
   → Vogent API key is wrong
   → Check .env for VOGENT_API_KEY

📝 CHECKING YOUR .env FILE:
─────────────────────────────────────────────────────────────
Run this to see your config:
  cat .env

Make sure you have:
  ✓ SPEECHMATICS_KEY=your_key
  ✓ VOGENT_API_KEY=your_key
  ✓ PORT=5000

And Ollama is running:
  ollama serve

${"\n"} Ready to test? Start speaking in the UI! 🎤
`);

process.on("SIGINT", () => {
  console.log("\n\n✅ Debug monitor stopped");
  process.exit(0);
});

console.log("Listening for requests...\n");
