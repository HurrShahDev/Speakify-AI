import React, { useState } from "react";
import "../styles/header.css";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header glass">
      <div className="header__content">
        <div className="header__logo">
          <div className="header__logo-icon">🎤</div>
          <div>
            <h4 className="header__logo-text">Speakify AI</h4>
            <p className="header__logo-sub">English Speaking Coach</p>
          </div>
        </div>

        <nav className={`header__nav ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <a href="#features">Features</a>
          <a href="#howitworks">How It Works</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="header__actions">
          <button className="btn btn--secondary">Sign In</button>
          <button className="btn btn--primary">Get Started</button>
          <button
            className="header__menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
