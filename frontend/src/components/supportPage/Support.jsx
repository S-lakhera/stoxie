import React from 'react';
import './Support.css';
import supportImage from '../../assets/supportImage.jpg'; // Replace with your own image

const Support = () => {
  return (
    <div className="support-page">
      <section className="support-image-section">
        <img src={supportImage} alt="Customer support illustration" />
      </section>
      <section className="support-hero">
        <h2>Welcome to Stoxie Support</h2>
        <p>Get answers to your queries and explore helpful resources to get the most out of your trading journey with Stoxie.</p>
      </section>


      <section className="support-links">
        <div className="support-category">
          <h3>Getting Started</h3>
          <ul>
            <li><a href="#">How to Create an Account</a></li>
            <li><a href="#">Using the Demo Trading Feature</a></li>
            <li><a href="#">Creating Your First Watchlist</a></li>
          </ul>
        </div>

        <div className="support-category">
          <h3>Account & Security</h3>
          <ul>
            <li><a href="#">Resetting Your Password</a></li>
            <li><a href="#">Two-Factor Authentication (2FA)</a></li>
            <li><a href="#">Data Privacy & Safety</a></li>
          </ul>
        </div>

        <div className="support-category">
          <h3>Trading Help</h3>
          <ul>
            <li><a href="#">How to Place Simulated Orders</a></li>
            <li><a href="#">Understanding Market Charts</a></li>
            <li><a href="#">Portfolio Tracking</a></li>
          </ul>
        </div>

        <div className="support-category">
          <h3>FAQs</h3>
          <ul>
            <li><a href="#">Why is this only a demo platform?</a></li>
            <li><a href="#">Will I earn real money?</a></li>
            <li><a href="#">Can I switch to real trading?</a></li>
          </ul>
        </div>
      </section>

      
    </div>
  );
};

export default Support;
