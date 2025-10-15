import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Target, Award } from 'lucide-react';
import '../styles/PerformanceAnalytics.css';
import axios from 'axios';

const PerformanceAnalytics = ({ portfolio }) => {
  const [timeframe, setTimeframe] = useState('1M');
  const [analytics, setAnalytics] = useState(null);
  const [reportType, setReportType] = useState('summary');
  const [reportResult, setReportResult] = useState(null);

  useEffect(() => {
    if (portfolio && portfolio.length > 0) {
      calculateAnalytics();
    }
  }, [portfolio, timeframe]);

  const calculateAnalytics = () => {
    if (!portfolio || portfolio.length === 0) return;

    const totalCost = portfolio.reduce((sum, position) => {
      return sum + (position.shares * position.buyPrice);
    }, 0);

    const totalCurrentValue = portfolio.reduce((sum, position) => {
      return sum + (position.shares * (position.currentPrice || position.buyPrice));
    }, 0);

    const totalPnl = totalCurrentValue - totalCost;
    const totalPnlPercent = (totalPnl / totalCost) * 100;

    // Calculate individual position performance
    const positionPerformance = portfolio.map(position => {
      const positionCost = position.shares * position.buyPrice;
      const positionValue = position.shares * (position.currentPrice || position.buyPrice);
      const positionPnl = positionValue - positionCost;
      const positionPnlPercent = (positionPnl / positionCost) * 100;

      return {
        ...position,
        cost: positionCost,
        value: positionValue,
        pnl: positionPnl,
        pnlPercent: positionPnlPercent
      };
    });

    // Sort by performance
    const bestPerformers = [...positionPerformance]
      .sort((a, b) => b.pnlPercent - a.pnlPercent)
      .slice(0, 3);

    const worstPerformers = [...positionPerformance]
      .sort((a, b) => a.pnlPercent - b.pnlPercent)
      .slice(0, 3);

    // Calculate allocation
    const allocation = positionPerformance.map(position => ({
      symbol: position.symbol,
      percentage: (position.value / totalCurrentValue) * 100,
      value: position.value
    }));

    // Calculate risk metrics (simplified)
    const avgReturn = positionPerformance.reduce((sum, pos) => sum + pos.pnlPercent, 0) / positionPerformance.length;
    const volatility = Math.sqrt(
      positionPerformance.reduce((sum, pos) => sum + Math.pow(pos.pnlPercent - avgReturn, 2), 0) / positionPerformance.length
    );

    setAnalytics({
      totalCost,
      totalCurrentValue,
      totalPnl,
      totalPnlPercent,
      positionPerformance,
      bestPerformers,
      worstPerformers,
      allocation,
      avgReturn,
      volatility,
      totalPositions: portfolio.length
    });
  };

  const formatCurrency = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  if (!analytics) {
    return (
      <div className="performance-analytics">
        <div className="empty-state">
          <BarChart3 size={48} />
          <h3>No Portfolio Data</h3>
          <p>Add stocks to your portfolio to see performance analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="performance-analytics">
      {/* Header */}
      <div className="analytics-header">
        <h2>Performance Analytics</h2>
        {/* Export Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <button onClick={() => window.open('/api/export/csv', '_blank')} className="export-btn">Export CSV</button>
          <button onClick={() => window.open('/api/export/pdf', '_blank')} className="export-btn">Export PDF</button>
        </div>
        {/* Custom Report Form */}
        <form style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }} onSubmit={async e => {
          e.preventDefault();
          try {
            const res = await axios.post('/api/reports/generate', { type: reportType, filters: {} });
            setReportResult(res.data);
          } catch (err) {
            setReportResult({ error: 'Failed to generate report.' });
          }
        }}>
          <label>Report Type:</label>
          <select value={reportType} onChange={e => setReportType(e.target.value)}>
            <option value="summary">Summary</option>
            <option value="detailed">Detailed</option>
          </select>
          <button type="submit" className="report-btn">Generate Report</button>
        </form>
        {/* Report Result */}
        {reportResult && (
          <div style={{ marginTop: '1rem', background: '#f9f9f9', padding: '1rem', borderRadius: '6px' }}>
            <pre style={{ margin: 0 }}>{JSON.stringify(reportResult, null, 2)}</pre>
          </div>
        )}
        <div className="timeframe-selector">
          {['1W', '1M', '3M', '6M', '1Y'].map((period) => (
            <button
              key={period}
              className={`timeframe-button ${timeframe === period ? 'active' : ''}`}
              onClick={() => setTimeframe(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="key-metrics">
        <div className="metric-card">
          <div className="metric-icon">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <h4>Total Return</h4>
            <p className={`metric-value ${analytics.totalPnlPercent >= 0 ? 'positive' : 'negative'}`}>
              {analytics.totalPnlPercent.toFixed(2)}%
            </p>
            <p className="metric-amount">{formatCurrency(analytics.totalPnl)}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <BarChart3 size={24} />
          </div>
          <div className="metric-content">
            <h4>Portfolio Value</h4>
            <p className="metric-value">{formatCurrency(analytics.totalCurrentValue)}</p>
            <p className="metric-amount">Total Cost: {formatCurrency(analytics.totalCost)}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Target size={24} />
          </div>
          <div className="metric-content">
            <h4>Avg Return</h4>
            <p className={`metric-value ${analytics.avgReturn >= 0 ? 'positive' : 'negative'}`}>
              {analytics.avgReturn.toFixed(2)}%
            </p>
            <p className="metric-amount">Per Position</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Award size={24} />
          </div>
          <div className="metric-content">
            <h4>Positions</h4>
            <p className="metric-value">{analytics.totalPositions}</p>
            <p className="metric-amount">Active Stocks</p>
          </div>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="performance-breakdown">
        <div className="breakdown-section">
          <h3>Top Performers</h3>
          <div className="performer-list">
            {analytics.bestPerformers.map((position, index) => (
              <div key={position.id} className="performer-item positive">
                <div className="performer-rank">#{index + 1}</div>
                <div className="performer-info">
                  <h4>{position.symbol}</h4>
                  <p>{position.companyName}</p>
                </div>
                <div className="performer-stats">
                  <div className="performer-return">+{position.pnlPercent.toFixed(2)}%</div>
                  <div className="performer-pnl">+{formatCurrency(position.pnl)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="breakdown-section">
          <h3>Underperformers</h3>
          <div className="performer-list">
            {analytics.worstPerformers.map((position, index) => (
              <div key={position.id} className="performer-item negative">
                <div className="performer-rank">#{index + 1}</div>
                <div className="performer-info">
                  <h4>{position.symbol}</h4>
                  <p>{position.companyName}</p>
                </div>
                <div className="performer-stats">
                  <div className="performer-return">{position.pnlPercent.toFixed(2)}%</div>
                  <div className="performer-pnl">{formatCurrency(position.pnl)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Allocation */}
      <div className="allocation-section">
        <h3>Portfolio Allocation</h3>
        <div className="allocation-chart">
          {analytics.allocation.map((item, index) => (
            <div key={item.symbol} className="allocation-item">
              <div className="allocation-bar">
                <div 
                  className="allocation-fill"
                  style={{ 
                    width: `${item.percentage}%`,
                    backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                  }}
                ></div>
              </div>
              <div className="allocation-info">
                <span className="allocation-symbol">{item.symbol}</span>
                <span className="allocation-percentage">{item.percentage.toFixed(1)}%</span>
                <span className="allocation-value">{formatCurrency(item.value)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="risk-metrics">
        <h3>Risk Analysis</h3>
        <div className="risk-grid">
          <div className="risk-card">
            <h4>Volatility</h4>
            <p className="risk-value">{analytics.volatility.toFixed(2)}%</p>
            <p className="risk-description">Portfolio volatility based on position returns</p>
          </div>
          <div className="risk-card">
            <h4>Diversification</h4>
            <p className="risk-value">{analytics.totalPositions}</p>
            <p className="risk-description">Number of different positions</p>
          </div>
          <div className="risk-card">
            <h4>Concentration</h4>
            <p className="risk-value">
              {analytics.allocation.length > 0 ? analytics.allocation[0].percentage.toFixed(1) : 0}%
            </p>
            <p className="risk-description">Largest position weight</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics; 