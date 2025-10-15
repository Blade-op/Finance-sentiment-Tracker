import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class AdvancedStockApiService {
  // Get enhanced stock data with all market information
  static async getEnhancedStockData(symbol) {
    try {
      const response = await axios.get(`${API_BASE_URL}/stock/${symbol}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching enhanced stock data:', error);
      throw error;
    }
  }

  // Get historical data with technical indicators
  static async getHistoricalData(symbol, range = '1mo', interval = '1d') {
    try {
      const response = await axios.get(`${API_BASE_URL}/historical/${symbol}`, {
        params: { range, interval }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  // Get technical indicators only
  static async getTechnicalIndicators(symbol, range = '1mo') {
    try {
      const response = await axios.get(`${API_BASE_URL}/indicators/${symbol}`, {
        params: { range }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching technical indicators:', error);
      throw error;
    }
  }

  // Get market summary data
  static async getMarketSummary(symbol) {
    try {
      const [stockData, indicators] = await Promise.all([
        this.getEnhancedStockData(symbol),
        this.getTechnicalIndicators(symbol)
      ]);

      return {
        ...stockData,
        technicalAnalysis: indicators.indicators
      };
    } catch (error) {
      console.error('Error fetching market summary:', error);
      throw error;
    }
  }

  // Format price data for charts
  static formatChartData(historicalData) {
    if (!historicalData || !historicalData.data) {
      console.log('No historical data available:', historicalData);
      return null;
    }

    console.log('Formatting historical data:', historicalData);

    return {
      prices: historicalData.data.map(d => ({
        date: d.date,
        price: d.price,
        volume: d.volume
      })),
      indicators: {
        sma20: historicalData.data
          .filter(d => d.sma20 !== null && d.sma20 !== undefined)
          .map(d => ({
            date: d.date,
            value: d.sma20
          })),
        sma50: historicalData.data
          .filter(d => d.sma50 !== null && d.sma50 !== undefined)
          .map(d => ({
            date: d.date,
            value: d.sma50
          })),
        rsi: historicalData.data
          .filter(d => d.rsi !== null && d.rsi !== undefined)
          .map(d => ({
            date: d.date,
            value: d.rsi
          })),
        macd: historicalData.data
          .filter(d => d.macd !== null && d.macd !== undefined)
          .map(d => ({
            date: d.date,
            macd: d.macd,
            signal: d.signal,
            histogram: d.histogram
          }))
      }
    };
  }

  // Calculate price statistics
  static calculatePriceStats(data) {
    if (!data || !data.length) return null;

    const prices = data.map(d => d.price);
    const volumes = data.map(d => d.volume);

    return {
      currentPrice: prices[prices.length - 1],
      priceChange: prices[prices.length - 1] - prices[0],
      priceChangePercent: ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100,
      high: Math.max(...prices),
      low: Math.min(...prices),
      averageVolume: volumes.reduce((a, b) => a + b, 0) / volumes.length,
      totalVolume: volumes.reduce((a, b) => a + b, 0)
    };
  }
}

export default AdvancedStockApiService; 