# Ollama Setup Guide - Local AI Fallback

## What is Ollama?

Ollama is a local AI inference engine that runs on your machine. It allows you to run language models offline without API quotas or fees.

The AI Grammar Coach uses Ollama as a **fallback** when the Gemini API quota is exceeded (429 error).

---

## Installation

### Windows

1. Download Ollama from: https://ollama.com/download
2. Run the installer and follow the setup
3. Ollama will start automatically and listen on `http://localhost:11434`

### macOS

```bash
# Install via Homebrew
brew install ollama

# Or download from https://ollama.com/download
```

### Linux

```bash
# Download and run installer
curl -fsSL https://ollama.ai/install.sh | sh
```

---

## Starting Ollama

### Option 1: Desktop App (Windows/macOS)
- Ollama starts automatically when you launch the app
- Check the system tray/menu bar

### Option 2: Command Line (Any OS)

```bash
# Start Ollama server
ollama serve

# Keep this terminal window open while using the Grammar Coach
```

You should see:
```
2024/03/25 10:30:45 images.go Starting Ollama server
2024/03/25 10:30:45 router.go Listening on 127.0.0.1:11434
```

---

## Download the Required Model

Before first use, download the `llama3` model:

```bash
# In a new terminal (Ollama server must be running)
ollama pull llama3

# This downloads ~4.7 GB - first time only
# Subsequent runs will be instant
```

Output should end with:
```
pulling ab9b77b93c76... 100% ▕████████▏ 3.8 GB
```

---

## How It Works

**Normal Flow (Gemini Working):**
```
User speaks → Speech to text (Speechmatics)
→ Grammar analysis (Gemini API) ✅
→ Text to speech (Vogent)
→ User hears response
```

**Fallback Flow (Gemini Quota Exceeded):**
```
User speaks → Speech to text (Speechmatics)
→ Grammar analysis attempt (Gemini API) ❌ 429 Quota
→ Falling back to local AI
→ Grammar analysis (Ollama + llama3) ✅
→ Text to speech (Vogent)
→ User hears response
```

---

## Testing the Fallback

### Verify Ollama is Running

```bash
curl http://localhost:11434/api/tags
```

Should return:
```json
{
  "models": [
    {
      "name": "llama3:latest",
      "size": 4017063908,
      ...
    }
  ]
}
```

### View Fallback Logs

When you use the Grammar Coach, check your server terminal for:

**If Gemini succeeds:**
```
🤖 Using Gemini
  📡 POST https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent
  ✅ Status: 200
  ✅ Got response from Gemini
```

**If Gemini fails → Ollama fallback:**
```
🤖 Using Gemini
  📡 POST https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent
  ❌ Gemini error (Status: 429)

🔄 Falling back to local AI
  🦙 Trying local Ollama (llama3)...
  📡 Ollama Status: 200
  ✅ Got response from Ollama
```

---

## Troubleshooting

### Ollama Connection Refused

```
❌ Ollama error:
   ⚠️  Ollama not running at http://localhost:11434
   To start Ollama: ollama serve
```

**Fix:** Start Ollama server:
```bash
ollama serve
```

### Model Not Found

```
Error loading model llama3
```

**Fix:** Download the model:
```bash
ollama pull llama3
```

### Very Slow Response

Ollama on first run can be slow (10-30 seconds). Subsequent runs are faster (~5 seconds).

If consistently very slow:
- Check available RAM (llama3 needs ~4 GB)
- Close other applications
- Check CPU usage

### Ollama Keeps Unloading Model

After ~5 minutes without use, Ollama unloads the model to free RAM. Next request will reload it (slower).

This is normal behavior.

---

## Performance Notes

| Provider | Speed | Cost | Reliability |
|----------|-------|------|-------------|
| **Gemini** | Fast (2-3s) | Free tier, then paid | High (cloud) |
| **Ollama** | Slower (5-30s) | Free | High (local) |

**When Gemini Works:** AI Grammar Coach uses Gemini (faster)
**When Gemini Fails:** Automatically uses Ollama (slower, but always works)

---

## Disabling Ollama Fallback

If you want to disable the Ollama fallback and only use Gemini:

In `server/index.js`, find this line in `getCoachResponse()`:

```javascript
if (shouldFallback) {
  // ... fallback code
  return await getOllamaResponse(text);
}
```

Change to:

```javascript
if (shouldFallback) {
  // Ollama fallback disabled for this deployment
  throw error;
}
```

---

## Resources

- **Ollama Website:** https://ollama.com
- **Ollama GitHub:** https://github.com/ollama/ollama
- **Available Models:** https://ollama.com/library
- **Llama3 Model:** https://ollama.com/library/llama3

---

## FAQ

**Q: Does Ollama require internet?**
A: No. Once downloaded, it runs fully offline.

**Q: Will it use my GPU?**
A: Yes, automatically if supported (NVIDIA, AMD, Metal on Mac).

**Q: Can I use other models besides llama3?**
A: Yes. Edit the model name in `server/index.js` line ~144:
   ```javascript
   const model = "mistral"; // or llama2, neural-chat, etc.
   ```
   Then: `ollama pull mistral`

**Q: How much disk space?**
A: Llama3 = ~4.7 GB

**Q: Can I run multiple models?**
A: Yes. Download them: `ollama pull mistral` then switch in code.

---

**Setup complete!** Your AI Grammar Coach now has automatic fallback to local AI. 🚀
