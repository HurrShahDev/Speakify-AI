import React from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { Prompts } from "./components/Prompts";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import "./styles/global.css";

function App() {
  return (
    <div className="app">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Prompts />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
