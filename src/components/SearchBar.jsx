import React, { useState } from 'react';
import { Search, TrendingUp, ChevronDown } from 'lucide-react';
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

  return (
    <div className="search-container">
      <div className="search-header">
        <div className="search-icon-wrapper">
          <TrendingUp className="search-main-icon" />
        </div>
        <h1 className="search-title">Stock Sentiment Analyzer</h1>
        <p className="search-subtitle">
          Discover market sentiment through AI-powered news analysis
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

      <div className="popular-stocks">
        <span className="popular-label">Popular stocks:</span>
        <div className="stock-tags">
          {popularStocks.map(stock => (
            <button
              key={stock}
              onClick={() => setSymbol(stock)}
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