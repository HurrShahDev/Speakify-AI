import React, { useState } from "react";
import "../styles/faq.css";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I get started with the AI Grammar Coach?",
      answer: "Simply click the 'Start Speaking' button in the hero section and allow microphone access. Speak any sentence, and our AI coach will analyze your grammar and provide instant feedback."
    },
    {
      question: "What languages does the coach support?",
      answer: "Currently, the AI Grammar Coach specializes in English grammar correction. It focuses specifically on helping non-native English speakers improve their spoken English fluency."
    },
    {
      question: "Is my audio data stored or shared?",
      answer: "Your privacy is our priority. Audio is processed in real-time for analysis and is not stored on our servers after the session ends. We use industry-standard encryption for all data transmission."
    },
    {
      question: "How accurate is the grammar feedback?",
      answer: "Our AI model focuses on common grammar mistakes in spoken English. While it catches most issues, it's designed as a learning tool to help you improve, not as a substitute for formal instruction."
    },
    {
      question: "Can I practice offline?",
      answer: "The AI Grammar Coach requires an internet connection to process audio and generate feedback. This ensures you always get the latest AI model and most accurate corrections."
    },
    {
      question: "How long does feedback take?",
      answer: "Most feedback is generated within 2-5 seconds after you stop speaking. The first time you use the feature, it may take a bit longer as the AI model loads."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq">
      <div className="faq__container">
        <div className="faq__header">
          <h2 className="faq__title">Frequently Asked Questions</h2>
          <p className="faq__subtitle">Find answers to common questions about the AI Grammar Coach</p>
        </div>

        <div className="faq__accordion">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq__item ${openIndex === index ? "faq__item--open" : ""}`}
            >
              <button
                className="faq__question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className="faq__question-text">{faq.question}</span>
                <span className="faq__icon"></span>
              </button>
              <div className="faq__answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq__cta">
          <h3 className="faq__cta-title">Still have questions?</h3>
          <p className="faq__cta-text">Reach out to our support team at support@grammarcoach.com</p>
          <button className="btn btn--primary">Contact Support</button>
        </div>
      </div>
    </section>
  );
}
