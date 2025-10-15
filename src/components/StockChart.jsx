import React, { useRef, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

// Register zoom plugin separately
ChartJS.register(zoomPlugin);

const StockChart = ({ data, timeframe, showVolume = true, showIndicators = true }) => {
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState('line');
  const [showVolumeState, setShowVolumeState] = useState(showVolume);
  const [showIndicatorsState, setShowIndicatorsState] = useState(showIndicators);

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  if (!data || !data.prices || data.prices.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-placeholder">
          <p>No chart data available</p>
        </div>
      </div>
    );
  }

  // Prepare price data
  const priceData = data.prices.map(item => ({
    x: new Date(item.date),
    y: item.price
  }));

  // Prepare volume data
  const volumeData = data.prices.map(item => ({
    x: new Date(item.date),
    y: item.volume
  }));

  // Prepare SMA data
  const sma20Data = data.indicators?.sma20?.map(item => ({
    x: new Date(item.date),
    y: item.value
  })) || [];

  const sma50Data = data.indicators?.sma50?.map(item => ({
    x: new Date(item.date),
    y: item.value
  })) || [];

  // Chart configuration
  const chartData = {
    datasets: [
      {
        label: 'Price',
        data: priceData,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#667eea',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        yAxisID: 'y'
      },
      ...(showIndicatorsState && sma20Data.length > 0 ? [{
        label: 'SMA 20',
        data: sma20Data,
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 4,
        yAxisID: 'y'
      }] : []),
      ...(showIndicatorsState && sma50Data.length > 0 ? [{
        label: 'SMA 50',
        data: sma50Data,
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 4,
        yAxisID: 'y'
      }] : []),
      ...(showVolumeState ? [{
        label: 'Volume',
        data: volumeData,
        backgroundColor: 'rgba(156, 163, 175, 0.3)',
        borderColor: 'rgba(156, 163, 175, 0.5)',
        borderWidth: 1,
        type: 'bar',
        yAxisID: 'y1'
      }] : [])
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
         plugins: {
       zoom: {
         zoom: {
           wheel: {
             enabled: true,
           },
           pinch: {
             enabled: true
           },
           mode: 'xy',
         },
         pan: {
           enabled: true,
           mode: 'xy',
         }
       },
       legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            size: 12,
            weight: '600'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context) {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          },
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (label === 'Volume') {
              return `${label}: ${value.toLocaleString()}`;
            } else {
              return `${label}: $${value.toFixed(2)}`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeframe === '1D' ? 'hour' : 
                timeframe === '1W' ? 'day' : 
                timeframe === '1M' ? 'day' : 
                timeframe === '3M' ? 'week' : 
                timeframe === '1Y' ? 'month' : 'month',
          displayFormats: {
            hour: 'HH:mm',
            day: 'MMM dd',
            week: 'MMM dd',
            month: 'MMM yyyy'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11
          },
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
             },
       y1: {
         type: 'linear',
         display: showVolumeState,
         position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            size: 10
          },
          callback: function(value) {
            if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
            if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
            if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
            return value.toFixed(0);
          }
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 6,
        hoverBorderWidth: 2
      }
    }
  };

     return (
     <div className="stock-chart-container">
       <div className="chart-controls">
         <div className="chart-type-selector">
           <button
             className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
             onClick={() => setChartType('line')}
           >
             Line Chart
           </button>
           <button
             className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
             onClick={() => setChartType('bar')}
           >
             Bar Chart
           </button>
         </div>
         
         <div className="chart-options">
           <button
             className={`chart-option-btn ${showIndicatorsState ? 'active' : ''}`}
             onClick={() => setShowIndicatorsState(!showIndicatorsState)}
           >
             Indicators
           </button>
           <button
             className={`chart-option-btn ${showVolumeState ? 'active' : ''}`}
             onClick={() => setShowVolumeState(!showVolumeState)}
           >
             Volume
           </button>
           <button
             className="chart-option-btn reset-btn"
             onClick={resetZoom}
             title="Reset Zoom"
           >
             Reset
           </button>
         </div>
         
         <div className="chart-legend">
           <span className="legend-item">
             <span className="legend-color" style={{ backgroundColor: '#667eea' }}></span>
             Price
           </span>
           {showIndicatorsState && sma20Data.length > 0 && (
             <span className="legend-item">
               <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
               SMA 20
             </span>
           )}
           {showIndicatorsState && sma50Data.length > 0 && (
             <span className="legend-item">
               <span className="legend-color" style={{ backgroundColor: '#f59e0b' }}></span>
               SMA 50
             </span>
           )}
           {showVolumeState && (
             <span className="legend-item">
               <span className="legend-color" style={{ backgroundColor: 'rgba(156, 163, 175, 0.5)' }}></span>
               Volume
             </span>
           )}
         </div>
       </div>
      
      <div className="chart-wrapper">
        {chartType === 'line' ? (
          <Line ref={chartRef} data={chartData} options={options} />
        ) : (
          <Bar ref={chartRef} data={chartData} options={options} />
        )}
      </div>
      
                    <div className="chart-info">
         <div className="chart-stats">
           <p>Timeframe: {timeframe} • Data Points: {priceData.length}</p>
           <p>Last Updated: {new Date().toLocaleTimeString()}</p>
         </div>
         <div className="chart-instructions">
           <p>💡 Use mouse wheel to zoom • Drag to pan • Double-click to reset</p>
         </div>
       </div>
    </div>
  );
};

export default StockChart; 