const API_BASE_URL = 'http://localhost:5000/api';

class AdvancedSentimentApi {
  // Get social media sentiment
  async getSocialMediaSentiment(symbol) {
    try {
      const response = await fetch(`${API_BASE_URL}/sentiment/social/${symbol}`);
      if (!response.ok) {
        throw new Error('Failed to fetch social media sentiment');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching social media sentiment:', error);
      throw error;
    }
  }

  // Get earnings call analysis
  async getEarningsCallAnalysis(symbol) {
    try {
      const response = await fetch(`${API_BASE_URL}/sentiment/earnings/${symbol}`);
      if (!response.ok) {
        throw new Error('Failed to fetch earnings call analysis');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching earnings call analysis:', error);
      throw error;
    }
  }

  // Get analyst ratings
  async getAnalystRatings(symbol) {
    try {
      const response = await fetch(`${API_BASE_URL}/sentiment/analysts/${symbol}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analyst ratings');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching analyst ratings:', error);
      throw error;
    }
  }

  // Get sentiment trends
  async getSentimentTrends(symbol, timeframe = '30d') {
    try {
      const response = await fetch(`${API_BASE_URL}/sentiment/trends/${symbol}?timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sentiment trends');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching sentiment trends:', error);
      throw error;
    }
  }

  // Get comprehensive sentiment analysis
  async getComprehensiveSentiment(symbol) {
    try {
      const response = await fetch(`${API_BASE_URL}/sentiment/comprehensive/${symbol}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comprehensive sentiment analysis');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching comprehensive sentiment:', error);
      throw error;
    }
  }

  // Format sentiment score for display
  formatSentimentScore(score) {
    if (score >= 0.6) return { label: 'Very Positive', color: '#10b981', emoji: '🚀' };
    if (score >= 0.2) return { label: 'Positive', color: '#34d399', emoji: '📈' };
    if (score >= -0.2) return { label: 'Neutral', color: '#6b7280', emoji: '➡️' };
    if (score >= -0.6) return { label: 'Negative', color: '#f59e0b', emoji: '📉' };
    return { label: 'Very Negative', color: '#ef4444', emoji: '💥' };
  }

  // Format confidence level
  formatConfidence(confidence) {
    if (confidence >= 0.8) return { label: 'Very High', color: '#10b981' };
    if (confidence >= 0.6) return { label: 'High', color: '#34d399' };
    if (confidence >= 0.4) return { label: 'Medium', color: '#f59e0b' };
    return { label: 'Low', color: '#ef4444' };
  }

  // Calculate sentiment trend direction
  calculateTrendDirection(dataPoints) {
    if (dataPoints.length < 2) return 'neutral';
    
    const recent = dataPoints.slice(-7); // Last 7 days
    const older = dataPoints.slice(-14, -7); // Previous 7 days
    
    const recentAvg = recent.reduce((sum, point) => sum + point.sentiment, 0) / recent.length;
    const olderAvg = older.reduce((sum, point) => sum + point.sentiment, 0) / older.length;
    
    const change = recentAvg - olderAvg;
    
    if (change > 0.1) return 'improving';
    if (change < -0.1) return 'declining';
    return 'stable';
  }

  // Format analyst rating
  formatAnalystRating(rating) {
    const ratings = {
      'Buy': { color: '#10b981', emoji: '🟢' },
      'Hold': { color: '#f59e0b', emoji: '🟡' },
      'Sell': { color: '#ef4444', emoji: '🔴' }
    };
    return ratings[rating] || { color: '#6b7280', emoji: '⚪' };
  }
}

export default new AdvancedSentimentApi(); 