import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import '../styles/ErrorMessage.css';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-content">
        <AlertCircle className="error-icon" />
        <h3 className="error-title">Something went wrong</h3>
        <p className="error-message">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="error-retry-button">
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;