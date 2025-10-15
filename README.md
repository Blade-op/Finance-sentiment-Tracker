# 📊 Stock Sentiment Analyzer

A full-stack web application that analyzes stock market sentiment through AI-powered news analysis. Users can search for any stock symbol and get real-time sentiment analysis based on recent news articles.

## 🚀 Features

- **Real-time Stock Search**: Search any stock symbol (AAPL, GOOGL, TSLA, etc.)
- **AI-Powered Sentiment Analysis**: Each news article is analyzed for sentiment (-1 to +1 scale)
- **Beautiful Visual Interface**: Modern, responsive design with color-coded sentiment indicators
- **News Article Cards**: Clean, organized display of recent news with sentiment scores
- **Average Sentiment Dashboard**: Overall market sentiment visualization
- **Mobile Responsive**: Optimized for all device sizes

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **TypeScript** - Type-safe development
- **CSS3** - Custom styling with gradients and animations
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (optional)
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
stock-sentiment-analyzer/
├── backend/                 # Node.js Express backend
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables
├── src/                    # React frontend
│   ├── components/         # React components
│   │   ├── SearchBar.jsx   # Stock search component
│   │   ├── SentimentDisplay.jsx # Sentiment overview
│   │   ├── NewsCard.jsx    # Individual news article
│   │   ├── LoadingSpinner.jsx # Loading animation
│   │   └── ErrorMessage.jsx # Error handling
│   ├── services/          # API services
│   │   └── stockApi.js    # Backend communication
│   ├── styles/            # CSS stylesheets
│   │   ├── App.css        # Main app styles
│   │   ├── SearchBar.css  # Search component styles
│   │   ├── SentimentDisplay.css # Sentiment styles
│   │   ├── NewsCard.css   # News card styles
│   │   ├── LoadingSpinner.css # Loading styles
│   │   └── ErrorMessage.css # Error styles
│   └── App.tsx            # Main app component
└── README.md              # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stock-sentiment-analyzer
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Environment Setup**
   ```bash
   # Create backend/.env file with:
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string (optional)
   OPENAI_API_KEY=your_openai_api_key (optional)
   ```

5. **Start the application**
   ```bash
   # Option 1: Start both frontend and backend together
   npm run start:both
   
   # Option 2: Start separately
   # Terminal 1 - Backend
   npm run start:backend
   
   # Terminal 2 - Frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔧 Configuration

### News API Integration
Replace the mock data in `backend/server.js` with a real news API:

```javascript
// Example with NewsAPI.org
const newsResponse = await fetch(
  `https://newsapi.org/v2/everything?q=${stockSymbol}&apiKey=${process.env.NEWS_API_KEY}`
);
```

### OpenAI Integration
Replace the dummy sentiment analysis function with OpenAI API:

```javascript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const analyzeSentiment = async (text) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "user",
      content: `Analyze the sentiment of this text and return only a number between -1 and 1: "${text}"`
    }]
  });
  
  return parseFloat(response.choices[0].message.content);
};
```

### MongoDB Setup
The application works without MongoDB, but you can connect it for logging searches:

1. Create a MongoDB database
2. Add connection string to `backend/.env`
3. The app will automatically start logging search results

## 📱 Usage

1. **Search for a Stock**: Enter any stock symbol (e.g., AAPL, GOOGL, TSLA)
2. **View Sentiment**: See the overall sentiment score and color-coded indicator
3. **Browse News**: Read recent news articles with individual sentiment scores
4. **Mobile Experience**: Use on any device with responsive design

## 🎨 Design Features

- **Glass-morphism effects** with backdrop blur
- **Color-coded sentiment system**:
  - 🟢 Green: Positive sentiment (> 0.1)
  - 🔴 Red: Negative sentiment (< -0.1)
  - 🟡 Yellow: Neutral sentiment (-0.1 to 0.1)
- **Smooth animations** and hover effects
- **Professional typography** and spacing
- **Responsive grid layouts**

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Deploy with your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you have any questions or issues:
1. Check the README.md
2. Look at existing GitHub issues
3. Create a new issue with detailed description

---

Built with ❤️ using React, Node.js, and modern web technologies.