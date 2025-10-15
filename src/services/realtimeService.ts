interface StockUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
}

interface RealtimeCallback {
  (update: StockUpdate): void;
}

class RealtimeService {
  private connections: Map<string, RealtimeCallback[]> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private basePrices: Map<string, number> = new Map();

  // Connect to real-time updates for a stock
  connect(symbol: string, callback: RealtimeCallback): () => void {
    const upperSymbol = symbol.toUpperCase();
    
    if (!this.connections.has(upperSymbol)) {
      this.connections.set(upperSymbol, []);
    }
    
    this.connections.get(upperSymbol)!.push(callback);
    
    // Start real-time updates if this is the first connection
    if (this.connections.get(upperSymbol)!.length === 1) {
      this.startUpdates(upperSymbol);
    }
    
    // Return disconnect function
    return () => this.disconnect(upperSymbol, callback);
  }

  // Disconnect from real-time updates
  private disconnect(symbol: string, callback: RealtimeCallback): void {
    const callbacks = this.connections.get(symbol);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      
      // Stop updates if no more connections
      if (callbacks.length === 0) {
        this.stopUpdates(symbol);
        this.connections.delete(symbol);
      }
    }
  }

  // Start real-time updates for a symbol
  private startUpdates(symbol: string): void {
    // Simulate initial price (you can replace this with real API call)
    const initialPrice = this.getInitialPrice(symbol);
    this.basePrices.set(symbol, initialPrice);
    
    const interval = setInterval(() => {
      this.generateUpdate(symbol);
    }, 2000); // Update every 2 seconds
    
    this.intervals.set(symbol, interval);
  }

  // Stop real-time updates for a symbol
  private stopUpdates(symbol: string): void {
    const interval = this.intervals.get(symbol);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(symbol);
    }
    this.basePrices.delete(symbol);
  }

  // Generate a simulated price update
  private generateUpdate(symbol: string): void {
    const basePrice = this.basePrices.get(symbol) || 100;
    const callbacks = this.connections.get(symbol);
    
    if (!callbacks || callbacks.length === 0) return;
    
    // Simulate price movement with random walk
    const volatility = 0.02; // 2% volatility
    const randomChange = (Math.random() - 0.5) * volatility;
    const newPrice = basePrice * (1 + randomChange);
    
    // Update base price
    this.basePrices.set(symbol, newPrice);
    
    // Calculate change
    const change = newPrice - basePrice;
    const changePercent = (change / basePrice) * 100;
    
    // Simulate volume
    const volume = Math.floor(Math.random() * 1000000) + 100000;
    
    const update: StockUpdate = {
      symbol,
      price: parseFloat(newPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume,
      timestamp: new Date()
    };
    
    // Notify all callbacks
    callbacks.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in real-time callback:', error);
      }
    });
  }

  // Get initial price for a symbol (simulated)
  private getInitialPrice(symbol: string): number {
    // Simulate different price ranges for different stocks
    const priceRanges: { [key: string]: [number, number] } = {
      'AAPL': [150, 200],
      'MSFT': [300, 400],
      'GOOGL': [2500, 3000],
      'TSLA': [200, 300],
      'AMZN': [3000, 4000],
      'META': [200, 300],
      'NVDA': [400, 600],
      'NFLX': [400, 600],
      'SPY': [400, 500],
      'QQQ': [300, 400]
    };
    
    const range = priceRanges[symbol] || [50, 150];
    return range[0] + Math.random() * (range[1] - range[0]);
  }

  // Get current connections count
  getConnectionCount(symbol: string): number {
    return this.connections.get(symbol.toUpperCase())?.length || 0;
  }

  // Get all active symbols
  getActiveSymbols(): string[] {
    return Array.from(this.connections.keys());
  }

  // Disconnect all connections
  disconnectAll(): void {
    this.connections.forEach((_, symbol) => {
      this.stopUpdates(symbol);
    });
    this.connections.clear();
    this.intervals.clear();
    this.basePrices.clear();
  }
}

// Export singleton instance
export default new RealtimeService();
export type { StockUpdate, RealtimeCallback }; 