import React from 'react';
import { BarChart3 } from 'lucide-react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <BarChart3 className="loading-icon" />
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
      <div className="loading-text">
        <h3>Analyzing Market Sentiment</h3>
        <p>Fetching latest news and processing AI sentiment analysis...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;