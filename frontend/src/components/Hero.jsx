import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-text-wrapper">
          <h1 className="hero-title">Welcome to CylixLab</h1>
          <p className="hero-subtitle">Learn Smarter. Achieve More</p>
          <div className="hero-button-group">
            <button type="button" className="btn-hero btn-login">
              Login
            </button>
            <button type="button" className="btn-hero btn-get-started">
              Get Start
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
