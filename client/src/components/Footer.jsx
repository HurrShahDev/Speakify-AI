import React from "react";
import "../styles/footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__main">
          <div className="footer__about">
            <h4 className="footer__logo">GrammarCoach</h4>
            <p className="footer__tagline">AI Speaking Coach</p>
            <p className="footer__description">
              Master English speaking with your personal AI grammar coach. Practice anytime, anywhere, and get real-time feedback to improve your fluency.
            </p>
          </div>

          <div className="footer__links">
            <div className="footer__column">
              <h5 className="footer__heading">Product</h5>
              <ul className="footer__list">
                <li><a href="#features" className="footer__link">Features</a></li>
                <li><a href="#howitworks" className="footer__link">How It Works</a></li>
                <li><a href="#faq" className="footer__link">FAQ</a></li>
              </ul>
            </div>

            <div className="footer__column">
              <h5 className="footer__heading">Company</h5>
              <ul className="footer__list">
                <li><a href="#about" className="footer__link">About Us</a></li>
                <li><a href="#contact" className="footer__link">Contact</a></li>
                <li><a href="#blog" className="footer__link">Blog</a></li>
              </ul>
            </div>

            <div className="footer__column">
              <h5 className="footer__heading">Legal</h5>
              <ul className="footer__list">
                <li><a href="#privacy" className="footer__link">Privacy Policy</a></li>
                <li><a href="#terms" className="footer__link">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">&copy; 2024 GrammarCoach. All rights reserved.</p>
          <div className="footer__socials">
            <a href="#twitter" className="footer__social-link" title="Follow us on Twitter">Twitter</a>
            <a href="#linkedin" className="footer__social-link" title="Connect on LinkedIn">LinkedIn</a>
            <a href="#github" className="footer__social-link" title="View our GitHub">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
