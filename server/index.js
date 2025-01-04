const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { MarketCapTracker } = require('./marketCapTracker');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configure CORS for both REST and WebSocket
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Initialize market cap tracker
const tracker = new MarketCapTracker(io);

// Add this after the tracker initialization
function getMarketCapTracker() {
  return tracker;
}

// REST endpoint for initial data
app.get('/api/marketcap', (req, res) => {
  const marketCap = tracker.tokenData?.marketCap > 0 
    ? tracker.tokenData.marketCap 
    : tracker.tokenData.lastValidMarketCap;
  
  console.log('Sending initial market cap:', marketCap);
  res.json({ marketCap: marketCap || 0 });
});

// REST endpoint for highest market cap
app.get('/api/highest-marketcap', (req, res) => {
  res.json({ 
    marketCap: tracker.highestMarketCap || 0 
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected, ID:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected, ID:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 