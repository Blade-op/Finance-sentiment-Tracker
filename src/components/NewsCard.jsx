import React from 'react';
import { ExternalLink, TrendingUp, TrendingDown, Minus, Tag } from 'lucide-react';
import '../styles/NewsCard.css';

const NewsCard = ({ article }) => {
  const { title, description, url, publishedAt, sentiment, source, image, category } = article;

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.1) return 'positive';
    if (sentiment < -0.1) return 'negative';
    return 'neutral';
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment > 0.1) return <TrendingUp size={16} />;
    if (sentiment < -0.1) return <TrendingDown size={16} />;
    return <Minus size={16} />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Earnings': '#10B981',
      'Product Launch': '#3B82F6',
      'M&A': '#8B5CF6',
      'Analyst Rating': '#F59E0B',
      'Market Analysis': '#EF4444',
      'General News': '#6B7280'
    };
    return colors[category] || '#6B7280';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sentimentColor = getSentimentColor(sentiment);

  return (
    <div className={`news-card ${sentimentColor}`}>
      {image && (
        <div className="news-image">
          <img src={image} alt={title} onError={(e) => e.target.style.display = 'none'} />
        </div>
      )}
      
      <div className="news-card-header">
        <div className="news-meta">
  
          <span className="news-date">{formatDate(publishedAt)}</span>
          {source && <span className="news-source">• {source}</span>}
        </div>
        <div className="news-badges">
          {category && (
            <div 
              className="category-badge"
              style={{ backgroundColor: getCategoryColor(category) }}
            >
              <Tag size={12} />
              <span>{category}</span>
            </div>
          )}
          <div className={`sentiment-badge ${sentimentColor}`}>
            {getSentimentIcon(sentiment)}
            <span className="sentiment-score">
              {sentiment > 0 ? '+' : ''}{sentiment.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="news-content">
        <h3 className="news-title">{title}</h3>
        <p className="news-description">{description}</p>
      </div>

      <div className="news-footer">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="news-link"
        >
          <span>Read full article</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

export default NewsCard;