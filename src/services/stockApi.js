import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class StockApiService {
  static async getStockNews(symbol) {
    try {
      const response = await axios.get(`${API_BASE_URL}/news/${symbol}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stock news:', error);
      if (error.response?.status === 404) {
        throw new Error(error.response.data.error || `Stock symbol "${symbol}" not found`);
      }
      throw new Error('Failed to fetch stock data. Please try again later.');
    }
  }
  
  static async searchStocks(query) {
    try {
      const response = await axios.get(`${API_BASE_URL}/search/${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching stocks:', error);
      throw new Error('Failed to search stocks. Please try again.');
    }
  }
  
  static async getStockQuote(symbol) {
    try {
      const response = await axios.get(`${API_BASE_URL}/quote/${symbol}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stock quote:', error);
      if (error.response?.status === 404) {
        throw new Error(error.response.data.error || `Stock symbol "${symbol}" not found`);
      }
      throw new Error('Failed to fetch stock quote. Please try again.');
    }
  }
  
  static async checkServerHealth() {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Server health check failed:', error);
      return null;
    }
  }
}

export default StockApiService;