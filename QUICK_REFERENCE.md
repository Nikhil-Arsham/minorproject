# ⚡ Quick Reference Guide

## 🚀 Quick Start (5 minutes)

### Terminal 1: Start Backend
```bash
cd backend
node server.js
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm start
```

### Access Application
```
Frontend: http://localhost:3000
Backend API: http://localhost:3001/api
Test API: http://localhost:3001/api/test
```

---

## 🔧 Environment Files

### Backend `.env`
```env
MONGODB_URL=mongodb+srv://arshamnikhil_db_user:8kfqOkBKABaqDtqc@cluster0.l4kpkw4.mongodb.net/?retryWrites=true&w=majority
PORT=3001
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JUDGE0_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:3001/api
```

---

## 📝 Common Tasks

### Create a Challenge (Admin Only)
1. Login with admin account
2. Go to `/admin/create-problem`
3. Fill in:
   - Title, Description, Difficulty
   - Topics, Points
   - Input/Output format
   - Example test cases
4. Submit

### Submit Code Solution
1. Go to Problems page
2. Click problem
3. Write code in editor
4. Select language
5. Click "Run Code" to test
6. Click "Submit" for grading

### Create Contest (Admin Only)
1. Go to `/admin/create-contest`
2. Fill in:
   - Name, Description
   - Start Time, End Time
   - Add Problems
3. Submit

### Join Contest (User)
1. Go to Contests page
2. Click active contest
3. Solve problems
4. Check leaderboard

---

## 🔗 API Endpoints Quick Reference

### Authentication
```
POST   /api/users/signup          # Register
POST   /api/users/login           # Login
POST   /api/users/logout          # Logout
```

### Challenges
```
GET    /api/challenges            # List all
GET    /api/challenges/:id        # Get one
POST   /api/challenges            # Create (admin)
PUT    /api/challenges/:id        # Update (admin)
DELETE /api/challenges/:id        # Delete (admin)
```

### Submissions
```
POST   /api/submissions           # Submit code
POST   /api/submissions/run       # Run tests only
```

### Contests
```
GET    /api/contests              # List all
GET    /api/contests/:id          # Get one
POST   /api/contests              # Create (admin)
PUT    /api/contests/:id          # Update (admin)
DELETE /api/contests/:id          # Delete (admin)
GET    /api/contests/:id/leaderboard
```

### Users
```
GET    /api/users/profile         # My profile
GET    /api/users/:id/profile     # Other profile
```

### Leaderboard
```
GET    /api/leaderboard           # Global leaderboard
```

---

## 🐛 Troubleshooting

### Backend Won't Start
```
Error: PORT is not defined
Solution: Check .env file has PORT=3001 (no spaces)
```

### Frontend Can't Connect to Backend
```
Error: CORS error or API unreachable
Solution: 
1. Verify backend running on port 3001
2. Check frontend .env has correct API_URL
3. Restart both servers
```

### MongoDB Connection Failed
```
Error: Cannot connect to MongoDB
Solution:
1. Check MONGODB_URL in .env
2. Verify MongoDB Atlas whitelist includes your IP
3. Check internet connection
```

### Code Submission Fails
```
Error: Submission error
Solution:
1. Check code is valid for selected language
2. Verify challenge has test cases
3. Check browser console for details
```

### Template Literal Errors (Frontend)
```
✅ Already Fixed in this version!
Lines 40 and 67 in ProblemDetails.js corrected
```

---

## 📊 Database Models Quick Reference

### User
```javascript
{
  username, email, password,
  role: "user" | "admin",
  profile: {
    name, bio, avatar, rating, rank
  },
  stats: {
    totalSolved, easySolved, mediumSolved, hardSolved,
    currentStreak, maxStreak, lastSolvedDate,
    topicProgress: Map
  },
  badges: [],
  solvedProblems: []
}
```

### Challenge
```javascript
{
  title, description,
  difficulty: "Easy" | "Medium" | "Hard",
  topics: [],
  inputFormat, outputFormat, constraints,
  points, examples: []
}
```

### Contest
```javascript
{
  name, description,
  startTime, endTime,
  challenges: [ObjectId],
  createdBy: ObjectId
}
```

### Submission
```javascript
{
  userId, challengeId, contestId,
  code, language,
  status: "accepted" | "wrong_answer" | "pending" | ...,
  runtime, memory, score,
  submittedAt
}
```

---

## 🎮 Key Features Summary

| Feature | User | Admin | Status |
|---------|------|-------|--------|
| Solve Problems | ✅ | ✅ | Active |
| Submit Code | ✅ | ✅ | Active |
| View Leaderboard | ✅ | ✅ | Active |
| Participate Contest | ✅ | ✅ | Active |
| Create Challenge | ❌ | ✅ | Active |
| Create Contest | ❌ | ✅ | Active |
| Create Test Cases | ❌ | ✅ | Active |
| View Admin Panel | ❌ | ✅ | Active |
| Manage Users | ❌ | ❌ | Future |

---

## 🔐 Authentication Quick Tips

### Login Flow
```
User enters credentials
    ↓
Backend validates
    ↓
JWT token generated
    ↓
Token stored in localStorage
    ↓
Token sent in every API request (Authorization header)
    ↓
Backend validates token and extracts user info
```

### Default Credentials (for testing)
```
Create accounts through signup page
```

### Token Expiry
```
Currently: No expiry (infinite)
Production: Should add 24-48 hour expiry
```

---

## 📁 Important Files

### Backend
- `server.js` - Main server entry point
- `.env` - Configuration (NEVER commit!)
- `models/*.js` - Database schemas
- `controllers/*.js` - Business logic
- `routes/*.js` - API endpoints
- `middleware/auth.js` - JWT verification

### Frontend
- `src/App.js` - Main component & routing
- `src/pages/*.js` - Page components
- `src/components/*.js` - Reusable components
- `.env` - Frontend config
- `public/index.html` - HTML template

---

## 🚀 Deployment Quick Commands

### Local Development
```bash
# Backend
cd backend && node server.js

# Frontend
cd frontend && npm start
```

### Production Build
```bash
# Frontend build
cd frontend && npm run build

# Output in frontend/build/
```

### Deploy to Heroku (Backend)
```bash
heroku create your-app-name
heroku config:set MONGODB_URL=your_url
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Deploy to Vercel (Frontend)
```bash
vercel --prod --dir=frontend/build
```

---

## 📱 Supported Languages
- JavaScript (Node.js)
- Python 3
- Java
- C++
- C
- C#
- Ruby
- Go
- Rust

---

## 🎯 File Changes Summary

### Fixed ✅
- `backend/.env` - PORT configuration, added JWT_SECRET
- `frontend/src/pages/ProblemDetails.js` - Fixed template literals (lines 40, 67)
- `backend/models/Submission.js` - Added contestId field
- `backend/controllers/Submission.js` - Fixed submission status logic
- `backend/routes/Challenge.js` - Made GET routes optional auth
- `backend/controllers/Challenge.js` - Handle optional auth properly

### Created ✅
- `backend/middleware/optionalAuth.js` - New optional auth middleware

---

## 📞 Quick Help

### Q: How to login?
A: Click "Login" on home page, enter email and password you signed up with

### Q: How to create challenge?
A: Must be admin. Go to `/admin/create-problem`

### Q: How to test code locally?
A: Click "Run Code" button to test against visible test cases

### Q: How to join contest?
A: Go to Contests page, click active contest

### Q: How to check rating?
A: Go to Dashboard or Profile page

### Q: How to see achievements?
A: Check Profile page for badges and stats

### Q: What if code is wrong?
A: Submit shows which tests failed. Use "Run Code" to debug

### Q: Can I change my solution?
A: Yes, you can submit multiple times

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Backend server starts without errors
- [ ] Frontend compiles successfully
- [ ] Can open http://localhost:3000
- [ ] API test endpoint responds
- [ ] Can create user account
- [ ] Can login with credentials
- [ ] Can see problems list
- [ ] Can see contests list

---

## 🎓 Learning Path for New Developers

1. **Setup** - Follow SETUP_GUIDE.md
2. **Understand** - Read PROJECT_ANALYSIS.md
3. **Features** - Check FEATURES_GUIDE.md
4. **Test** - Use QUICK_REFERENCE.md (this file)
5. **Code** - Explore models, controllers, routes
6. **Deploy** - Use deployment commands above

---

**Last Updated**: After all fixes applied
**Status**: ✅ Ready for Development
