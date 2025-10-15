#!/bin/bash

echo "🚀 Stock Sentiment Analyzer Deployment Script"
echo "=============================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Prerequisites checked"

# Build frontend
echo "📦 Building frontend..."
cd project
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend built successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Deploy backend to Railway
echo "🚀 Deploying backend to Railway..."
cd backend

# Check if Railway project exists
if [ ! -f "railway.json" ]; then
    echo "📝 Initializing Railway project..."
    railway init
fi

echo "🔧 Setting up environment variables..."
echo "Please enter your environment variables:"

read -p "MongoDB URI: " MONGODB_URI
read -p "JWT Secret: " JWT_SECRET
read -p "News API Key: " NEWS_API_KEY
read -p "OpenAI API Key: " OPENAI_API_KEY
read -p "Twitter Bearer Token (optional): " TWITTER_BEARER_TOKEN

# Set environment variables
railway variables set MONGODB_URI="$MONGODB_URI"
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set NEWS_API_KEY="$NEWS_API_KEY"
railway variables set OPENAI_API_KEY="$OPENAI_API_KEY"
railway variables set NODE_ENV="production"

if [ ! -z "$TWITTER_BEARER_TOKEN" ]; then
    railway variables set TWITTER_BEARER_TOKEN="$TWITTER_BEARER_TOKEN"
fi

echo "🚀 Deploying to Railway..."
railway up

# Get backend URL
BACKEND_URL=$(railway domain)
echo "✅ Backend deployed to: $BACKEND_URL"

# Deploy frontend to Vercel
echo "🌐 Deploying frontend to Vercel..."
cd ..

# Create .env.local with backend URL
echo "VITE_API_URL=$BACKEND_URL" > .env.local

# Deploy to Vercel
vercel --prod

echo "🎉 Deployment complete!"
echo "Backend: $BACKEND_URL"
echo "Frontend: Check Vercel dashboard for URL"
echo ""
echo "📋 Next steps:"
echo "1. Update CORS origins in backend/server.js with your Vercel domain"
echo "2. Test your deployment"
echo "3. Set up custom domain if needed" 