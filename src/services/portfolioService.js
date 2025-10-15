const API_BASE_URL = 'http://localhost:5000/api';

class PortfolioService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  // Get auth headers
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  // Get user portfolio and watchlist
  async getPortfolioData() {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      throw error;
    }
  }

  // Add stock to portfolio
  async addToPortfolio(portfolioData) {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/portfolio`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(portfolioData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add to portfolio');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding to portfolio:', error);
      throw error;
    }
  }

  // Remove stock from portfolio
  async removeFromPortfolio(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/portfolio/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove from portfolio');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error removing from portfolio:', error);
      throw error;
    }
  }

  // Update portfolio position
  async updatePortfolioPosition(id, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/portfolio/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update portfolio position');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating portfolio position:', error);
      throw error;
    }
  }

  // Add stock to watchlist
  async addToWatchlist(watchlistData) {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/watchlist`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(watchlistData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add to watchlist');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  }

  // Remove stock from watchlist
  async removeFromWatchlist(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/watchlist/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove from watchlist');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  }

  // Update portfolio and watchlist prices
  async updatePrices(portfolioUpdates, watchlistUpdates) {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/update-prices`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          portfolioUpdates,
          watchlistUpdates
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update prices');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating prices:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Update token (called when user logs in/out)
  updateToken() {
    this.token = localStorage.getItem('authToken');
  }
}

export default new PortfolioService(); 