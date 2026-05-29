import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/hero.css";

// Inline Voice Status Component
function VoiceStatus({ status }) {
  return (
    <div className={`voice-status voice-status--${status}`}>
      {status === "idle" && (
        <>
          <span className="voice-status__title">Ready to listen</span>
          <p className="voice-status__subtitle">Click the microphone to start speaking</p>
        </>
      )}
      {status === "listening" && (
        <>
          <span className="voice-status__title">🎤 Listening...</span>
          <div className="voice-status__waveform">
            <div className="voice-status__waveform-bar"></div>
            <div className="voice-status__waveform-bar"></div>
            <div className="voice-status__waveform-bar"></div>
            <div className="voice-status__waveform-bar"></div>
            <div className="voice-status__waveform-bar"></div>
          </div>
        </>
      )}
      {status === "processing" && (
        <>
          <span className="voice-status__title">⏳ Analyzing...</span>
          <div className="voice-status__spinner"></div>
        </>
      )}
      {status === "complete" && (
        <>
          <span className="voice-status__title">✅ Complete</span>
          <p className="voice-status__subtitle">Analysis finished</p>
        </>
      )}
      {status === "error" && (
        <>
          <span className="voice-status__title">❌ Error</span>
          <p className="voice-status__subtitle">Something went wrong</p>
        </>
      )}
    </div>
  );
}

// Inline Transcript Component
function HeroTranscript({ transcript }) {
  if (!transcript) return null;
  return (
    <div className="hero-transcript">
      <h4 className="hero-transcript__title">📝 You Said:</h4>
      <p className="hero-transcript__text">{transcript}</p>
    </div>
  );
}

// Inline Feedback Component
function HeroFeedback({ feedback, isPlaying }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!isPlaying || !feedback) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < feedback.length) {
        setDisplayedText(feedback.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isPlaying, feedback]);

  useEffect(() => {
    if (!isPlaying) {
      setDisplayedText("");
    }
  }, [isPlaying]);

  if (!feedback) return null;

  return (
    <div className="hero-feedback">
      <h4 className="hero-feedback__title">👨‍🏫 Your Coach Says:</h4>
      <p className="hero-feedback__text">
        {isPlaying ? displayedText : feedback}
        {isPlaying && <span className="hero-feedback__cursor">|</span>}
      </p>
    </div>
  );
}

export function Hero() {
  const [isAnimated, setIsAnimated] = useState(false);
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioRef = useRef(new Audio());
  const chunksRef = useRef([]);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  // Initialize audio context and get microphone
  const startRecording = async () => {
    try {
      setError("");
      setStatus("listening");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await sendAudioToServer(audioBlob);
      };

      mediaRecorder.start();
    } catch (err) {
      setError("Microphone access denied. Please enable microphone permissions.");
      setStatus("error");
      console.error("Recording error:", err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && status === "listening") {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      setStatus("processing");
    }
  };

  // Send audio to server
  const sendAudioToServer = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await axios.post("/api/analyze", formData);

      const { transcript: trans, coachResponse, audioBase64 } = response.data;

      // Ensure we're setting fresh state
      setTranscript(trans);
      setFeedback(coachResponse);

      // Convert base64 audio to URL and auto-play
      if (audioBase64) {
        const binaryString = atob(audioBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const audioBlob = new Blob([bytes], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);

        // Auto-play the feedback audio
        setTimeout(() => {
          autoPlayFeedback(audioUrl);
        }, 500);
      }

      setStatus("complete");
    } catch (err) {
      setError("Failed to analyze audio. Please try again.");
      setStatus("error");
      console.error("API error:", err);
    }
  };

  // Auto-play feedback with live text display
  const autoPlayFeedback = (audioUrl) => {
    if (!audioRef.current) return;

    audioRef.current.src = audioUrl;
    audioRef.current.onplay = () => setIsAudioPlaying(true);
    audioRef.current.onended = () => setIsAudioPlaying(false);
    audioRef.current.play().catch(err => {
      console.error("Auto-play failed:", err);
    });
  };

  // Manual play control
  const playFeedbackAudio = () => {
    if (audioUrl) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        autoPlayFeedback(audioUrl);
      }
    }
  };

  // Reset demo completely
  const reset = () => {
    // Reset all state cleanly
    setStatus("idle");
    setTranscript("");
    setFeedback("");
    setAudioUrl("");
    setIsAudioPlaying(false);
    setError("");
    
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <section className={`hero ${isAnimated ? "hero--animated" : ""}`}>
      <div className="hero__container">
        <div className="hero__left">
          <div className="hero__text">
            <p className="hero__brand">Speakify AI</p>
            <h1 className="hero__heading">
              Speak Boldly,<br />
              <span className="hero__heading--gradient">Speak Fluently</span>
            </h1>
            <p className="hero__subheading">
              Practice English with your personal AI Grammar Coach. Speak naturally, get instant feedback on grammar, and improve your fluency in real-time.
            </p>
          </div>
          <div className="hero__features">
            <div className="hero__feature-item">
              <span className="hero__feature-icon">⚡</span>
              <div>
                <h4 className="hero__feature-title">Instant Feedback</h4>
                <p className="hero__feature-text">Get real-time corrections on grammar, pronunciation, and vocabulary</p>
              </div>
            </div>
            <div className="hero__feature-item">
              <span className="hero__feature-icon">🎯</span>
              <div>
                <h4 className="hero__feature-title">Smart Coaching</h4>
                <p className="hero__feature-text">AI-powered coach provides personalized suggestions to improve your English</p>
              </div>
            </div>
            <div className="hero__feature-item">
              <span className="hero__feature-icon">💬</span>
              <div>
                <h4 className="hero__feature-title">Natural Conversation</h4>
                <p className="hero__feature-text">Practice real conversations with context-aware responses</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hero__right">
          <div className="hero__mic-section">
            <div className="hero__mic-container">
              {status === "idle" || status === "complete" || status === "error" ? (
                <button
                  className="hero__mic-button hero__mic-button--round"
                  onClick={startRecording}
                >
                  <span className="hero__mic-icon">🎤</span>
                </button>
              ) : status === "listening" ? (
                <button
                  className="hero__mic-button hero__mic-button--round hero__mic-button--recording"
                  onClick={stopRecording}
                >
                  <span className="hero__mic-icon">⏹</span>
                </button>
              ) : (
                <div className="hero__mic-spinner"></div>
              )}
              <p className="hero__mic-label">{status === "listening" ? "Stop" : "Start"}</p>
            </div>
            <VoiceStatus status={status} />
          </div>
          <div className="hero__results">
            <HeroTranscript transcript={transcript} />
            <HeroFeedback feedback={feedback} isPlaying={isAudioPlaying} />
          </div>
          {error && <p className="hero__error">{error}</p>}
          {(transcript || feedback) && (
            <button className="btn btn--tertiary" onClick={reset}>
              Reset
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
