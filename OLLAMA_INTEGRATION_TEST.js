#!/usr/bin/env node
/**
 * Quick test to verify Ollama integration works
 * Run with: node OLLAMA_INTEGRATION_TEST.js
 */

import axios from "axios";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const OLLAMA_MODEL = "mistral";  // Much faster than llama3!

async function testOllamaIntegration() {
  console.log("\n" + "=".repeat(60));
  console.log("🦙 OLLAMA INTEGRATION TEST");
  console.log("=".repeat(60));

  const testSentence = "I are happy";

  const prompt = `Correct: "${testSentence}"`;

  try {
    console.log("\n📡 Connecting to Ollama...");
    console.log(`   URL: ${OLLAMA_URL}`);
    console.log(`   Model: ${OLLAMA_MODEL}`);
    console.log(`   Test sentence: "${testSentence}"\n`);

    console.log("⏳ Sending request (this may take 30 seconds to 2 minutes on first run)...\n");
    console.log("   ⚠️  First request is slower as Ollama loads the model into memory");

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
        timeout: 30000, // 30 seconds - Mistral is very fast
      }
    );

    const coachResponse = response.data?.response;

    if (coachResponse && coachResponse.trim()) {
      console.log("✅ SUCCESS! Ollama is working correctly.\n");
      console.log("─".repeat(60));
      console.log("👨‍🏫 COACH RESPONSE:");
      console.log("─".repeat(60));
      console.log(coachResponse.trim());
      console.log("─".repeat(60));
      console.log("\n✅ Your AI Grammar Coach is ready to use!");
      console.log("   Start the server with: npm run dev");
      console.log("   Then visit: http://localhost:5173\n");
    } else {
      console.error("❌ Empty response from Ollama");
      process.exit(1);
    }
  } catch (error) {
    console.error("\n" + "❌".repeat(30));
    console.error("OLLAMA CONNECTION FAILED");
    console.error("❌".repeat(30) + "\n");

    if (error.code === "ECONNREFUSED") {
      console.error("📍 Error: Ollama is not running");
      console.error("\n🔧 To fix this:");
      console.error("   1. Open a new terminal");
      console.error("   2. Run: ollama serve");
      console.error("   3. Wait for it to start");
      console.error("   4. Run this test again\n");
    } else if (error.response?.status === 404) {
      console.error("📍 Error: Model 'llama3' not found");
      console.error("\n🔧 To fix this:");
      console.error("   1. Install the model: ollama pull llama3");
      console.error("   2. Run this test again\n");
    } else {
      console.error("Error:", error.message);
      console.error("\nMake sure:");
      console.error("   - Ollama is running: ollama serve");
      console.error("   - Model is installed: ollama pull llama3");
      console.error("   - Ollama is accessible at: http://localhost:11434\n");
    }

    process.exit(1);
  }
}

testOllamaIntegration();
