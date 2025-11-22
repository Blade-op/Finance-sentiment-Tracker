// Centralized API configuration
// In production, set VITE_API_URL environment variable in Vercel
// Example: VITE_API_URL=https://stock-sentiment-backend-yr1v.onrender.com

const getApiBaseUrl = () => {
  // Check for environment variable first (for Vercel production)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Development mode - use localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  
  // Production fallback (should be set via env var)
  return 'https://stock-sentiment-backend-yr1v.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();
export const API_BASE_URL_WITH_API = `${API_BASE_URL}/api`;

