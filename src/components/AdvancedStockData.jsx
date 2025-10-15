import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, DollarSign, Volume2, Target } from 'lucide-react';
import AdvancedStockApiService from '../services/advancedStockApi';
import StockChart from './StockChart';
import RealtimePriceDisplay from './RealtimePriceDisplay';
import '../styles/AdvancedStockData.css';
import '../styles/StockChart.css';

const AdvancedStockData = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('AdvancedStockData rendered with symbol:', symbol);

  useEffect(() => {
    if (symbol) {
      console.log('AdvancedStockData component mounted with symbol:', symbol);
      fetchStockData();
    }
  }, [symbol]);

  // Add a separate effect to handle initial load
  useEffect(() => {
    if (symbol && !stockData && !loading) {
      console.log('Initial load for symbol:', symbol);
      fetchStockData();
    }
  }, [symbol]);

  const fetchStockData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching advanced stock data for:', symbol);
      
      const [enhancedData, historical] = await Promise.all([
        AdvancedStockApiService.getEnhancedStockData(symbol),
        AdvancedStockApiService.getHistoricalData(symbol, '1mo', '1d') // Fixed timeframe: 1 month, daily data
      ]);
      
      console.log('Enhanced data:', enhancedData);
      console.log('Historical data:', historical);
      
      setStockData(enhancedData);
      setHistoricalData(historical);
    } catch (err) {
      console.error('Error fetching advanced stock data:', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined || num === 0) return 'N/A';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const formatCurrency = (num) => {
    if (num === null || num === undefined || num === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const formatRatio = (num) => {
    if (num === null || num === undefined || num === 0) return 'N/A';
    return num.toFixed(2);
  };

  const formatPercentage = (num) => {
    if (num === null || num === undefined || num === 0) return 'N/A';
    return (num * 100).toFixed(2) + '%';
  };

  const getDataStatus = (value) => {
    if (value === null || value === undefined || value === 0) {
      return { status: 'unavailable', text: 'Data not available' };
    }
    return { status: 'available', text: 'Data available' };
  };

  const getRSIColor = (rsi) => {
    if (rsi > 70) return '#ef4444'; // Red for overbought
    if (rsi < 30) return '#10b981'; // Green for oversold
    return '#6b7280'; // Gray for neutral
  };

  const getMACDSignal = (macd, signal) => {
    if (macd > signal) return { color: '#10b981', text: 'Bullish' };
    return { color: '#ef4444', text: 'Bearish' };
  };

  if (loading) {
    return (
      <div className="advanced-stock-container">
        <div className="loading-spinner">
          <Activity className="spinner" />
          <p>Loading advanced stock data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="advanced-stock-container">
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      </div>
    );
  }

  if (!stockData || !historicalData) {
    return (
      <div className="advanced-stock-container">
        <div className="loading-spinner">
          <Activity className="spinner" />
          <p>Loading advanced stock data for {symbol}...</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>This may take a few seconds</p>
          <p style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '1rem' }}>
            Debug: Symbol = {symbol}, Loading = {loading.toString()}, Error = {error || 'none'}
          </p>
          <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>
            StockData: {stockData ? 'Loaded' : 'Not loaded'}, HistoricalData: {historicalData ? 'Loaded' : 'Not loaded'}
          </p>
        </div>
      </div>
    );
  }

  const { marketData = {}, technicalIndicators = {}, tradingSession = {} } = stockData || {};
  
  console.log('StockData:', stockData);
  console.log('HistoricalData:', historicalData);
  
  const chartData = AdvancedStockApiService.formatChartData(historicalData);
  console.log('Formatted ChartData:', chartData);
  
  const priceStats = AdvancedStockApiService.calculatePriceStats(chartData?.prices || []);
  console.log('PriceStats:', priceStats);

  return (
    <div className="advanced-stock-container">
      {/* Header with basic info */}
      <div className="stock-header">
        <div className="stock-title">
          <h2>{stockData.symbol}</h2>
          <p>{stockData.companyName}</p>
        </div>
        <div className="stock-price">
          <RealtimePriceDisplay 
            symbol={symbol}
            initialPrice={stockData.currentPrice}
            className="realtime-price-large"
          />
        </div>
      </div>

      {/* Market Data Grid */}
      <div className="market-data-grid">
        <div className="market-card">
          <div className="card-header">
            <Volume2 size={20} />
            <h3>Volume</h3>
          </div>
          <div className="card-content">
            <p className="card-value">{formatNumber(marketData.volume)}</p>
            <p className="card-label">Current Volume</p>
            <p className="card-status">{getDataStatus(marketData.volume).text}</p>
          </div>
        </div>

        <div className="market-card">
          <div className="card-header">
            <DollarSign size={20} />
            <h3>Market Cap</h3>
          </div>
          <div className="card-content">
            <p className="card-value">{formatNumber(marketData.marketCap)}</p>
            <p className="card-label">Market Capitalization</p>
            <p className="card-status">{getDataStatus(marketData.marketCap).text}</p>
          </div>
        </div>

        <div className="market-card">
          <div className="card-header">
            <BarChart3 size={20} />
            <h3>P/E Ratio</h3>
          </div>
          <div className="card-content">
            <p className="card-value">{formatRatio(marketData.peRatio)}</p>
            <p className="card-label">Price to Earnings</p>
            <p className="card-status">{getDataStatus(marketData.peRatio).text}</p>
          </div>
        </div>

        <div className="market-card">
          <div className="card-header">
            <Target size={20} />
            <h3>Beta</h3>
          </div>
          <div className="card-content">
            <p className="card-value">{formatRatio(marketData.beta)}</p>
            <p className="card-label">Volatility vs Market</p>
            <p className="card-status">{getDataStatus(marketData.beta).text}</p>
          </div>
        </div>
      </div>

      {/* Trading Session Data */}
      <div className="trading-session">
        <h3>Trading Session</h3>
        <div className="session-grid">
          <div className="session-item">
            <span className="label">Open:</span>
            <span className="value">{formatCurrency(tradingSession.open)}</span>
          </div>
          <div className="session-item">
            <span className="label">High:</span>
            <span className="value">{formatCurrency(tradingSession.high)}</span>
          </div>
          <div className="session-item">
            <span className="label">Low:</span>
            <span className="value">{formatCurrency(tradingSession.low)}</span>
          </div>
          <div className="session-item">
            <span className="label">Close:</span>
            <span className="value">{formatCurrency(tradingSession.close)}</span>
          </div>
        </div>
      </div>

      {/* Technical Indicators */}
      {technicalIndicators && (
        <div className="technical-indicators">
          <h3>Technical Indicators</h3>
          <div className="indicators-grid">
            <div className="indicator-card">
              <h4>RSI (14)</h4>
              <div 
                className="indicator-value"
                style={{ color: getRSIColor(technicalIndicators.currentRSI) }}
              >
                {formatRatio(technicalIndicators.currentRSI)}
              </div>
              <p className="indicator-label">
                {(technicalIndicators.currentRSI || 0) > 70 ? 'OVERSOLD' : 
                 (technicalIndicators.currentRSI || 0) < 30 ? 'OVERSOLD' : 'NEUTRAL'}
              </p>
              <p className="indicator-status">{getDataStatus(technicalIndicators.currentRSI).text}</p>
            </div>

            <div className="indicator-card">
              <h4>MACD</h4>
              <div className="indicator-value">
                {formatRatio(technicalIndicators.currentMACD)}
              </div>
              <p className="indicator-label">
                {getMACDSignal(technicalIndicators.currentMACD || 0, technicalIndicators.macdSignal || 0).text}
              </p>
              <p className="indicator-status">{getDataStatus(technicalIndicators.currentMACD).text}</p>
            </div>

            <div className="indicator-card">
              <h4>SMA (20)</h4>
              <div className="indicator-value">
                {formatCurrency(technicalIndicators.sma20)}
              </div>
              <p className="indicator-label">20-DAY AVERAGE</p>
              <p className="indicator-status">{getDataStatus(technicalIndicators.sma20).text}</p>
            </div>

            <div className="indicator-card">
              <h4>SMA (50)</h4>
              <div className="indicator-value">
                {formatCurrency(technicalIndicators.sma50)}
              </div>
              <p className="indicator-label">50-DAY AVERAGE</p>
              <p className="indicator-status">{getDataStatus(technicalIndicators.sma50).text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Price Statistics */}
      {priceStats && priceStats.high && (
        <div className="price-statistics">
          <h3>Price Statistics (1 Month)</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="label">High:</span>
              <span className="value">{formatCurrency(priceStats.high)}</span>
            </div>
            <div className="stat-item">
              <span className="label">Low:</span>
              <span className="value">{formatCurrency(priceStats.low)}</span>
            </div>
            <div className="stat-item">
              <span className="label">Change:</span>
              <span className={`value ${(priceStats.priceChange || 0) >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(Math.abs(priceStats.priceChange || 0))} ({(priceStats.priceChangePercent || 0).toFixed(2)}%)
              </span>
            </div>
            <div className="stat-item">
              <span className="label">Avg Volume:</span>
              <span className="value">{formatNumber(priceStats.averageVolume)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Stock Chart */}
      <div className="price-chart">
        <h3>Price Chart (1 Month)</h3>
        {chartData && chartData.prices && chartData.prices.length > 0 ? (
          <StockChart 
            data={chartData} 
            timeframe="1M"
            showVolume={true}
            showIndicators={true}
          />
        ) : (
          <div className="chart-placeholder">
            <BarChart3 size={48} />
            <p>No chart data available</p>
            <p className="chart-info">
              Loading chart data...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedStockData; 