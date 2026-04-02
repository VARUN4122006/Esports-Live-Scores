import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
// const PORT = process.env.PORT || 5000;

//  Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
let isconnected = false;

async function connectToMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    isconnected = true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

app.use((req, res, next) => {
  if (isconnected) {
    connectToMongo();
  }
  next();
})

// API Key middleware (for specific routes if needed)
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid API Key' });
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Backend is running',
    mongodb: 'Connected',
    timestamp: new Date().toISOString()
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Existing routes (with API key validation)
app.get('/api/live-scores', validateApiKey, (req, res) => {
  res.json({
    scores: [
      { game: 'CS2', status: 'Live', score: '2-1' },
      { game: 'Valorant', status: 'Live', score: '13-11' },
      { game: 'Dota 2', status: 'Ongoing', score: '45:30' }
    ]
  });
});

app.post('/api/player-data', validateApiKey, (req, res) => {
  res.json({ message: 'Player data received' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

// app.listen(PORT, () => {
//   console.log(`🚀 Backend server running on http://localhost:${PORT}`);
//   console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL}`);
//   console.log(`📝 Environment: ${process.env.NODE_ENV}`);
// });

module.exports = app
