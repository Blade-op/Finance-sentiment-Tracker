const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user portfolio and watchlist
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      portfolio: user.portfolio,
      watchlist: user.watchlist
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Server error fetching portfolio' });
  }
});

// Add stock to portfolio
router.post('/portfolio', auth, async (req, res) => {
  try {
    const { symbol, companyName, shares, buyPrice, buyDate } = req.body;
    
    const newPosition = {
      id: Date.now().toString(),
      symbol: symbol.toUpperCase(),
      companyName,
      shares: parseFloat(shares),
      buyPrice: parseFloat(buyPrice),
      buyDate: buyDate || new Date().toISOString().split('T')[0],
      currentPrice: parseFloat(buyPrice), // Initial price same as buy price
      priceChange: 0,
      priceChangePercent: 0,
      lastUpdated: new Date().toISOString()
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { portfolio: newPosition } },
      { new: true }
    );

    res.json({
      message: 'Stock added to portfolio successfully',
      portfolio: user.portfolio
    });
  } catch (error) {
    console.error('Add to portfolio error:', error);
    res.status(500).json({ error: 'Server error adding to portfolio' });
  }
});

// Update portfolio position
router.put('/portfolio/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findById(req.user._id);
    const positionIndex = user.portfolio.findIndex(pos => pos.id === id);
    
    if (positionIndex === -1) {
      return res.status(404).json({ error: 'Position not found' });
    }

    // Update the position
    user.portfolio[positionIndex] = {
      ...user.portfolio[positionIndex],
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    await user.save();

    res.json({
      message: 'Position updated successfully',
      portfolio: user.portfolio
    });
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ error: 'Server error updating portfolio' });
  }
});

// Remove stock from portfolio
router.delete('/portfolio/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { portfolio: { id } } },
      { new: true }
    );

    res.json({
      message: 'Stock removed from portfolio successfully',
      portfolio: user.portfolio
    });
  } catch (error) {
    console.error('Remove from portfolio error:', error);
    res.status(500).json({ error: 'Server error removing from portfolio' });
  }
});

// Add stock to watchlist
router.post('/watchlist', auth, async (req, res) => {
  try {
    const { symbol, companyName } = req.body;
    
    // Check if already in watchlist
    const user = await User.findById(req.user._id);
    const existingWatchlistItem = user.watchlist.find(item => item.symbol === symbol.toUpperCase());
    
    if (existingWatchlistItem) {
      return res.status(400).json({ error: 'Stock already in watchlist' });
    }

    const newWatchlistItem = {
      id: Date.now().toString(),
      symbol: symbol.toUpperCase(),
      companyName,
      currentPrice: 0,
      priceChange: 0,
      priceChangePercent: 0,
      addedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { watchlist: newWatchlistItem } },
      { new: true }
    );

    res.json({
      message: 'Stock added to watchlist successfully',
      watchlist: updatedUser.watchlist
    });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ error: 'Server error adding to watchlist' });
  }
});

// Remove stock from watchlist
router.delete('/watchlist/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { watchlist: { id } } },
      { new: true }
    );

    res.json({
      message: 'Stock removed from watchlist successfully',
      watchlist: user.watchlist
    });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ error: 'Server error removing from watchlist' });
  }
});

// Update portfolio and watchlist prices (bulk update)
router.put('/update-prices', auth, async (req, res) => {
  try {
    const { portfolioUpdates, watchlistUpdates } = req.body;
    
    const user = await User.findById(req.user._id);
    let hasUpdates = false;

    // Update portfolio prices
    if (portfolioUpdates && Array.isArray(portfolioUpdates)) {
      portfolioUpdates.forEach(update => {
        const position = user.portfolio.find(pos => pos.symbol === update.symbol);
        if (position) {
          position.currentPrice = update.currentPrice;
          position.priceChange = update.priceChange;
          position.priceChangePercent = update.priceChangePercent;
          position.lastUpdated = new Date().toISOString();
          hasUpdates = true;
        }
      });
    }

    // Update watchlist prices
    if (watchlistUpdates && Array.isArray(watchlistUpdates)) {
      watchlistUpdates.forEach(update => {
        const item = user.watchlist.find(watch => watch.symbol === update.symbol);
        if (item) {
          item.currentPrice = update.currentPrice;
          item.priceChange = update.priceChange;
          item.priceChangePercent = update.priceChangePercent;
          item.lastUpdated = new Date().toISOString();
          hasUpdates = true;
        }
      });
    }

    if (hasUpdates) {
      await user.save();
    }

    res.json({
      message: 'Prices updated successfully',
      portfolio: user.portfolio,
      watchlist: user.watchlist
    });
  } catch (error) {
    console.error('Update prices error:', error);
    res.status(500).json({ error: 'Server error updating prices' });
  }
});

module.exports = router; 