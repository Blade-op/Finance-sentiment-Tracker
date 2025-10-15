import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SentimentTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No trend data available</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map(point => {
      const date = new Date(point.date);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }),
    datasets: [
      {
        label: 'Sentiment Score',
        data: data.map(point => point.sentiment * 100), // Convert to percentage
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'News Volume',
        data: data.map(point => point.newsCount),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 1,
        fill: false,
        tension: 0.4,
        yAxisID: 'y1',
        pointRadius: 2,
        pointHoverRadius: 4
      },
      {
        label: 'Social Mentions',
        data: data.map(point => point.socialMentions / 10), // Scale down for visibility
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 1,
        fill: false,
        tension: 0.4,
        yAxisID: 'y1',
        pointRadius: 2,
        pointHoverRadius: 4
      }
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
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (label === 'Sentiment Score') {
              return `${label}: ${value.toFixed(1)}%`;
            } else if (label === 'News Volume') {
              return `${label}: ${value} articles`;
            } else if (label === 'Social Mentions') {
              return `${label}: ${(value * 10).toFixed(0)} mentions`;
            }
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Sentiment Score (%)',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        min: -100,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Volume',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return value.toFixed(0);
          }
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  };

  return (
    <div className="sentiment-trend-chart">
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color sentiment"></div>
          <span>Sentiment Score (-100% to +100%)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color news"></div>
          <span>News Volume (articles per day)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color social"></div>
          <span>Social Mentions (scaled)</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentTrendChart; 