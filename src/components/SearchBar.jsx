import React, { useState } from 'react';
import { Search, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import StockApiService from '../services/stockApi';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch, isLoading }) => {
  const [symbol, setSymbol] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSearch(symbol.trim().toUpperCase());
      setShowDropdown(false);
      setSearchResults([]);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSymbol(value);
    
    if (value.length >= 1) {
      setIsSearching(true);
      try {
        const results = await StockApiService.searchStocks(value);
        setSearchResults(results.results || []);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectStock = (selectedStock) => {
    setSymbol(selectedStock.symbol);
    setShowDropdown(false);
    setSearchResults([]);
    onSearch(selectedStock.symbol);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSelectStock(searchResults[0]);
    }
  };

  const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META'];

  const featuredStocks = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: '$182.01',
      change: '+15.67',
      changePercent: '+3.12%',
      trend: 'up',
      gradient: 'aapl',
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: '$443.01',
      change: '+9.45',
      changePercent: '+1.89%',
      trend: 'up',
      gradient: 'tsla',
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: '$1,082.01',
      change: '+20.50',
      changePercent: '+4.25%',
      trend: 'up',
      gradient: 'googl',
    },
    {
      symbol: 'NKE',
      name: 'Nike Inc.',
      price: '$122.34',
      change: '-8.99',
      changePercent: '-2.50%',
      trend: 'down',
      gradient: 'nke',
    },
    {
      symbol: 'FDX',
      name: 'FedEx Corp.',
      price: '$192.91',
      change: '-12.33',
      changePercent: '-2.74%',
      trend: 'down',
      gradient: 'fdx',
    }
  ];

  return (
    <div className="search-container">
      <div className="search-grid-overlay" />
      <div className="search-glow" />
      
      <div className="search-header">
        <div className="hero-pill">AI SENTIMENT SUITE</div>
        <h1 className="search-title">
          Get the edge on the market with <span>Stock Sentiment Analyzer</span>
        </h1>
        <p className="search-subtitle">
          Built for research teams to uncover institutional-grade signals from news,
          social media, and analyst commentary in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <Search className="search-input-icon" />
          <input
            type="text"
            value={symbol}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search any stock symbol or company name..."
            className="search-input"
            disabled={isLoading}
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowDropdown(true);
              }
            }}
            onBlur={() => {
              // Delay hiding dropdown to allow clicking on results
              setTimeout(() => setShowDropdown(false), 200);
            }}
          />
          <div className="command-hint">
            <span>⌘</span>K
          </div>
          {isSearching && <div className="search-loading">Searching...</div>}
          {showDropdown && searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map((stock, index) => (
                <div
                  key={index}
                  className="search-result-item"
                  onClick={() => handleSelectStock(stock)}
                  title={`Click to select ${stock.symbol}`}
                >
                  <div className="stock-info">
                    <div className="stock-symbol">{stock.symbol}</div>
                    <div className="stock-name">{stock.description}</div>
                  </div>
                  <div className="stock-select-indicator">→</div>
                </div>
              ))}
            </div>
          )}
          <button 
            type="submit" 
            className="search-button"
            disabled={isLoading || !symbol.trim()}
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </form>

      <div className="hero-metrics">
        <div className="metric-card">
          <span className="metric-label">Real-time sources</span>
          <p className="metric-value">40+</p>
          <span className="metric-detail">News, social & analyst feeds</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Signals delivered</span>
          <p className="metric-value">1.5M+</p>
          <span className="metric-detail">Across 8,000 global equities</span>
        </div>
      </div>

      <div className="featured-stocks-row">
        {featuredStocks.map((stock, index) => {
          const TrendIcon = stock.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <div 
              key={stock.symbol + index} 
              className={`featured-stock-card ${stock.gradient}`}
            >
              <div className="featured-card-header">
                <div className="logo-chip">{stock.symbol.slice(0, 2)}</div>
                <div className={`trend-indicator ${stock.trend}`}>
                  <TrendIcon size={16} />
                </div>
              </div>
              <div className="featured-card-body">
                <div>
                  <p className="featured-symbol">{stock.symbol}</p>
                  <p className="featured-name">{stock.name}</p>
                </div>
                <div className="featured-price">{stock.price}</div>
                <div className={`featured-change ${stock.trend}`}>
                  {stock.change} ({stock.changePercent})
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="popular-stocks">
        <span className="popular-label">Quick access:</span>
        <div className="stock-tags">
          {popularStocks.map(stock => (
            <button
              key={stock}
              onClick={() => {
                setSymbol(stock);
                onSearch(stock);
              }}
              className="stock-tag"
              disabled={isLoading}
            >
              {stock}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;