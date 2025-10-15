import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import SentimentDisplay from './components/SentimentDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import AdvancedStockData from './components/AdvancedStockData';
import AdvancedSentimentAnalysis from './components/AdvancedSentimentAnalysis';
import PortfolioManager from './components/PortfolioManager';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import authService from './services/authService';
import StockApiService from './services/stockApi';
import './styles/App.css';

interface Article {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  sentiment: number;
  source: string;
  image?: string;
  category?: string;
}

interface StockData {
  stockSymbol: string;
  companyName: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  articles: Article[];
  averageSentiment: number;
  totalArticles: number;
}

function App() {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sentiment' | 'advanced' | 'advanced-sentiment' | 'portfolio'>('sentiment');
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState(null);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        setIsAuthenticated(true);
        setUser(authService.getCurrentUser());
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setUser(authService.getCurrentUser());
    setShowAuth(false);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleSwitchToRegister = () => {
    setAuthMode('register');
  };

  const handleSwitchToLogin = () => {
    setAuthMode('login');
  };

  const handleSearch = async (symbol: string) => {
    setIsLoading(true);
    setError(null);
    setStockData(null);

    try {
      const data = await StockApiService.getStockNews(symbol);
      setStockData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (stockData?.stockSymbol) {
      handleSearch(stockData.stockSymbol);
    }
  };

  // Show authentication if user is not authenticated
  if (showAuth) {
    return (
      <ThemeProvider>
        <div className="app">
          {authMode === 'login' ? (
            <Login 
              onSwitchToRegister={handleSwitchToRegister}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            <Register 
              onSwitchToLogin={handleSwitchToLogin}
              onRegisterSuccess={handleLoginSuccess}
            />
          )}
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="app">
        {/* Header with authentication and theme toggle */}
        <div className="app-header">
          <div className="header-content">
            <h1 className="app-title">📊 Stock Sentiment Analyzer</h1>
            <div className="auth-controls">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="user-info">
                  <span className="user-name">Welcome, {user?.name}</span>
                  <button className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <button className="login-button" onClick={() => setShowAuth(true)}>
                  Login / Register
                </button>
              )}
            </div>
          </div>
        </div>

        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        <div className="main-content">
          {isLoading && <LoadingSpinner />}
          
          {error && (
            <ErrorMessage 
              message={error} 
              onRetry={handleRetry}
            />
          )}

          {stockData && !isLoading && !error && (
            <>
              <div className="results-header">
                <h2 className="results-title">
                  {stockData.companyName} ({stockData.stockSymbol})
                </h2>
                <p className="results-subtitle">
                  Current Price: ${stockData.currentPrice?.toFixed(2) || 'N/A'} 
                  {stockData.priceChangePercent && (
                    <span style={{ 
                      color: stockData.priceChangePercent >= 0 ? '#10b981' : '#ef4444',
                      marginLeft: '8px'
                    }}>
                      {stockData.priceChangePercent >= 0 ? '+' : ''}{stockData.priceChangePercent.toFixed(2)}%
                    </span>
                  )}
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="tab-navigation">
                <button
                  className={`tab-button ${activeTab === 'sentiment' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sentiment')}
                >
                  📰 News Sentiment
                </button>
                <button
                  className={`tab-button ${activeTab === 'advanced' ? 'active' : ''}`}
                  onClick={() => setActiveTab('advanced')}
                >
                  📊 Advanced Data
                </button>
                <button
                  className={`tab-button ${activeTab === 'advanced-sentiment' ? 'active' : ''}`}
                  onClick={() => setActiveTab('advanced-sentiment')}
                >
                  🧠 Advanced Sentiment
                </button>
                <button
                  className={`tab-button ${activeTab === 'portfolio' ? 'active' : ''}`}
                  onClick={() => setActiveTab('portfolio')}
                  disabled={!isAuthenticated}
                >
                  💼 Portfolio
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'sentiment' && (
                <SentimentDisplay 
                  stockData={stockData}
                  articles={stockData.articles}
                />
              )}

              {activeTab === 'advanced' && (
                <AdvancedStockData symbol={stockData.stockSymbol} />
              )}

              {activeTab === 'advanced-sentiment' && (
                <AdvancedSentimentAnalysis symbol={stockData.stockSymbol} />
              )}

              {activeTab === 'portfolio' && !isAuthenticated && (
                <div className="auth-required">
                  <h3>Authentication Required</h3>
                  <p>Please log in to access your portfolio and watchlist features.</p>
                  <div className="auth-prompt">
                    <p>Create an account or sign in to:</p>
                    <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
                      <li>• Track your stock portfolio</li>
                      <li>• Manage your watchlist</li>
                      <li>• View performance analytics</li>
                      <li>• Save your preferences</li>
                    </ul>
                    <button 
                      className="auth-button" 
                      onClick={() => setShowAuth(true)}
                      style={{ marginTop: '1rem' }}
                    >
                      Login / Register
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'portfolio' && isAuthenticated && (
                <PortfolioManager 
                  symbol={stockData.stockSymbol}
                  currentPrice={stockData.currentPrice}
                />
              )}
            </>
          )}

          {!stockData && !isLoading && !error && (
            <div className="no-results">
              <h3>Welcome to Stock Sentiment Analyzer</h3>
              <p>Search for a stock symbol above to get started with sentiment analysis.</p>
              <p>Try searching for popular stocks like: AAPL, MSFT, GOOGL, TSLA, AMZN</p>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;