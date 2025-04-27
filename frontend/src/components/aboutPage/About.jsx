import React from 'react';
import HeroSection from './HeroSection';
import TeamSection from './TeamSection';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <HeroSection />
      <TeamSection />
    </div>
  );
};

export default About;
