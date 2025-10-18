# HackerRank Platform - Setup & Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- Git

### Installation

#### 1. Backend Setup
```bash
cd backend
npm install
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
```

---

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
# MongoDB Connection
MONGODB_URL=mongodb+srv://arshamnikhil_db_user:8kfqOkBKABaqDtqc@cluster0.l4kpkw4.mongodb.net/?retryWrites=true&w=majority

# Server Port
PORT=3001

# JWT Secret (Change in Production!)
JWT_SECRET=your_jwt_secret_key_change_this_in_production

# Judge0 Configuration (Optional - uses simulation if not provided)
JUDGE0_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=
```

### Frontend Environment Variables (.env)
```env
# API URL
REACT_APP_API_URL=http://localhost:3001/api
```

---

## 📊 Port Configuration

| Service | Port | URL | Notes |
|---------|------|-----|-------|
| Frontend (React) | 3000 | http://localhost:3000 | Development server |
| Backend (Express) | 3001 | http://localhost:3001 | API server |
| MongoDB | - | Cloud (Atlas) | Remote database |

### Changing Ports

**Backend Port**: Edit `backend/.env`
```env
PORT=3001  # Change this to your desired port
```

**Frontend Port**: Start with custom port
```bash
REACT_APP_PORT=3000 npm start
```

---

## ▶️ Running the Application

### Terminal 1 - Backend Server
```bash
cd backend
npm install  # First time only
node server.js
# or with nodemon for auto-reload
npx nodemon server.js
```

Expected output:
```
Connected to MongoDB
Mounting routes...
Server is running on port 3001
Test the server at: http://localhost:3001/api/test
```

### Terminal 2 - Frontend Server
```bash
cd frontend
npm install  # First time only
npm start
```

Expected output:
```
Compiled successfully!
On Your Network: http://localhost:3000
```

---

## ✅ Testing the Setup

### 1. Test Backend Connection
```bash
curl http://localhost:3001/api/test
```

Expected response:
```json
{ "message": "Server is working" }
```

### 2. Test MongoDB Connection
```bash
curl http://localhost:3001/api/challenges
```

Response depends on authentication. If you get an error about authorization, the backend is working correctly.

### 3. Access Frontend
Open browser and go to: `http://localhost:3000`

---

## 🔑 Authentication

### User Roles
- **User**: Can solve problems, participate in contests
- **Admin**: Can create problems, create contests, manage platform

### How Authentication Works
1. User signs up or logs in
2. Backend generates JWT token
3. Token stored in localStorage as `token`
4. Token sent with every API request in Authorization header
5. Backend validates token and extracts user info

---

## 📚 API Endpoints

### Challenges
```
GET    /api/challenges              # Get all challenges
GET    /api/challenges/:id          # Get challenge details
POST   /api/challenges              # Create challenge (admin only)
PUT    /api/challenges/:id          # Update challenge (admin only)
DELETE /api/challenges/:id          # Delete challenge (admin only)
```

### Submissions
```
POST   /api/submissions             # Submit solution
POST   /api/submissions/run         # Run code against visible test cases
```

### Contests
```
GET    /api/contests                # Get all contests
GET    /api/contests/:id            # Get contest details
POST   /api/contests                # Create contest (admin only)
PUT    /api/contests/:id            # Update contest (admin only)
DELETE /api/contests/:id            # Delete contest (admin only)
GET    /api/contests/:id/leaderboard # Get contest leaderboard
```

### Users
```
POST   /api/users/signup            # Register new user
POST   /api/users/login             # Login user
GET    /api/users/profile           # Get user profile
GET    /api/users/:id/profile       # Get other user profile
```

### Test Cases
```
GET    /api/testcases               # Get all test cases
POST   /api/testcases               # Create test case (admin only)
DELETE /api/testcases/:id           # Delete test case (admin only)
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "PORT is not defined"
**Problem**: Backend won't start, says PORT is not defined
**Solution**: Check `.env` file has `PORT=3001` (no spaces)

### Issue 2: "Cannot GET /api/challenges"
**Problem**: 401 Unauthorized error on challenges endpoint
**Solution**: This is expected now! Routes don't require auth for GET requests. Try logging in first.

### Issue 3: "MONGODB_URL is not defined"
**Problem**: Server crashes on startup with MongoDB error
**Solution**: 
1. Check `.env` file has MONGODB_URL
2. Verify MongoDB Atlas connection string is correct
3. Check whitelist IP in MongoDB Atlas

### Issue 4: Frontend can't reach backend
**Problem**: API calls failing with CORS error
**Solution**:
1. Verify backend is running on port 3001
2. Check frontend `.env` has correct API URL
3. Verify CORS settings in `backend/server.js` allow localhost:3000

### Issue 5: Submission status always "accepted"
**Problem**: All submissions marked as accepted regardless of correctness
**Solution**: This has been fixed! Status now properly reflects test results.

---

## 🎮 Testing Gamification Features

### Admin Functions
1. Go to http://localhost:3000/admin
2. Create a new challenge with test cases
3. Create a contest

### User Functions
1. Sign up as regular user
2. Go to Problems section
3. Solve a challenge
4. Check dashboard for rating changes and achievements

---

## 🌐 Deployment

### Backend Deployment (Heroku)
```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URL=your_url
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy to Vercel
vercel --prod

# Or Netlify
netlify deploy --prod --dir=build
```

---

## 📝 Important Notes

1. **JWT_SECRET**: Change this in production! Use a strong random string
2. **CORS**: Update allowed origins in `server.js` for production
3. **Database**: Use MongoDB Atlas for production
4. **Judge0 API**: Optional - platform works with simulation when API key not provided

---

## 📞 Support

For issues:
1. Check the API response in browser console (F12)
2. Check backend console for server logs
3. Verify all environment variables are set
4. Check MongoDB connection string
