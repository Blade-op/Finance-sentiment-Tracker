import React from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import '../styles/SentimentDisplay.css';

const SentimentDisplay = ({ stockData, articles }) => {
  // Destructure the properties from stockData with fallbacks
  const {
    averageSentiment = 0,
    stockSymbol = '',
    totalArticles = 0,
    companyName = '',
    currentPrice = 0,
    priceChange = 0,
    priceChangePercent = 0
  } = stockData || {};
  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.1) return 'positive';
    if (sentiment < -0.1) return 'negative';
    return 'neutral';
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment > 0.1) return <TrendingUp className="sentiment-icon" />;
    if (sentiment < -0.1) return <TrendingDown className="sentiment-icon" />;
    return <Minus className="sentiment-icon" />;
  };

  const getSentimentText = (sentiment) => {
    if (sentiment > 0.3) return 'Very Positive';
    if (sentiment > 0.1) return 'Positive';
    if (sentiment < -0.3) return 'Very Negative';
    if (sentiment < -0.1) return 'Negative';
    return 'Neutral';
  };

  const getSentimentDescription = (sentiment) => {
    if (sentiment > 0.1) {
      return 'Market sentiment suggests potential upward movement';
    } else if (sentiment < -0.1) {
      return 'Market sentiment indicates possible downward pressure';
    }
    return 'Market sentiment appears balanced with mixed signals';
  };

  const sentimentColor = getSentimentColor(averageSentiment || 0);
  const sentimentPercentage = (((averageSentiment || 0) + 1) / 2 * 100).toFixed(1);

  return (
    <div className={`sentiment-display ${sentimentColor}`}>
      <div className="sentiment-header">
        <div className="sentiment-icon-wrapper">
          <BarChart3 className="chart-icon" />
        </div>
        <div className="sentiment-info">
          <h2 className="sentiment-title">
            {companyName ? `${companyName} (${stockSymbol})` : stockSymbol} Sentiment Analysis
          </h2>
          <p className="sentiment-meta">
            Based on {totalArticles} recent news articles
            {currentPrice && (
              <span className="stock-price-info">
                {' • '}Current Price: ${(currentPrice || 0).toFixed(2)}
                {priceChange && (
                  <span className={`price-change ${(priceChange || 0) >= 0 ? 'positive' : 'negative'}`}>
                    {' '}({(priceChange || 0) >= 0 ? '+' : ''}{(priceChange || 0).toFixed(2)}, {(priceChangePercent || 0) >= 0 ? '+' : ''}{(priceChangePercent || 0).toFixed(2)}%)
                  </span>
                )}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="sentiment-score-section">
        <div className="sentiment-score-main">
          <div className="sentiment-icon-large">
            {getSentimentIcon(averageSentiment || 0)}
          </div>
          <div className="sentiment-details">
            <div className="sentiment-score">
              {(averageSentiment || 0) > 0 ? '+' : ''}{(averageSentiment || 0).toFixed(3)}
            </div>
            <div className="sentiment-label">
              {getSentimentText(averageSentiment || 0)}
            </div>
          </div>
        </div>

        <div className="sentiment-meter">
          <div className="meter-track">
            <div 
              className="meter-fill"
              style={{ width: `${sentimentPercentage}%` }}
            ></div>
          </div>
          <div className="meter-labels">
            <span>Very Negative</span>
            <span>Neutral</span>
            <span>Very Positive</span>
          </div>
        </div>
      </div>

      <div className="sentiment-description">
        <p>{getSentimentDescription(averageSentiment || 0)}</p>
      </div>

      {/* News Articles Section */}
      {articles && articles.length > 0 && (
        <div className="news-articles-section">
          <h3 className="news-section-title">Recent News Articles</h3>
          <div className="news-articles-list">
            {articles.map((article, index) => (
              <div key={index} className="news-article-card">
                <div className="article-content">
                  <div className="article-main">
                    <h4 className="article-title">
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="article-link"
                      >
                        {article.title}
                      </a>
                    </h4>
                    <div className="article-meta">
                      <span className="article-timestamp">
                        {new Date(article.publishedAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    </div>
                    <p className="article-description">{article.description}</p>
                    <div className="article-action">
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="read-article-link"
                      >
                        Read full article
                      </a>
                    </div>
                  </div>
                  <div className="article-sentiment-display">
                    <div className="sentiment-score-large">
                      {article.sentiment > 0 ? '+' : ''}{(article.sentiment || 0).toFixed(2)}
                    </div>
                    <div className="sentiment-label-large">
                      {getSentimentText(article.sentiment || 0).toUpperCase()}
                    </div>
                    {article.image && (
                      <div className="article-image-container">
                        <img 
                          src={article.image} 
                          alt="Article thumbnail"
                          className="article-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentDisplay;