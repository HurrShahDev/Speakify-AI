import React from "react";
import "../styles/prompts.css";

export function PromptCard({ prompt, difficulty }) {
  return (
    <div className="prompt-card">
      <div className="prompt-card__header">
        <span className={`prompt-card__difficulty prompt-card__difficulty--${difficulty}`}>
          {difficulty}
        </span>
      </div>
      <p className="prompt-card__text">"{prompt}"</p>
      <button className="btn btn--secondary btn--small">Try Speaking</button>
    </div>
  );
}

export function Prompts() {
  const prompts = [
    {
      prompt: "Tell me about your favorite hobby and why you enjoy it.",
      difficulty: "beginner"
    },
    {
      prompt: "Describe your daily morning routine in detail.",
      difficulty: "beginner"
    },
    {
      prompt: "If you could travel anywhere in the world, where would you go and why?",
      difficulty: "intermediate"
    },
    {
      prompt: "Explain a challenging situation you faced and how you overcame it.",
      difficulty: "intermediate"
    },
    {
      prompt: "Discuss the impact of technology on modern society and its implications.",
      difficulty: "advanced"
    },
    {
      prompt: "Analyze the correlation between education and economic development.",
      difficulty: "advanced"
    }
  ];

  return (
    <section className="prompts">
      <div className="prompts__container">
        <div className="prompts__header">
          <h2 className="prompts__title">Speaking Prompts</h2>
          <p className="prompts__subtitle">Practice with carefully curated prompts designed to build your confidence</p>
        </div>

        <div className="prompts__grid">
          {prompts.map((item, idx) => (
            <PromptCard
              key={idx}
              prompt={item.prompt}
              difficulty={item.difficulty}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
