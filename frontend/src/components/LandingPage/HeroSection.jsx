import React from 'react';
import './HeroSection.css';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="hero-section">
      <div className="hero-content">
        <img src={logo} alt="Stoxie Logo" className="hero-logo" />
        {/* <h1 className="hero-title">STOXIE</h1> */}
        <p className="hero-tagline">Empowering Beginners to Trade with Confidence</p>
        <button className="cta-button" onClick={() => navigate('/signup')}>
          Create Your Free Account Today
        </button>
      </div> 
    </section>
  );
};

export default HeroSection;
