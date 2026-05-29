# Quick Start Guide - AI Grammar Coach

## ⚡ Quick Setup (5 minutes)

### Step 1: Install Dependencies

```bash
cd c:/Users/Lenovo/Documents/myvocab

# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 2: Configure API Keys

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```
SPEECHMATICS_KEY=bfQLKDqy5BXexh7shY5IDVSKmHmVOaPc
GEMINI_KEY=AIzaSyDcieHBLULYnC1zFmj3b9EMTPRc0WPQIfI
VOGENT_API_KEY=elto_9sHnHUdslEA7cnsP2vph3UgLGAgi6TL5
PORT=5000
```

### Step 3: Start Development

```bash
npm run dev
```

This will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

Open your browser to `http://localhost:5173` and start practicing!

---

## 🚀 Production Build

### Build the Frontend

```bash
npm run build:all
```

This installs all dependencies and builds the optimized frontend in `client/dist`.

### Run Production Server

```bash
npm start
```

The server will serve everything on `http://localhost:5000`.

---

## 📁 Project Structure at a Glance

```
myvocab/
├── server/
│   └── index.js                 # Backend API (Express.js)
├── client/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── styles/              # CSS files
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite configuration
│   └── package.json             # Client dependencies
├── package.json                 # Root configuration
├── .env                         # API keys (create from .env.example)
└── README.md                    # Full documentation
```

---

## 🎬 How to Use the App

### Landing Page
1. Open the app and explore the landing page
2. Read about features, how it works, and practice prompts
3. Click "Try Demo" to jump to the demo section or "Start Speaking" to begin

### Demo/Practice Section
1. Click the large **🎤 microphone button**
2. Speak any English sentence clearly
3. Your AI coach will:
   - 📝 Transcribe your speech
   - ✨ Analyze grammar mistakes
   - 🤖 Provide personalized feedback
   - 🔊 Speak the feedback back to you
4. Click **Play Feedback** to hear the coach's spoken response
5. Click **Try Again** to practice more

### Suggested Test Phrases
- "I have been learning English for two years now"
- "She don't know where to go"
- "If I was you, I would study harder"
- "The team are playing very good"

---

## 🔧 Available Scripts

### Development
```bash
npm run dev              # Start both backend and frontend
npm run dev:server       # Start only backend
npm run dev:client       # Start only frontend
```

### Production
```bash
npm run build:all        # Build everything for production
npm start                # Run production server
npm run preview          # Preview production build locally
```

---

## 🐛 Troubleshooting

### "Module not found" error
```bash
# Clear everything and reinstall
rm -rf node_modules client/node_modules
npm install
cd client && npm install && cd ..
```

### Microphone not working
- Check browser permissions (usually in address bar)
- Try in HTTPS (required for microphone access in production)
- Ensure your microphone is not muted

### Backend not starting
```bash
# Check if port 5000 is in use
# Replace 5000 with a different port in .env if needed
PORT=3000 npm start
```

### API errors
- Verify all API keys are correct in `.env`
- Check internet connection
- Try speaking clearly with proper English
- Check browser console for detailed error messages

---

## 🌐 Accessing from Other Devices

### Internal Network (same WiFi)

1. Find your computer's IP:
   ```bash
   ipconfig  # On Windows
   ```

2. On another device, open:
   ```
   http://<your-ip>:5000
   ```

### Cloud Deployment

To deploy to production:
1. Build: `npm run build:all`
2. Upload to hosting (Heroku, Vercel, AWS, etc.)
3. Set environment variables on hosting platform
4. Start the server

---

## 📚 Key Features Explained

- **Real-Time Listening**: Powered by Speechmatics API
- **AI Coaching**: Uses Google Gemini for intelligent feedback
- **Spoken Feedback**: Vogent API converts response to speech
- **Premium UI**: Dark theme with gold accents and glass effects
- **Responsive**: Works on desktop, tablet, and mobile
- **No Database Needed**: Fully functional without persistence

---

## 💡 Tips for Best Results

1. **Speak Clearly**: Use a good microphone in a quiet environment
2. **Use Natural English**: Speak as you would in real conversation
3. **Practice Regularly**: The more you practice, the better you get
4. **Review Feedback**: Pay attention to the coach's suggestions
5. **Try Different Prompts**: Practice with various topics and difficulties

---

## 🎨 Customization

To change colors, edit `client/src/styles/global.css`:

```css
:root {
  --color-gold: #d4af37;           /* Primary accent */
  --color-navy: #0f1419;            /* Background */
  --color-white: #ffffff;           /* Text */
  /* ... and more */
}
```

To adjust API providers:
- Edit `server/index.js` to use different services
- Update API endpoints and keys as needed

---

## 🔐 Security Notes

- **Never commit `.env`** - Keep API keys secret
- Use environment variables in production
- Implement rate limiting on public deployments
- Use HTTPS for production
- Validate all user inputs

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Read the detailed README.md
3. Check browser console for error messages
4. Verify all API keys and configuration
5. Ensure Node.js 16+ is installed

---

## 🎉 You're All Set!

Your premium AI Grammar Coach is ready to go. Start practicing English today!

**Questions?** Review the README.md for comprehensive documentation.
