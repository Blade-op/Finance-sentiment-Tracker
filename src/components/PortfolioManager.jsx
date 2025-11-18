import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import AdvancedStockApiService from '../services/advancedStockApi';
import PerformanceAnalytics from './PerformanceAnalytics';
import '../styles/PortfolioManager.css';
import axios from 'axios';
import jsPDF from 'jspdf';

const PortfolioManager = ({ symbol }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addStockForm, setAddStockForm] = useState({
    symbol: '',
    shares: '',
    buyPrice: '',
    buyDate: ''
  });
  const [showApiInfo, setShowApiInfo] = useState(false);


  // Load portfolio and watchlist from localStorage on component mount
  useEffect(() => {
    loadPortfolioData();
  }, []);

  // Update portfolio data when symbol changes
  useEffect(() => {
    if (symbol && !portfolio.find(item => item.symbol === symbol)) {
      setAddStockForm(prev => ({ ...prev, symbol: symbol.toUpperCase() }));
    }
  }, [symbol]);



  const loadPortfolioData = () => {
    try {
      const savedPortfolio = JSON.parse(localStorage.getItem('stockPortfolio') || '[]');
      const savedWatchlist = JSON.parse(localStorage.getItem('stockWatchlist') || '[]');
      setPortfolio(savedPortfolio);
      setWatchlist(savedWatchlist);
    } catch (err) {
      console.error('Error loading portfolio data:', err);
    }
  };

  const savePortfolioData = (newPortfolio, newWatchlist) => {
    try {
      localStorage.setItem('stockPortfolio', JSON.stringify(newPortfolio));
      localStorage.setItem('stockWatchlist', JSON.stringify(newWatchlist));
    } catch (err) {
      console.error('Error saving portfolio data:', err);
    }
  };

  const addToPortfolio = async () => {
    if (!addStockForm.symbol || !addStockForm.shares || !addStockForm.buyPrice) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get current stock data
      const stockData = await AdvancedStockApiService.getEnhancedStockData(addStockForm.symbol);
      
      const newPosition = {
        id: Date.now(),
        symbol: addStockForm.symbol.toUpperCase(),
        companyName: stockData.companyName,
        shares: parseFloat(addStockForm.shares),
        buyPrice: parseFloat(addStockForm.buyPrice),
        buyDate: addStockForm.buyDate || new Date().toISOString().split('T')[0],
        currentPrice: stockData.currentPrice,
        priceChange: stockData.priceChange,
        priceChangePercent: stockData.priceChangePercent,
        lastUpdated: new Date().toISOString()
      };

      const newPortfolio = [...portfolio, newPosition];
      setPortfolio(newPortfolio);
      savePortfolioData(newPortfolio, watchlist);
      
      // Reset form
      setAddStockForm({
        symbol: '',
        shares: '',
        buyPrice: '',
        buyDate: ''
      });
    } catch (err) {
      setError('Failed to add stock to portfolio. Please check the symbol.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromPortfolio = (id) => {
    const newPortfolio = portfolio.filter(item => item.id !== id);
    setPortfolio(newPortfolio);
    savePortfolioData(newPortfolio, watchlist);
  };

  const addToWatchlist = async (symbol) => {
    if (watchlist.find(item => item.symbol === symbol)) {
      setError('Stock already in watchlist');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stockData = await AdvancedStockApiService.getEnhancedStockData(symbol);
      
      const newWatchlistItem = {
        id: Date.now(),
        symbol: symbol.toUpperCase(),
        companyName: stockData.companyName,
        currentPrice: stockData.currentPrice,
        priceChange: stockData.priceChange,
        priceChangePercent: stockData.priceChangePercent,
        addedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      const newWatchlist = [...watchlist, newWatchlistItem];
      setWatchlist(newWatchlist);
      savePortfolioData(portfolio, newWatchlist);
    } catch (err) {
      setError('Failed to add stock to watchlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = (id) => {
    const newWatchlist = watchlist.filter(item => item.id !== id);
    setWatchlist(newWatchlist);
    savePortfolioData(portfolio, newWatchlist);
  };

  const refreshPortfolioData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Update portfolio data
      const updatedPortfolio = await Promise.all(
        portfolio.map(async (position) => {
          try {
            const stockData = await AdvancedStockApiService.getEnhancedStockData(position.symbol);
            return {
              ...position,
              currentPrice: stockData.currentPrice,
              priceChange: stockData.priceChange,
              priceChangePercent: stockData.priceChangePercent,
              lastUpdated: new Date().toISOString()
            };
          } catch (err) {
            console.error(`Error updating ${position.symbol}:`, err);
            return position;
          }
        })
      );

      // Update watchlist data
      const updatedWatchlist = await Promise.all(
        watchlist.map(async (item) => {
          try {
            const stockData = await AdvancedStockApiService.getEnhancedStockData(item.symbol);
            return {
              ...item,
              currentPrice: stockData.currentPrice,
              priceChange: stockData.priceChange,
              priceChangePercent: stockData.priceChangePercent,
              lastUpdated: new Date().toISOString()
            };
          } catch (err) {
            console.error(`Error updating ${item.symbol}:`, err);
            return item;
          }
        })
      );

      setPortfolio(updatedPortfolio);
      setWatchlist(updatedWatchlist);
      savePortfolioData(updatedPortfolio, updatedWatchlist);
    } catch (err) {
      setError('Failed to refresh portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const calculatePositionStats = (position) => {
    const totalCost = position.shares * position.buyPrice;
    const currentValue = position.shares * (position.currentPrice || position.buyPrice);
    const pnl = currentValue - totalCost;
    const pnlPercent = (pnl / totalCost) * 100;

    return {
      totalCost,
      currentValue,
      pnl,
      pnlPercent
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculatePortfolioStats = () => {
    if (portfolio.length === 0) return null;

    const totalCost = portfolio.reduce((sum, position) => {
      return sum + (position.shares * position.buyPrice);
    }, 0);

    const totalCurrentValue = portfolio.reduce((sum, position) => {
      return sum + (position.shares * (position.currentPrice || position.buyPrice));
    }, 0);

    const totalPnl = totalCurrentValue - totalCost;
    const totalPnlPercent = (totalPnl / totalCost) * 100;

    return {
      totalCost,
      totalCurrentValue,
      totalPnl,
      totalPnlPercent,
      totalPositions: portfolio.length
    };
  };

  const formatCurrency = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (!portfolio.length) {
      alert('No portfolio positions to export.');
      return;
    }

    const headers = [
      'Symbol',
      'Company',
      'Shares',
      'Buy Price',
      'Current Price',
      'Total Cost',
      'Current Value',
      'PnL',
      'PnL %',
      'Buy Date',
      'Last Updated'
    ];

    const rows = portfolio.map((position) => {
      const stats = calculatePositionStats(position);
      return [
        position.symbol,
        position.companyName,
        position.shares,
        position.buyPrice,
        position.currentPrice ?? position.buyPrice,
        stats.totalCost.toFixed(2),
        stats.currentValue.toFixed(2),
        stats.pnl.toFixed(2),
        stats.pnlPercent.toFixed(2),
        formatDate(position.buyDate),
        formatDate(position.lastUpdated)
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row =>
        row
          .map(value => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `portfolio-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportPDF = () => {
    if (!portfolio.length) {
      alert('No portfolio positions to export.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Portfolio Summary', 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    let y = 40;

    portfolio.forEach((position, index) => {
      const stats = calculatePositionStats(position);
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(13);
      doc.text(`${index + 1}. ${position.symbol} — ${position.companyName}`, 14, y);
      y += 6;
      doc.setFontSize(11);
      doc.text(`Shares: ${position.shares}`, 14, y);
      doc.text(`Buy Price: ${formatCurrency(position.buyPrice)}`, 90, y);
      doc.text(`Current Price: ${formatCurrency(position.currentPrice ?? position.buyPrice)}`, 180, y);
      y += 6;
      doc.text(`Total Cost: ${formatCurrency(stats.totalCost)}`, 14, y);
      doc.text(`Current Value: ${formatCurrency(stats.currentValue)}`, 90, y);
      doc.text(`P&L: ${formatCurrency(stats.pnl)} (${stats.pnlPercent.toFixed(2)}%)`, 200, y);
      y += 6;
      doc.text(`Buy Date: ${formatDate(position.buyDate)}`, 14, y);
      doc.text(`Last Updated: ${formatDate(position.lastUpdated)}`, 90, y);
      y += 10;
    });

    doc.save(`portfolio-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const portfolioStats = calculatePortfolioStats();



  return (
    <div className="portfolio-manager">
      {/* Header */}
      <div className="portfolio-header">
        <h2>Portfolio Management</h2>
        <button 
          className="refresh-button"
          onClick={refreshPortfolioData}
          disabled={loading}
        >
          <BarChart3 size={16} />
          Refresh Data
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="portfolio-tabs">
        <button
          className={`portfolio-tab ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          💼 Portfolio ({portfolio.length})
        </button>
        <button
          className={`portfolio-tab ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlist')}
        >
          👀 Watchlist ({watchlist.length})
        </button>
        <button
          className={`portfolio-tab ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          ➕ Add Stock
        </button>
        <button
          className={`portfolio-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>

      </div>

      {/* Portfolio Overview */}
      {activeTab === 'portfolio' && (
        <div className="portfolio-content">
          {/* Export Buttons */}
          <div className="export-actions">
            <button onClick={handleExportCSV} className="export-btn">Export CSV</button>
            <button onClick={handleExportPDF} className="export-btn">Export PDF</button>
          </div>

          {portfolio.length === 0 ? (
            <div className="empty-state">
              <h3>No positions yet</h3>
              <p>Add stocks to your portfolio to see analytics</p>
            </div>
          ) : (
            <>
              {portfolioStats && (
                <div className="portfolio-overview">
                  <h3>Portfolio Overview</h3>
                  <div className="overview-grid">
                    <div className="overview-card">
                      <div className="overview-icon">
                        <DollarSign size={24} />
                      </div>
                      <div className="overview-content">
                        <h4>Total Value</h4>
                        <p className="overview-value">{formatCurrency(portfolioStats.totalCurrentValue)}</p>
                      </div>
                    </div>
                    <div className="overview-card">
                      <div className="overview-icon">
                        <TrendingUp size={24} />
                      </div>
                      <div className="overview-content">
                        <h4>Total P&L</h4>
                        <p className={`overview-value ${portfolioStats.totalPnl >= 0 ? 'positive' : 'negative'}`}>
                          {formatCurrency(portfolioStats.totalPnl)} ({portfolioStats.totalPnlPercent.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                    <div className="overview-card">
                      <div className="overview-icon">
                        <BarChart3 size={24} />
                      </div>
                      <div className="overview-content">
                        <h4>Positions</h4>
                        <p className="overview-value">{portfolioStats.totalPositions}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="portfolio-positions">
                <h3>Your Positions</h3>
                <div className="positions-grid">
                  {portfolio.map((position) => {
                    const stats = calculatePositionStats(position);
                    const isGain = stats.pnl >= 0;
                    return (
                      <div key={position.id} className="position-card">
                        <div className="position-header">
                          <div className="position-info">
                            <h4>{position.symbol}</h4>
                            <p>{position.companyName}</p>
                          </div>
                          <button
                            className="remove-button"
                            onClick={() => removeFromPortfolio(position.id)}
                            title="Remove from portfolio"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="position-details">
                          <div className="detail-row">
                            <span>Shares</span>
                            <span>{Number(position.shares).toLocaleString()}</span>
                          </div>
                          <div className="detail-row">
                            <span>Avg. Buy Price</span>
                            <span>{formatCurrency(position.buyPrice)}</span>
                          </div>
                          <div className="detail-row">
                            <span>Current Price</span>
                            <span>{formatCurrency(position.currentPrice ?? position.buyPrice)}</span>
                          </div>
                          <div className="detail-row">
                            <span>Market Value</span>
                            <span>{formatCurrency(stats.currentValue)}</span>
                          </div>
                          <div className="detail-row">
                            <span>Buy Date</span>
                            <span>{formatDate(position.buyDate)}</span>
                          </div>
                        </div>

                        <div className="position-pnl">
                          <div className={`pnl-indicator ${isGain ? 'positive' : 'negative'}`}>
                            {isGain ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                            <span className="pnl-amount">{formatCurrency(stats.pnl)}</span>
                            <span className="pnl-percent">({stats.pnlPercent.toFixed(2)}%)</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {/* Email Alert Button */}
          <div style={{ margin: '1rem 0' }}>
            <button onClick={async () => {
              try {
                await axios.post('/api/notifications/email', {
                  to: 'your-email@example.com',
                  subject: 'Portfolio Alert',
                  text: 'This is a test alert from your portfolio manager.'
                });
                alert('Test email sent!');
              } catch (e) {
                alert('Failed to send email.');
              }
            }} className="alert-btn">Send Test Email Alert</button>
          </div>
          {/* API Integration Info */}
          <div style={{ marginTop: '2rem' }}>
            <button onClick={() => setShowApiInfo(v => !v)} className="api-info-toggle">
              {showApiInfo ? 'Hide' : 'Show'} API Integration Info
            </button>
            {showApiInfo && (
              <div className="api-info-box" style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '0.5rem' }}>
                <h4>API Key (Demo):</h4>
                <code>your-api-key</code>
                <p style={{ marginTop: '0.5rem' }}>Use this key in the <b>X-API-KEY</b> header for third-party integrations.<br/>Example: <code>GET /api/integrations/status</code></p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Watchlist */}
      {activeTab === 'watchlist' && (
        <div className="watchlist-content">
          <h3>Watchlist</h3>
          {watchlist.length === 0 ? (
            <div className="empty-state">
              <h3>No stocks in watchlist</h3>
              <p>Add stocks to your watchlist to track them</p>
            </div>
          ) : (
            <div className="watchlist-grid">
              {watchlist.map((item) => (
                <div key={item.id} className="watchlist-card">
                  <div className="watchlist-header">
                    <div className="watchlist-info">
                      <h4>{item.symbol}</h4>
                      <p>{item.companyName}</p>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() => removeFromWatchlist(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="watchlist-price">
                    <div className="current-price">{formatCurrency(item.currentPrice)}</div>
                    <div className={`price-change ${(item.priceChange || 0) >= 0 ? 'positive' : 'negative'}`}>
                      {formatCurrency(Math.abs(item.priceChange || 0))} ({(item.priceChangePercent || 0).toFixed(2)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Stock Form */}
      {activeTab === 'add' && (
        <div className="add-stock-content">
          <h3>Add Stock to Portfolio</h3>
          <div className="add-stock-form">
            <div className="form-group">
              <label>Stock Symbol *</label>
              <input
                type="text"
                value={addStockForm.symbol}
                onChange={(e) => setAddStockForm(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                placeholder="e.g., AAPL"
                maxLength={5}
              />
            </div>
            
            <div className="form-group">
              <label>Number of Shares *</label>
              <input
                type="number"
                value={addStockForm.shares}
                onChange={(e) => setAddStockForm(prev => ({ ...prev, shares: e.target.value }))}
                placeholder="e.g., 10"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label>Buy Price per Share *</label>
              <input
                type="number"
                value={addStockForm.buyPrice}
                onChange={(e) => setAddStockForm(prev => ({ ...prev, buyPrice: e.target.value }))}
                placeholder="e.g., 150.00"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label>Buy Date</label>
              <input
                type="date"
                value={addStockForm.buyDate}
                onChange={(e) => setAddStockForm(prev => ({ ...prev, buyDate: e.target.value }))}
              />
            </div>
            
            <button
              className="add-stock-button"
              onClick={addToPortfolio}
              disabled={loading || !addStockForm.symbol || !addStockForm.shares || !addStockForm.buyPrice}
            >
              <Plus size={16} />
              {loading ? 'Adding...' : 'Add to Portfolio'}
            </button>
          </div>
        </div>
      )}

      {/* Performance Analytics */}
      {activeTab === 'analytics' && (
        <PerformanceAnalytics portfolio={portfolio} />
      )}



      {/* Quick Actions */}
      {symbol && (
        <div className="quick-actions">
          <h3>Quick Actions for {symbol}</h3>
          <div className="action-buttons">
            <button
              className="action-button portfolio-action"
              onClick={() => {
                setAddStockForm(prev => ({ ...prev, symbol: symbol.toUpperCase() }));
                setActiveTab('add');
              }}
              disabled={portfolio.find(item => item.symbol === symbol)}
            >
              <Plus size={16} />
              {portfolio.find(item => item.symbol === symbol) ? 'Already in Portfolio' : 'Add to Portfolio'}
            </button>
            <button
              className="action-button watchlist-action"
              onClick={() => addToWatchlist(symbol)}
              disabled={watchlist.find(item => item.symbol === symbol)}
            >
              <Eye size={16} />
              {watchlist.find(item => item.symbol === symbol) ? 'Already in Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioManager; 