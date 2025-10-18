const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3005;
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error('MONGODB_URL is not defined in .env file');
  process.exit(1);
}

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004'],
  credentials: true
}));
app.use(express.json());

// Import models to ensure they are registered
require('./models/Badge');
require('./models/User');
require('./models/Challenge');
require('./models/Submission');
require('./models/TestCase');
require('./models/TestCaseResult');
require('./models/Contest');
require('./models/Announcement');
require('./models/ContestParticipation');

// Import routes
const userRoutes = require('./routes/User');
const challengeRoutes = require('./routes/Challenge');
const submissionRoutes = require('./routes/Submission');
const testCaseRoutes = require('./routes/TestCase');
const announcementRoutes = require('./routes/Announcement');
const contestRoutes = require('./routes/Contest');
const leaderboardRoutes = require('./routes/Leaderboard');
const badgeRoutes = require('./routes/Badge');
const contestParticipationRoutes = require('./routes/ContestParticipation');

console.log('Mounting routes...');
app.use('/api/users', userRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/testcases', testCaseRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/contest-participation', contestParticipationRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Test Judge0 integration (no auth required)
app.post('/api/test-judge0', async (req, res) => {
  try {
    const { code, language, input } = req.body;
    const codeExecutor = require('./services/codeExecutor');
    console.log('Testing Judge0 with:', { code, language, input });
    const result = await codeExecutor.executeCode(code || 'console.log("Hello World");', language || 'javascript', input || '');
    console.log('Judge0 result:', result);
    res.json(result);
  } catch (error) {
    console.error('Judge0 test error:', error);
    res.status(500).json({ error: error.message });
  }
});

mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the server at: http://localhost:${PORT}/api/test`);
});
