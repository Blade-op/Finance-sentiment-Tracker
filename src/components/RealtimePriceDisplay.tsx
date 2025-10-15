import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import realtimeService, { StockUpdate } from '../services/realtimeService';
import '../styles/RealtimePriceDisplay.css';

interface RealtimePriceDisplayProps {
  symbol: string;
  initialPrice?: number;
  className?: string;
}

const RealtimePriceDisplay: React.FC<RealtimePriceDisplayProps> = ({ 
  symbol, 
  initialPrice,
  className = '' 
}) => {
  const [currentUpdate, setCurrentUpdate] = useState<StockUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [priceAnimation, setPriceAnimation] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    let disconnect: (() => void) | null = null;

    const handleUpdate = (update: StockUpdate) => {
      setCurrentUpdate(update);
      
      // Determine price animation
      if (currentUpdate) {
        if (update.price > currentUpdate.price) {
          setPriceAnimation('up');
        } else if (update.price < currentUpdate.price) {
          setPriceAnimation('down');
        }
        
        // Clear animation after 1 second
        setTimeout(() => setPriceAnimation(null), 1000);
      }
    };

    // Connect to real-time updates
    disconnect = realtimeService.connect(symbol, handleUpdate);
    setIsConnected(true);

    // Cleanup on unmount
    return () => {
      if (disconnect) {
        disconnect();
        setIsConnected(false);
      }
    };
  }, [symbol, currentUpdate]);

  const displayPrice = currentUpdate?.price || initialPrice || 0;
  const displayChange = currentUpdate?.change || 0;
  const displayChangePercent = currentUpdate?.changePercent || 0;
  const isPositive = displayChange >= 0;

  return (
    <div className={`realtime-price-display ${className}`}>
      <div className="price-header">
        <span className="symbol">{symbol}</span>
        <div className="connection-status">
          <Activity 
            size={12} 
            className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`} 
          />
          <span className="status-text">
            {isConnected ? 'Live' : 'Connecting...'}
          </span>
        </div>
      </div>
      
      <div className={`price-value ${priceAnimation || ''}`}>
        ${displayPrice.toFixed(2)}
      </div>
      
      <div className="price-change">
        <div className={`change-indicator ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
          <span className="change-value">
            {isPositive ? '+' : ''}{displayChange.toFixed(2)}
          </span>
          <span className="change-percent">
            ({isPositive ? '+' : ''}{displayChangePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
      
      {currentUpdate && (
        <div className="update-info">
          <span className="volume">
            Vol: {(currentUpdate.volume / 1000).toFixed(0)}K
          </span>
          <span className="timestamp">
            {currentUpdate.timestamp.toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default RealtimePriceDisplay; 