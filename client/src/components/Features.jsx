import React from "react";
import "../styles/features.css";

export function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-card__icon">{icon}</div>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__description">{description}</p>
    </div>
  );
}

export function Features() {
  const features = [
    {
      icon: "🎤",
      title: "Real-Time Listening",
      description: "Speak naturally and your AI coach instantly hears every word with precision."
    },
    {
      icon: "✨",
      title: "Smart Grammar Analysis",
      description: "Advanced AI identifies grammar mistakes, tense issues, and vocabulary gaps."
    },
    {
      icon: "🎯",
      title: "Personalized Feedback",
      description: "Get tailored corrections and suggestions to improve your English speaking."
    },
    {
      icon: "🎧",
      title: "Spoken Feedback",
      description: "Hear the coach's response spoken aloud with natural pronunciation."
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed analytics and reports."
    },
    {
      icon: "🌍",
      title: "Learn Anytime",
      description: "Practice English speaking anywhere, anytime with our mobile-first platform."
    }
  ];

  return (
    <section id="features" className="features">
      <div className="features__container">
        <div className="features__header">
          <h2 className="features__title">Why Choose GrammarCoach?</h2>
          <p className="features__subtitle">Everything you need to master English speaking with confidence</p>
        </div>

        <div className="features__grid">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
