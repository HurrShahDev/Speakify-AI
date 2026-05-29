import React from "react";
import "../styles/howitworks.css";

export function HowItWorksStep({ number, title, description, isOdd }) {
  return (
    <div className={`how-it-works-step ${isOdd ? 'how-it-works-step--odd' : ''}`}>
      <div className="how-it-works-step__number">{number}</div>
      <div className="how-it-works-step__content">
        <h3 className="how-it-works-step__title">{title}</h3>
        <p className="how-it-works-step__description">{description}</p>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Speak Naturally",
      description: "Press the microphone button and speak any sentence in English. Our AI listens to every word with perfect precision."
    },
    {
      number: "02",
      title: "Real-Time Analysis",
      description: "Your speech is instantly transcribed and analyzed for grammar mistakes, tense issues, and vocabulary improvements."
    },
    {
      number: "03",
      title: "Get Coaching",
      description: "Your personal AI coach provides personalized feedback, corrections, and suggestions to improve your English."
    },
    {
      number: "04",
      title: "Hear the Feedback",
      description: "Listen to your coach's response spoken aloud, so you learn proper pronunciation and natural English flow."
    }
  ];

  return (
    <section id="howitworks" className="how-it-works">
      <div className="how-it-works__container">
        <div className="how-it-works__header">
          <h2 className="how-it-works__title">How It Works</h2>
          <p className="how-it-works__subtitle">Your journey to fluent English in just 4 simple steps</p>
        </div>

        <div className="how-it-works__timeline">
          {steps.map((step, idx) => (
            <HowItWorksStep
              key={idx}
              number={step.number}
              title={step.title}
              description={step.description}
              isOdd={idx % 2 !== 0}
            />
          ))}
        </div>

        <div className="how-it-works__cta">
          <button className="btn btn--primary btn--large">Start Your Journey</button>
        </div>
      </div>
    </section>
  );
}
