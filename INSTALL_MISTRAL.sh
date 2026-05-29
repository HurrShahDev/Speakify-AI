#!/usr/bin/env bash
# Install Mistral model for instant responses

echo "🚀 Installing Mistral (much faster for conversation)..."
echo ""
echo "1️⃣  Make sure Ollama is running:"
echo "   olma serve"
echo ""
echo "2️⃣  Pull Mistral model (one-time, ~5-10 min):"
ollama pull mistral
echo ""
echo "3️⃣  Done! Now start the app:"
echo "   npm run dev"
echo ""
echo "⚡ Mistral is 3-5x FASTER than llama3!"
echo "   Expected response time: 1-3 seconds (instant feeling)"
