# Contest Scoring System - Implementation Guide

## 📊 Overview
This document explains the new contest scoring system that tracks user scores and marks problems as solved during contests.

## ✨ Features Implemented

### 1. **Contest Participation Tracking**
- New `ContestParticipation` model stores user scores per contest
- Tracks solved problems and their individual scores
- Stores submission attempts per problem
- Unique constraint ensures one participation record per user per contest

### 2. **Automatic Score Calculation**
When a user solves a problem in a contest:
- The problem's points are added to their total contest score
- The problem is marked as solved
- Submission count is tracked (for future features like penalties)
- Score calculation happens only on first successful solve

### 3. **Problem Status Display**
Problems now show three states:
- ✓ **Solved**: Green checkmark when user has solved it
- ! **Attempted**: Yellow mark when user tried but didn't solve
- ○ **Not Attempted**: Gray circle for untried problems

### 4. **Live Score Display**
- Contest problems page shows **"Your Score"** in the header
- Score updates automatically after each successful submission
- Contest score shown separately from practice rating

## 📁 New Files Created

### Backend
1. **`/backend/models/ContestParticipation.js`**
   - Stores user's contest-specific score and progress
   - Fields: userId, contestId, totalScore, solvedProblems, problemScores

2. **`/backend/controllers/ContestParticipation.js`**
   - `getUserContestParticipation()`: Fetch user's score for a contest
   - `getContestLeaderboard()`: Get ranked leaderboard for contest

3. **`/backend/routes/ContestParticipation.js`**
   - Endpoints for fetching participation data
   - `GET /api/contest-participation/:contestId` - User's score
   - `GET /api/contest-participation/:contestId/leaderboard` - Leaderboard

### Frontend
Updates to existing pages:
- `frontend/src/pages/ContestProblems.js` - Display score and track solved status
- `frontend/src/pages/ProblemDetails.js` - Show contest score in alerts and navigate back

## 🔄 Modified Files

### Backend

#### `/backend/models/Submission.js`
- ✅ Already tracks contestId for submissions

#### `/backend/controllers/Submission.js`
**Key Changes:**
1. Import ContestParticipation model
2. Set contestId in submission creation
3. After successful solve, create/update ContestParticipation record
4. Add contestScore and contestParticipation to response JSON

**Logic Flow:**
```
User submits code
    ↓
All tests pass?
    ↓ Yes
Check/create ContestParticipation
    ↓
Problem already solved?
    ↓ No
Add points to totalScore
Mark problem as solved
    ↓
Save to database
    ↓
Return score info in response
```

#### `/backend/server.js`
- Added ContestParticipation model import
- Added ContestParticipation routes

### Frontend

#### `/frontend/src/pages/ContestProblems.js`
**Changes:**
- Added state: `userScore`, `contestParticipation`, `refreshTrigger`
- Fetch user participation on component mount
- Display "Your Score" in header (next to Time Remaining)
- Update problem solved status based on participation data
- Fetch data whenever contestId, user, or refreshTrigger changes

#### `/frontend/src/pages/ProblemDetails.js`
**Changes:**
- Import `useNavigate` hook
- Show contest score in success alert: `📊 Contest Score: +10 points, Total: 45 points`
- Auto-navigate back to contest after successful submission
- Handles both practice problems (no navigation) and contest problems

## 🚀 How It Works

### Scenario: User Solves a Contest Problem

1. **User submits code** in Problem page
2. **Backend evaluates** test cases
3. **If all pass:**
   - Submission marked as 'accepted'
   - ContestParticipation record created/updated
   - Problem added to solvedProblems array
   - Points added to totalScore
   - Response includes contestScore and full participation data
4. **Frontend shows:**
   - Success alert with problem points and total score
   - Auto-navigates back to contest
5. **Contest Problems page shows:**
   - Problem marked as ✓ Solved
   - Your Score updated to include new points
   - Live leaderboard can show current ranking

## 📊 API Response Example

### Submit Code (POST /api/submissions)
```json
{
  "status": "accepted",
  "score": 100,
  "passedTests": 5,
  "totalTests": 5,
  "message": "🎉 Problem completed successfully!",
  "contestScore": 45,
  "contestParticipation": {
    "userId": "...",
    "contestId": "...",
    "totalScore": 45,
    "solvedProblems": ["prob1", "prob2"],
    "problemScores": [
      { "problemId": "prob1", "score": 20, "submissionCount": 1 },
      { "problemId": "prob2", "score": 25, "submissionCount": 2 }
    ]
  }
}
```

### Get User Contest Score (GET /api/contest-participation/:contestId)
```json
{
  "userId": "...",
  "contestId": "...",
  "totalScore": 45,
  "solvedProblems": ["prob1", "prob2"],
  "problemScores": [...]
}
```

## 🔧 Setup Instructions

### 1. Restart Backend
```bash
cd backend
npm start
```
The server will:
- Import the new ContestParticipation model
- Register the new routes
- Connect to MongoDB

### 2. Hard Refresh Frontend
- Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear browser cache to reload updated JavaScript

### 3. Test the Feature
1. Go to a contest
2. Select a problem and solve it
3. Verify:
   - ✅ Alert shows problem points and total score
   - ✅ Auto-navigates back to contest
   - ✅ Problem is marked as ✓ Solved
   - ✅ Your Score in header is updated

## 🎯 Future Enhancements

1. **Penalty-based scoring** - Reduce points for each failed attempt
2. **Time-based bonus** - Award more points for solving quickly
3. **Contest Leaderboard** - Show ranked list of all participants
4. **Achievement badges** - Special badges for perfect scores, speedruns, etc.
5. **Contest replay** - Let users review their solved problems after contest ends
6. **Analytics** - Problem solve time, success rate, difficulty analysis

## 🐛 Troubleshooting

### Score Not Updating
- Check browser console for errors
- Verify backend server is running
- Ensure token is valid (check localStorage)
- Hard refresh the page

### Problem Still Shows as Not Attempted
- Submission may have failed silently
- Check backend logs for errors
- Ensure test cases are configured correctly
- Try solving again

### Navigation Not Working Back to Contest
- Check if contestId is being passed correctly
- Verify the route `/contest/:contestId` exists
- Check browser console for navigation errors

## 📝 Database Schema

### ContestParticipation Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  contestId: ObjectId (ref: Contest),
  totalScore: Number,
  solvedProblems: [ObjectId], // Array of challenge IDs
  problemScores: [
    {
      problemId: ObjectId,
      score: Number,
      submissionCount: Number
    }
  ],
  joinedAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ userId: 1, contestId: 1 }` - Unique index to prevent duplicates

## ✅ Verification Checklist

- [x] ContestParticipation model created
- [x] ContestParticipation controller created
- [x] ContestParticipation routes created
- [x] Submission controller updated to track contest scores
- [x] Server.js updated with new routes
- [x] ContestProblems page shows Your Score
- [x] ContestProblems page tracks solved problems
- [x] ProblemDetails shows contest score in alert
- [x] ProblemDetails auto-navigates back after success

## 🔗 Related Documentation
- See `CONTEST_TESTCASES_UPDATE.md` for test case setup
- See `FEATURES_GUIDE.md` for other contest features
- See API documentation for detailed endpoint specs