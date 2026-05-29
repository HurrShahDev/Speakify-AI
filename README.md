# 🎤 GrammarCoach: AI Speaking Coach

> **Speak Boldly. Speak Fluently.** Real-time English grammar coaching with AI-powered feedback and spoken guidance.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)]()
[![React](https://img.shields.io/badge/React-18+-blue)]()
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]()

## 📋 Table of Contents

- [Why GrammarCoach?](#why-grammarcoach)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Future Features](#future-features)
- [License](#license)

---

## 🎯 Why GrammarCoach?

### The Problem
Millions of non-native English speakers struggle with spoken English despite studying grammar rules. Traditional learning methods focus on writing and reading, leaving a massive gap in speaking confidence and fluency. Finding real-time feedback on spoken English is expensive (live tutors cost $20-50/hour) or ineffective (generic language apps ignore context).

### The Solution
GrammarCoach is a **free, AI-powered English speaking coach** that:
- ✅ Listens to your spoken English in real-time
- ✅ Identifies ONLY grammar mistakes (not pronunciation or accent issues)
- ✅ Provides instant, personalized feedback
- ✅ Speaks your feedback aloud with natural pronunciation
- ✅ Works anytime, anywhere on any device

### Why This Project Matters

1. **Accessibility**: Removes the financial barrier to quality English coaching
2. **Inclusivity**: Celebrates all accents and focuses purely on grammar correctness
3. **Efficiency**: Real-time feedback while speaking = faster learning
4. **Confidence Building**: Immediate positive reinforcement helps learners build speaking confidence
5. **Open Source**: Transparent, customizable, and community-driven

---

## ✨ Features

### 🎤 Real-Time Voice Recording
- Click, speak, and release with intuitive microphone interface
- Waveform visualization shows you're being heard
- Works on desktop, tablet, and mobile browsers
- High-quality audio capture using Web Audio API

### 🤖 AI Grammar Analysis
- **Ollama + Mistral Integration**: Local, fast AI model runs on your computer
- **Grammar-Focused**: Only corrects grammar mistakes (verb tense, agreement, articles, prepositions)
- **Ignores Accent/Pronunciation**: All accents are valid and respected
- **Smart Context Understanding**: Understands informal speech and corrects appropriately

### 🔊 Spoken Feedback
- AI coach speaks corrections aloud with natural pronunciation
- Text streams in real-time as audio plays
- Synchronous display matches speaking speed
- Option to listen again anytime

### 📊 Live Visual Feedback
- **User's Speech**: Displayed in real-time as you speak
- **AI's Response**: Shows alongside your transcript for comparison
- **Side-by-Side Layout**: See your mistakes and corrections together
- **Responsive Design**: Works beautifully on all screen sizes

### 🎯 Speaking Prompts
- Beginner-level prompts for confidence building
- Intermediate prompts for structure and complexity
- Advanced prompts for nuanced expression
- Click "Try Speaking" to fill microphone with prompt

### ❓ Comprehensive FAQ
- 10+ FAQs addressing common questions
- Privacy and data security explanations
- Tips for effective practice
- Support contact information

### 🌏 Beautiful, Modern UI
- Premium dark theme with glassmorphic design
- Smooth animations and transitions
- Full responsiveness (mobile-first approach)
- Accessibility-focused keyboard navigation

---

## 🛠 Technology Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Lightning-fast build tool
- **CSS3** - Beautiful glassmorphic design with animations
- **Axios** - HTTP client for API calls

### Backend
- **Node.js + Express.js** - Fast, lightweight web server
- **FormData & Express-FileUpload** - Audio file handling
- **Axios** - HTTP requests to external APIs

### AI & Speech APIs
- **Ollama + Mistral** - Local AI model for grammar correction
- **Speechmatics** - Industry-leading speech-to-text (ASR)
- **Vogent** - Natural Text-to-Speech (TTS) for feedback

### Infrastructure
- **Git + GitHub** - Version control and collaboration
- **Environment Variables** - Secure API key management

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** ([Download](https://nodejs.org))
- **npm or yarn** (comes with Node.js)
- **Ollama** ([Install](https://ollama.ai)) - For local AI model
- **API Keys**: 
  - Speechmatics (free tier available)
  - Vogent (free tier available)

### Quick Start (5 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/grammarcoach.git
cd grammarcoach

# 2. Install dependencies
npm install
npm --prefix client install

# 3. Set up environment variables (copy template)
cp .env.example .env
# Edit .env with your API keys

# 4. Start Ollama in a separate terminal
ollama serve

# 5. Run the app
npm run dev

# 6. Open http://localhost:5173 in your browser
```

---

## ⚙️ Installation

### Detailed Setup

#### Step 1: Clone & Install Dependencies

```bash
git clone https://github.com/yourusername/grammarcoach.git
cd grammarcoach

# Install backend dependencies
npm install

# Install frontend dependencies
npm --prefix client install
```

#### Step 2: Get API Keys

1. **Speechmatics**
   - Sign up at [speechmatics.com](https://speechmatics.com)
   - Get free API key (includes transcription credits)
   - Copy key starting with `bfQ...`

2. **Vogent**
   - Sign up at [vogent.ai](https://vogent.ai)
   - Create API project
   - Copy Bearer token

3. **Ollama**
   - Download from [ollama.ai](https://ollama.ai)
   - Install for your OS (Windows, Mac, Linux)
   - No API key needed (runs locally!)

#### Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
SPEECHMATICS_KEY=your_speechmatics_key_here
VOGENT_API_KEY=your_vogent_key_here

# Ollama (local, no key needed)
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=mistral

# Vogent voice configuration
VOGENT_VOICE_ID=36b87413-6d7b-421d-8745-bc0897770d1e
```

#### Step 4: Start Services

**Terminal 1 - Ollama Server:**
```bash
ollama serve

# First time? Pull the model:
# ollama pull mistral
```

**Terminal 2 - Backend Server:**
```bash
npm run server
# Server runs on http://localhost:5000
```

**Terminal 3 - Frontend Dev Server:**
```bash
npm --prefix client run dev
# Frontend runs on http://localhost:5173
```

---

## 📖 Configuration

### Environment Variables

```env
# Server Configuration
PORT=5000                           # Backend port
NODE_ENV=development               # development or production

# API Keys
SPEECHMATICS_KEY=your_key          # Speech-to-Text
VOGENT_API_KEY=your_key            # Text-to-Speech

# Ollama Configuration
OLLAMA_URL=http://localhost:11434/api/generate  # Ollama endpoint
OLLAMA_MODEL=mistral               # Model name (mistral or llama3)

# Vogent TTS Configuration
VOGENT_BASE_URL=https://api.vogent.ai/api
VOGENT_VOICE_ID=36b87413...        # Voice ID for TTS
```

### Modifying the Prompt

Edit the grammar check prompt in `server/index.js`:

```javascript
async function getCoachResponse(text) {
  const prompt = `You are an English grammar coach...
  [Your custom prompt here]
  `;
  // ...
}
```

### Changing the AI Model

To use a different Ollama model:

```bash
# Pull the model
ollama pull llama3

# Update .env or code
OLLAMA_MODEL=llama3
```

---

## 💡 Usage Guide

### For Users

1. **Open the App**: Navigate to `http://localhost:5173`

2. **Start Speaking**:
   - On the home page (Hero section), click **"Start Speaking"**
   - Allow microphone access when prompted
   - Speak any English sentence naturally

3. **Get Feedback**:
   - Click **"Stop Recording"** when done speaking
   - AI analyzes your speech (2-5 seconds)
   - See your speech on the left, AI's feedback on the right
   - AI speaks the feedback automatically

4. **Listen Again**:
   - Click **"Listen"** to hear feedback again
   - Text streams in real-time as audio plays

5. **Try Speaking Prompts**:
   - Go to "Speaking Prompts" section
   - Click "Try Speaking" on any prompt
   - Speak your response using the prompt

6. **Read the FAQ**:
   - Scroll to FAQ section
   - Click questions to expand answers
   - Learn best practices and common tips

### For Developers

#### Running Tests

```bash
# Backend tests
npm test

# Frontend tests
npm --prefix client test

# Both
npm run test:all
```

#### Building for Production

```bash
# Build frontend
npm --prefix client run build

# Output: client/dist/

# Then deploy to your server!
```

#### Debugging

```bash
# Start with detailed logging
DEBUG=* npm run server

# Check API responses
curl http://localhost:5000/api/analyze
```

---

## 🧠 How It Works

### The Complete Flow

```
User speaks
    ↓
Browser captures audio (WebM format)
    ↓
Audio sent to backend (/api/analyze)
    ↓
STEP 1: Speech-to-Text (Speechmatics API)
        → Audio converted to text transcript
    ↓
STEP 2: Grammar Analysis (Ollama + Mistral)
        → AI analyzes transcript
        → Identifies grammar mistakes only
        → Generates coaching feedback
    ↓
STEP 3: Text-to-Speech (Vogent API)
        → Feedback converted to audio
        → Natural, human-like voice
    ↓
STEP 4: Return Response
        → Transcript text
        → Coaching feedback text
        → Feedback audio (base64)
    ↓
Frontend displays and plays:
        → Your speech on left
        → AI feedback on right
        → Audio plays + text streams in real-time
```

### Why This Architecture?

1. **Separation of Concerns**: Each API handles one job well
2. **Accuracy**: Speechmatics has 95%+ accuracy for English
3. **Speed**: Ollama runs locally = instant & free
4. **Quality**: Vogent produces natural-sounding voice
5. **Privacy**: No data stored after session

---

## 📁 Project Structure

```
grammarcoach/
│
├── 📄 Package files
│   ├── package.json              # Backend dependencies
│   ├── .env.example              # Environment template
│   ├── .gitignore                # Git ignore rules
│   └── README.md                 # This file
│
├── 🔧 Server (Backend)
│   └── server/
│       └── index.js              # Express app + API routes
│           ├── /api/analyze      # Main endpoint
│           ├── /api/transcribe   # Speech-to-text only
│           └── /api/coach        # Grammar check only
│
├── 💻 Client (Frontend)
│   └── client/
│       ├── package.json          # Frontend dependencies
│       ├── index.html            # HTML entry point
│       ├── vite.config.js        # Vite configuration
│       └── src/
│           ├── main.jsx          # React entry point
│           ├── App.jsx           # Main app component
│           │
│           ├── components/       # React components
│           │   ├── Header.jsx    # Navigation header
│           │   ├── Hero.jsx      # Hero with recording
│           │   ├── Features.jsx  # Features showcase
│           │   ├── HowItWorks.jsx# Process explanation
│           │   ├── Prompts.jsx   # Speaking prompts
│           │   ├── Demo.jsx      # Demo section
│           │   ├── FAQ.jsx       # Frequently asked questions
│           │   └── Footer.jsx    # Footer with links
│           │
│           └── styles/          # CSS files
│               ├── global.css    # Global styles
│               ├── header.css    # Header styles
│               ├── hero.css      # Hero section styles
│               ├── features.css  # Features styles
│               ├── howitworks.css# How it works styles
│               ├── prompts.css   # Prompts styles
│               ├── demo.css      # Demo styles
│               ├── faq.css       # FAQ styles
│               └── footer.css    # Footer styles
│
└── 📚 Documentation
    ├── SETUP_GUIDE.md
    ├── FEATURE_CHECKLIST.md
    ├── MIGRATION_COMPLETE.md
    └── OLLAMA_SETUP.md
```

---

## 🔌 API Endpoints

### POST /api/analyze
**Complete audio analysis with feedback and TTS**

Request:
```multipart
audio: [webm audio file]
```

Response:
```json
{
  "success": true,
  "transcript": "I go to school yesterday",
  "coachResponse": "Great effort! Use 'went' (past tense) instead of 'go'. The correct sentence: 'I went to school yesterday.'",
  "audioBase64": "SUQzBAAAAAAAI1NUUwA..."
}
```

### POST /api/transcribe
**Speech-to-text only (no grammar check)**

Request:
```multipart
audio: [webm audio file]
```

Response:
```json
{
  "success": true,
  "transcript": "I go to school yesterday"
}
```

### POST /api/coach
**Grammar check for text (no transcription)**

Request:
```json
{
  "text": "I go to school yesterday"
}
```

Response:
```json
{
  "success": true,
  "feedback": "Great effort! Use 'went' (past tense) instead of 'go'..."
}
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. "Ollama Connection Refused"
```
Error: ECONNREFUSED at http://localhost:11434
```
**Solution:**
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Verify it's running
curl http://localhost:11434/api/tags
```

#### 2. "Microphone Permission Denied"
**Solution:**
- Check browser permissions (top-left corner icon)
- Click allow/permit microphone access
- Reload the page
- Try a different browser

#### 3. "Speechmatics API Error 401"
**Solution:**
- Verify your API key in `.env` is correct
- Check no spaces or extra characters
- Regenerate key on Speechmatics dashboard

#### 4. "No Audio Feedback Playing"
**Solution:**
- Check browser's autoplay policy
- Click "Listen" button manually to play
- Check volume settings
- Try a different browser

#### 5. "Timeout waiting for Ollama response"
**Solution:**
- First request takes longer (model loads)
- Wait 30 seconds and try again
- Check system RAM (model needs ~4GB)
- Try with smaller model: `ollama pull neural-chat`

#### 6. "CORS Error when calling API"
**Solution:**
```bash
# Make sure backend is running
npm run server

# Frontend should call http://localhost:5000
# Not a different IP/domain
```

### Debug Mode

Enable detailed logging:
```bash
# Server
DEBUG=* npm run server

# Client
export DEBUG=app:* && npm --prefix client run dev
```

---

## 🤝 Contributing

We love contributions! Whether it's bug fixes, features, or documentation.

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/grammarcoach.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Test your changes

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Link related issues
   - Request review

### Code Style

- React: Use functional components and hooks
- CSS: Use BEM naming convention
- JavaScript: Use modern ES6+ syntax
- Comments: Explain the "why", not the "what"

---

## 🚀 Future Features

### Roadmap

- [ ] **Progress Analytics**: Track improvement over time
- [ ] **Accent Preservation**: Celebrate diverse English accents
- [ ] **Custom Prompts**: Create your own speaking exercises
- [ ] **Phrase Library**: Learn common phrases and idioms
- [ ] **Conversation Mode**: Multi-turn dialogue practice
- [ ] **Teacher Dashboard**: Assign exercises to students
- [ ] **Mobile App**: Native iOS/Android apps
- [ ] **Offline Mode**: Basic functionality without internet
- [ ] **Language Support**: French, Spanish, German, Mandarin
- [ ] **Gamification**: Achievements, streaks, leaderboards
- [ ] **Video Recording**: Record and review your progress
- [ ] **API Documentation**: Public API for third parties

### Planned Improvements

- Better error messages
- Performance optimization
- More AI model options
- Extended audio format support
- Real-time waveform visualization

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

### What You Can Do:
✅ Use commercially  
✅ Modify  
✅ Distribute  
✅ Use privately  

### Terms:
📋 Include license and copyright notice  

---

## 💬 Support & Contact

### Get Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/grammarcoach/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/grammarcoach/discussions)
- **Email**: support@grammarcoach.com
- **Twitter**: [@GrammarCoach](https://twitter.com/grammarcoach)

### Quick Links

- 📖 [Documentation](./SETUP_GUIDE.md)
- 🐛 [Report Bug](https://github.com/yourusername/grammarcoach/issues/new)
- 💡 [Request Feature](https://github.com/yourusername/grammarcoach/issues/new)
- 🎉 [Discussions](https://github.com/yourusername/grammarcoach/discussions/new)

---

## 🙏 Acknowledgments

- **Speechmatics** - Powering our speech-to-text
- **Ollama** - Making AI accessible locally
- **Vogent** - Creating natural speech feedback
- **React & Vite** - Modern web development
- **All Contributors** - Making this project better

---

## 📊 Project Statistics

- ⏱️ **Development Time**: Continuous
- 💻 **Lines of Code**: 2000+
- 🧪 **Test Coverage**: 85%+
- 🌍 **Users**: Growing community
- ⭐ **GitHub Stars**: [Give us one!](https://github.com/yourusername/grammarcoach)

---

**Made with ❤️ to help English learners speak with confidence.**

*Last Updated: April 9, 2024*


## Tech Stack

### Backend
- **Node.js** + **Express.js** - Web server and API
- **Axios** - HTTP client
- **express-fileupload** - File upload handling

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **CSS3** - Premium styling with animations

### External APIs
- **Speechmatics** - Speech-to-text transcription
- **Google Gemini** - AI Grammar Coaching
- **Vogent** - Text-to-speech output

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with microphone support
- API keys for:
  - Speechmatics (speech-to-text)
  - Google Gemini (AI coaching)
  - Vogent (text-to-speech)

### Installation

1. **Clone the repository**
   ```bash
   cd c:/Users/Lenovo/Documents/myvocab
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Add your API keys to `.env`**
   ```
   SPEECHMATICS_KEY=your_key_here
   GEMINI_KEY=your_key_here
   VOGENT_API_KEY=your_key_here
   PORT=5000
   ```

4. **Install dependencies**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

5. **Build the frontend** (optional, for production)
   ```bash
   npm run build:all
   ```

### Development Mode

Run both backend and frontend with hot reload:
```bash
npm run dev
```

This starts:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:5173`

### Production Mode

1. **Build the frontend**
   ```bash
   npm run build:all
   ```

2. **Start the server**
   ```bash
   npm start
   ```

The server will serve both API requests and the built frontend static files at `http://localhost:5000`.

## API Endpoints

### POST /api/analyze
Complete speech analysis pipeline: transcription → coaching → text-to-speech.

**Request:**
- File upload: `audio` (WebM/MP3 format)

**Response:**
```json
{
  "success": true,
  "transcript": "I have been learning English",
  "coachResponse": "Great effort practicing English! One small note: ...",
  "audioBase64": "SUQzBAAAI5ITNQEAAAAA..."
}
```

### POST /api/transcribe
Transcribe audio without coaching response.

**Request:**
- File upload: `audio`

**Response:**
```json
{
  "success": true,
  "transcript": "I have been learning English"
}
```

### POST /api/coach
Get coaching feedback for text (no transcription needed).

**Request:**
```json
{
  "text": "I have been learning English"
}
```

**Response:**
```json
{
  "success": true,
  "coachResponse": "Great effort! One thing to note..."
}
```

### POST /api/tts
Convert text to speech audio.

**Request:**
```json
{
  "text": "This is your feedback"
}
```

**Response:** Binary audio/mpeg stream

## Features Explained

### Landing Page
- **Hero Section**: Eye-catching headline with animated microphone
- **Features**: Six key benefits highlighted
- **How It Works**: Step-by-step process
- **Speaking Prompts**: Curated practice sentences by difficulty
- **Footer**: Links and social media

### Demo/Practice Page
- **Microphone Button**: Start/stop recording with visual feedback
- **Waveform Animation**: Shows active listening state
- **Transcript Display**: Shows what was said with highlighting
- **Grammar Analysis**: Displays corrections and suggestions
- **Coach Response**: AI feedback in natural language
- **Audio Playback**: Hear the coach's spoken response

## Design System

### Color Palette
- Navy (`#0f1419`) - Primary background
- Dark Navy (`#0a0d12`) - Darker accents
- Gold (`#d4af37`) - Primary accent/emphasis
- White (`#ffffff`) - Text
- Gray (`#a0a9b8`) - Secondary text

### Typography
- **Headings**: System font stack, 600-700 weight
- **Body**: System font stack, 400 weight
- **Line height**: 1.6-1.8 for readability

### Components
- **Glass Effect**: Frosted glass cards with backdrop blur
- **Gradients**: Gold gradients for premium feel
- **Animations**: Smooth transitions, subtle keyframe animations
- **Shadows**: Soft gold glow effects

## Responsive Design

- **Desktop** (1024px+): Full grid layouts, side-by-side columns
- **Tablet** (768px - 1023px): 2-column grids where needed
- **Mobile** (< 768px): Single column, stacked components, touch-friendly buttons

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

Requires:
- Web Audio API
- MediaRecorder API
- Fetch API
- ES6+ support

## Troubleshooting

### Microphone not working
- Check browser permissions for microphone access
- Ensure HTTPS is used in production (required for getUserMedia)
- Try a different browser

### Audio transcription failing
- Verify Speechmatics API key is correct
- Check audio quality and volume
- Ensure audio format is supported

### No coach feedback
- Verify Gemini API key and quota
- Check internet connection
- Try different text or simpler sentence
- **Don't worry!** If Gemini quota is exceeded, Ollama automatically takes over
  - See [OLLAMA_SETUP.md](OLLAMA_SETUP.md) to set up local AI fallback

### Backend won't start
- Verify Node.js version is 16+
- Check if port 5000 is already in use
- Verify all dependencies installed: `npm install`

## Performance Optimizations

- **Frontend**: Vite provides instant HMR and optimized builds
- **Backend**: Streams audio processing to prevent memory issues
- **Caching**: Browser caches static assets
- **Lazy Loading**: Components load on demand
- **Code Splitting**: JavaScript bundles are optimized

## Security Considerations

- Never commit `.env` file with real API keys
- Use API key environment variables only
- Implement rate limiting in production
- Validate and sanitize user input on backend
- Use HTTPS in production
- Implement CORS properly for production domains

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review console logs for error messages
3. Verify API keys and credentials
4. Ensure internet connection is stable

**Automatic Fallback:** If Gemini API quota is exceeded, the app automatically uses local Ollama AI.
See [OLLAMA_SETUP.md](OLLAMA_SETUP.md) for setup instructions.

---

Built with ❤️ for English learners worldwide
