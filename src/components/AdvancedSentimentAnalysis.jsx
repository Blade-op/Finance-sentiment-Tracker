import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  FileText, 
  Users, 
  BarChart3,
  Target,
  Activity,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import advancedSentimentApi from '../services/advancedSentimentApi';
import SentimentTrendChart from './SentimentTrendChart';
import '../styles/AdvancedSentimentAnalysis.css';

const AdvancedSentimentAnalysis = ({ symbol }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('30d');
  
  const [comprehensiveData, setComprehensiveData] = useState(null);
  const [socialData, setSocialData] = useState(null);
  const [earningsData, setEarningsData] = useState(null);
  const [analystData, setAnalystData] = useState(null);
  const [trendsData, setTrendsData] = useState(null);

  useEffect(() => {
    if (symbol) {
      loadSentimentData();
    }
  }, [symbol, timeframe]);

  const loadSentimentData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [comprehensive, social, earnings, analysts, trends] = await Promise.all([
        advancedSentimentApi.getComprehensiveSentiment(symbol),
        advancedSentimentApi.getSocialMediaSentiment(symbol),
        advancedSentimentApi.getEarningsCallAnalysis(symbol),
        advancedSentimentApi.getAnalystRatings(symbol),
        advancedSentimentApi.getSentimentTrends(symbol, timeframe)
      ]);

      setComprehensiveData(comprehensive);
      setSocialData(social);
      setEarningsData(earnings);
      setAnalystData(analysts);
      setTrendsData(trends);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => {
    if (!comprehensiveData) return null;

    const { overallSentiment } = comprehensiveData;
    const sentimentInfo = advancedSentimentApi.formatSentimentScore(overallSentiment.score);
    const confidenceInfo = advancedSentimentApi.formatConfidence(overallSentiment.confidence);

    return (
      <div className="sentiment-overview">
        <div className="overview-header">
          <h2>Sentiment Overview</h2>
          <div className="overview-summary">
            <div className="sentiment-score">
              <span className="score-emoji">{sentimentInfo.emoji}</span>
              <span className="score-label">{sentimentInfo.label}</span>
              <span className="score-value">{(overallSentiment.score * 100).toFixed(1)}%</span>
            </div>
            <div className="confidence-level">
              <span className="confidence-label">Confidence: {confidenceInfo.label}</span>
              <div className="confidence-bar">
                <div 
                  className="confidence-fill" 
                  style={{ 
                    width: `${overallSentiment.confidence * 100}%`,
                    backgroundColor: confidenceInfo.color 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sentiment-factors">
          <h3>Sentiment Factors</h3>
          <div className="factors-grid">
            <div className="factor-card">
              <MessageSquare size={20} />
              <span>Social Media</span>
              <span className="factor-score">{(overallSentiment.factors.socialMedia * 100).toFixed(1)}%</span>
            </div>
            <div className="factor-card">
              <FileText size={20} />
              <span>Earnings Call</span>
              <span className="factor-score">{(overallSentiment.factors.earningsCall * 100).toFixed(1)}%</span>
            </div>
            <div className="factor-card">
              <Users size={20} />
              <span>Analyst Consensus</span>
              <span className="factor-score">{(overallSentiment.factors.analystConsensus * 100).toFixed(1)}%</span>
            </div>
            <div className="factor-card">
              <TrendingUp size={20} />
              <span>Trend Direction</span>
              <span className="factor-score">{(overallSentiment.factors.trendDirection * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSocialMedia = () => {
    if (!socialData) return null;

    return (
      <div className="social-media-section">
        <h3>Social Media Sentiment</h3>
        
        <div className="social-platforms">
          <div className="platform-card twitter">
            <div className="platform-header">
              <h4>Twitter</h4>
              <span className="mentions">{socialData.twitter.mentions} mentions</span>
            </div>
            <div className="sentiment-breakdown">
              <div className="sentiment-item positive">
                <span>Positive</span>
                <span>{(socialData.twitter.positiveSentiment * 100).toFixed(1)}%</span>
              </div>
              <div className="sentiment-item neutral">
                <span>Neutral</span>
                <span>{(socialData.twitter.neutralSentiment * 100).toFixed(1)}%</span>
              </div>
              <div className="sentiment-item negative">
                <span>Negative</span>
                <span>{(socialData.twitter.negativeSentiment * 100).toFixed(1)}%</span>
              </div>
            </div>
            {socialData.twitter.trending && (
              <div className="trending-badge">
                <Zap size={16} />
                Trending
              </div>
            )}
          </div>

          <div className="platform-card reddit">
            <div className="platform-header">
              <h4>Reddit</h4>
              <span className="mentions">{socialData.reddit.mentions} mentions</span>
            </div>
            <div className="sentiment-breakdown">
              <div className="sentiment-item positive">
                <span>Positive</span>
                <span>{(socialData.reddit.positiveSentiment * 100).toFixed(1)}%</span>
              </div>
              <div className="sentiment-item neutral">
                <span>Neutral</span>
                <span>{(socialData.reddit.neutralSentiment * 100).toFixed(1)}%</span>
              </div>
              <div className="sentiment-item negative">
                <span>Negative</span>
                <span>{(socialData.reddit.negativeSentiment * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="subreddits">
              <span>Top subreddits:</span>
              <div className="subreddit-tags">
                {socialData.reddit.subreddits.map(sub => (
                  <span key={sub} className="subreddit-tag">r/{sub}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="overall-social">
          <h4>Overall Social Sentiment</h4>
          <div className="overall-score">
            <span className="score">{(socialData.overall.score * 100).toFixed(1)}%</span>
            <span className="confidence">Confidence: {(socialData.overall.confidence * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    );
  };

  const renderEarningsCall = () => {
    if (!earningsData) return null;

    return (
      <div className="earnings-call-section">
        <h3>Earnings Call Analysis</h3>
        
        <div className="earnings-header">
          <div className="last-earnings">
            <span>Last Earnings: {new Date(earningsData.lastEarningsDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="transcript-sentiment">
          <h4>Transcript Sentiment</h4>
          <div className="sentiment-metrics">
            <div className="metric">
              <span>Overall</span>
              <span className="score">{(earningsData.transcriptSentiment.overall * 100).toFixed(1)}%</span>
            </div>
            <div className="metric">
              <span>Revenue</span>
              <span className="score">{(earningsData.transcriptSentiment.revenue * 100).toFixed(1)}%</span>
            </div>
            <div className="metric">
              <span>Growth</span>
              <span className="score">{(earningsData.transcriptSentiment.growth * 100).toFixed(1)}%</span>
            </div>
            <div className="metric">
              <span>Guidance</span>
              <span className="score">{(earningsData.transcriptSentiment.guidance * 100).toFixed(1)}%</span>
            </div>
            <div className="metric">
              <span>Management</span>
              <span className="score">{(earningsData.transcriptSentiment.management * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="key-topics">
          <h4>Key Topics</h4>
          <div className="topics-list">
            {earningsData.keyTopics.map((topic, index) => (
              <div key={index} className="topic-item">
                <span className="topic-name">{topic.topic}</span>
                <span className="topic-mentions">{topic.mentions} mentions</span>
                <span className="topic-sentiment">{(topic.sentiment * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ai-analysis">
          <h4>AI Analysis</h4>
          <div className="analysis-content">
            <p className="summary">{earningsData.aiAnalysis.summary}</p>
            <div className="confidence">
              <span>Confidence: {(earningsData.aiAnalysis.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="key-insights">
              <h5>Key Insights:</h5>
              <ul>
                {earningsData.aiAnalysis.keyInsights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalystRatings = () => {
    if (!analystData) return null;

    return (
      <div className="analyst-ratings-section">
        <h3>Analyst Ratings</h3>
        
        <div className="ratings-summary">
          <div className="total-analysts">
            <Users size={20} />
            <span>{analystData.totalAnalysts} Analysts</span>
          </div>
          
          <div className="ratings-breakdown">
            <div className="rating-item buy">
              <span className="rating-label">Buy</span>
              <span className="rating-count">{analystData.ratings.buy}</span>
            </div>
            <div className="rating-item hold">
              <span className="rating-label">Hold</span>
              <span className="rating-count">{analystData.ratings.hold}</span>
            </div>
            <div className="rating-item sell">
              <span className="rating-label">Sell</span>
              <span className="rating-count">{analystData.ratings.sell}</span>
            </div>
          </div>
        </div>

        <div className="consensus">
          <h4>Consensus</h4>
          <div className="consensus-details">
            <div className="consensus-rating">
              <span>Rating:</span>
              <span className="rating-badge" style={{ 
                backgroundColor: advancedSentimentApi.formatAnalystRating(analystData.consensus.rating).color 
              }}>
                {analystData.consensus.rating}
              </span>
            </div>
            <div className="consensus-confidence">
              <span>Confidence: {(analystData.consensus.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="consensus-upside">
              <span>Upside: +{analystData.consensus.upside.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="price-targets">
          <h4>Price Targets</h4>
          <div className="targets-grid">
            <div className="target-item">
              <span>Average</span>
              <span className="target-price">${analystData.priceTargets.average.toFixed(2)}</span>
            </div>
            <div className="target-item">
              <span>High</span>
              <span className="target-price">${analystData.priceTargets.high.toFixed(2)}</span>
            </div>
            <div className="target-item">
              <span>Low</span>
              <span className="target-price">${analystData.priceTargets.low.toFixed(2)}</span>
            </div>
            <div className="target-item">
              <span>Median</span>
              <span className="target-price">${analystData.priceTargets.median.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="recent-updates">
          <h4>Recent Updates</h4>
          <div className="updates-list">
            {analystData.recentUpdates.map((update, index) => (
              <div key={index} className="update-item">
                <div className="update-header">
                  <span className="analyst-name">{update.analyst}</span>
                  <span className="update-date">{new Date(update.date).toLocaleDateString()}</span>
                </div>
                <div className="update-rating">
                  <span className="rating" style={{ 
                    backgroundColor: advancedSentimentApi.formatAnalystRating(update.rating).color 
                  }}>
                    {update.rating}
                  </span>
                  <span className="price-target">${update.priceTarget.toFixed(2)}</span>
                </div>
                <p className="update-note">{update.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTrends = () => {
    if (!trendsData) return null;

    return (
      <div className="sentiment-trends-section">
        <h3>Sentiment Trends</h3>
        
        <div className="trends-header">
          <div className="timeframe-selector">
            <button 
              className={timeframe === '7d' ? 'active' : ''} 
              onClick={() => setTimeframe('7d')}
            >
              7D
            </button>
            <button 
              className={timeframe === '30d' ? 'active' : ''} 
              onClick={() => setTimeframe('30d')}
            >
              30D
            </button>
            <button 
              className={timeframe === '90d' ? 'active' : ''} 
              onClick={() => setTimeframe('90d')}
            >
              90D
            </button>
          </div>
        </div>

        <div className="trends-summary">
          <div className="summary-item">
            <span>Trend:</span>
            <span className={`trend-${trendsData.summary.trend}`}>
              {trendsData.summary.trend === 'improving' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {trendsData.summary.trend}
            </span>
          </div>
          <div className="summary-item">
            <span>Volatility:</span>
            <span>{(trendsData.summary.volatility * 100).toFixed(1)}%</span>
          </div>
          <div className="summary-item">
            <span>Average:</span>
            <span>{(trendsData.summary.averageSentiment * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="trends-chart">
          <SentimentTrendChart data={trendsData.dataPoints} />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="sentiment-loading">
        <div className="loading-spinner">
          <Activity size={32} className="spinning" />
        </div>
        <p>Analyzing sentiment data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sentiment-error">
        <AlertCircle size={32} />
        <p>Error: {error}</p>
        <button onClick={loadSentimentData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="advanced-sentiment-analysis">
      <div className="sentiment-header">
        <h2>Advanced Sentiment Analysis</h2>
        <p>Comprehensive sentiment analysis for {symbol}</p>
      </div>

      <div className="sentiment-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={16} />
          Overview
        </button>
        <button 
          className={activeTab === 'social' ? 'active' : ''} 
          onClick={() => setActiveTab('social')}
        >
          <MessageSquare size={16} />
          Social Media
        </button>
        <button 
          className={activeTab === 'earnings' ? 'active' : ''} 
          onClick={() => setActiveTab('earnings')}
        >
          <FileText size={16} />
          Earnings Call
        </button>
        <button 
          className={activeTab === 'analysts' ? 'active' : ''} 
          onClick={() => setActiveTab('analysts')}
        >
          <Users size={16} />
          Analyst Ratings
        </button>
        <button 
          className={activeTab === 'trends' ? 'active' : ''} 
          onClick={() => setActiveTab('trends')}
        >
          <TrendingUp size={16} />
          Trends
        </button>
      </div>

      <div className="sentiment-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'social' && renderSocialMedia()}
        {activeTab === 'earnings' && renderEarningsCall()}
        {activeTab === 'analysts' && renderAnalystRatings()}
        {activeTab === 'trends' && renderTrends()}
      </div>
    </div>
  );
};

export default AdvancedSentimentAnalysis; 