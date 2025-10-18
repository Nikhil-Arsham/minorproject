# Platform Features & Usage Guide

## 🎯 Core Features

### 1. User Authentication
- **Sign Up**: Create new account with username, email, password, full name
- **Login**: Authenticate and receive JWT token
- **Profile**: View and edit user profile, achievements, stats
- **Auto-login**: Token stored in localStorage for session persistence

### 2. Coding Challenges
#### Types
- **Easy**: 10 rating points
- **Medium**: 20 rating points  
- **Hard**: 30 rating points

#### Challenge Components
- Problem description
- Input/Output format
- Constraints
- Example test cases
- Code editor with multiple language support
- Run & Submit functionality

#### Supported Languages
- JavaScript (Node.js)
- Python 3
- Java
- C++
- C
- C#
- Ruby
- Go
- Rust

### 3. Code Execution
#### Test Phase (Run Code)
- Shows visible test cases only
- Provides feedback without grading
- Useful for debugging

#### Submission Phase (Submit Code)
- Tests against all test cases (including hidden ones)
- Provides final score
- Updates user stats if all tests pass
- Triggers achievements

### 4. Contests
#### Contest Creation (Admin)
1. Set contest name, description, duration
2. Add challenges to contest
3. Set start and end times
4. Make contest live

#### User Participation
1. Browse available contests
2. Enter contest (can start anytime during contest window)
3. Solve challenges
4. Submit code
5. View contest leaderboard

#### Contest Leaderboard
- Rank based on total score
- Secondary sorting by submission time
- Real-time updates
- Shows username, country, and score

### 5. Gamification System

#### Rating System
- **Starting Rating**: 1200 (for new users)
- **Max Rating**: Tracks highest rating achieved
- **Rating Changes**:
  - Easy problem: +10
  - Medium problem: +20
  - Hard problem: +30
  - Can decrease based on contest performance

#### Badges
Automatically awarded for achievements:
- First 5 problems solved
- 10 problems milestone
- 25 problems milestone
- 50 problems milestone
- 100 problems milestone
- 200+ problems milestone
- Easy master (20 easy problems)
- Medium conqueror (15 medium problems)
- Hard hero (10 hard problems)
- Rating milestones (1500, 1800, 2000, 2200)

#### Streaks
- **Current Streak**: Consecutive days with at least one solve
- **Max Streak**: Longest streak achieved
- Achievements for 7-day and 30-day streaks
- Resets if day is skipped

#### User Ranks
- **Beginner**: 0-10 problems
- **Novice**: 11-25 problems
- **Intermediate**: 26-50 problems
- **Advanced**: 51-100 problems
- **Expert**: 101-200 problems
- **Master**: 201-500 problems
- **Grandmaster**: 500+ problems

#### Topic Progress
- Tracks progress per topic (Data Structures, Algorithms, etc.)
- Shows solved/total problems per topic
- Visual representation on profile

### 6. Leaderboard
#### Global Leaderboard
- All users sorted by rating
- Shows rank, username, country, rating
- Pagination support
- Filters by region/country (future)

#### Contest Leaderboard
- Users ranked by contest score
- Shows completion time
- Personal rank indicator

### 7. User Dashboard
Shows:
- Total problems solved
- Easy/Medium/Hard breakdown
- Current rating and max rating
- Current streak
- Recent achievements
- Topic progress chart
- Contest history

### 8. Admin Panel

#### Challenge Management
- Create new challenges with:
  - Title, description, difficulty
  - Topics/tags
  - Input/output format
  - Constraints
  - Example test cases
- Edit existing challenges
- Delete challenges
- View challenge statistics

#### Test Case Management
- Create visible and hidden test cases
- Edit test cases
- Delete test cases
- Mark test cases as visible or hidden

#### Contest Management
- Create contests
- Add/remove challenges from contests
- Set contest duration
- Edit contest details
- View contest statistics
- Manage contest leaderboard

#### User Management (Future)
- View all users
- Reset user stats
- Ban/unban users
- View user activity

---

## 🎮 How to Use Platform

### For Students/Users

#### Step 1: Sign Up
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Enter username, email, password, full name
4. Click "Register"

#### Step 2: Explore Challenges
1. Go to "Problems" section
2. Browse available challenges
3. Filter by difficulty level
4. Click on challenge to view details

#### Step 3: Solve a Challenge
1. Click on challenge
2. Read problem description
3. Write code in editor
4. Select programming language
5. Click "Run Code" to test
6. Click "Submit" when confident
7. Check results

#### Step 4: Join Contest
1. Go to "Contests"
2. Click on active contest
3. Choose a problem
4. Solve and submit
5. Check contest leaderboard

#### Step 5: View Profile
1. Click on profile icon
2. See statistics, badges, achievements
3. Check rating and rank
4. View solved problems by topic

### For Admins

#### Step 1: Login as Admin
- Requires account with admin role (set in database)

#### Step 2: Create Challenge
1. Go to Admin Panel
2. Click "Create Problem"
3. Fill in:
   - Title
   - Description
   - Difficulty
   - Topics
   - Input/Output format
   - Constraints
   - Example test cases
4. Add at least 1 visible test case
5. Click "Create"

#### Step 3: Create Test Cases
1. Go to challenge details
2. Click "Add Test Case"
3. Enter input and expected output
4. Mark as hidden or visible
5. Save

#### Step 4: Create Contest
1. Go to Admin Panel
2. Click "Create Contest"
3. Fill in:
   - Contest name
   - Description
   - Start time
   - End time
4. Add problems to contest
5. Click "Create"

#### Step 5: Monitor Activity
1. View contest leaderboard
2. Check user submissions
3. Monitor problem statistics

---

## 💡 Tips for Best Experience

### For Solving Problems
1. Read the entire problem first
2. Understand input/output format
3. Check constraints (time, memory limits)
4. Test with example test cases
5. Edge cases are important!
6. Use Run Code for debugging

### For Contests
1. Read all problems before starting
2. Solve easier problems first (more time for harder ones)
3. Manage time wisely
4. Submit even partial solutions for points
5. Check leaderboard regularly

### For Admins
1. Always provide clear problem statements
2. Include multiple test cases (visible and hidden)
3. Set realistic difficulty levels
4. Test challenges before publishing
5. Provide good examples in problem description

---

## 📊 Code Execution Details

### Judge0 Integration
- Uses RapidAPI for code execution
- Supports 20+ languages
- Timeout: 10 seconds per test case
- Memory limit: Varies by language

### When Judge0 API Key Not Provided
- Platform uses simulation mode
- Basic code structure validation
- Simulated execution results
- Suitable for development/testing
- Production should use real Judge0 API

### Error Types
- **Accepted**: All test cases passed ✅
- **Wrong Answer**: Output doesn't match expected ❌
- **Runtime Error**: Code crashes during execution 💥
- **Time Limit Exceeded**: Code takes too long ⏱️
- **Compilation Error**: Syntax or compilation issue 🔴

---

## 🔐 Security Features

### Authentication
- JWT token-based auth
- Secure password hashing with bcrypt
- Token stored in localStorage
- Auto-logout after browser close

### Authorization
- Role-based access control (User/Admin)
- Only admins can create contests/challenges
- Users can only see their own submissions
- Hidden test cases only used for grading

### Data Protection
- MongoDB connection via Atlas (encrypted)
- CORS enabled for development
- Secure HTTP headers (in production)
- Input validation on all endpoints

---

## 🚀 Performance Notes

### Optimization Tips
1. **Pagination**: All lists support pagination
2. **Lean Queries**: Database queries optimized
3. **Caching**: Leaderboard can be cached
4. **Indexing**: Database indexes on frequently queried fields

### Large Scale Considerations
- Add Redis for caching
- Use CDN for static assets
- Load balancing for multiple instances
- Database sharding for large datasets

---

## 📖 Example Workflow

### Complete Example: Solving "Hello World"

1. **Admin creates challenge**:
   - Title: "Hello World"
   - Description: "Print 'Hello, World!'"
   - Difficulty: Easy
   - Language: JavaScript

2. **Admin creates test case**:
   - Input: ""
   - Output: "Hello, World!"
   - Visible: Yes

3. **User signs up and logs in**

4. **User views challenge**:
   - Reads problem
   - Clicks "Solve"

5. **User writes code**:
   ```javascript
   console.log("Hello, World!");
   ```

6. **User runs test**:
   - Clicks "Run Code"
   - Sees output matches expected
   - Confidence grows

7. **User submits**:
   - Clicks "Submit"
   - All tests pass
   - Status: Accepted ✅

8. **User gains rewards**:
   - +10 rating points
   - +1 to total solved
   - +1 to easy solved
   - Possible badge
   - Stats updated on profile

---

## 🎓 Learning Resources

### Supported Topics
- Arrays & Lists
- Strings
- Linked Lists
- Trees
- Graphs
- Dynamic Programming
- Sorting & Searching
- Hash Tables
- Stacks & Queues
- Greedy Algorithms
- Binary Search
- Recursion

Each topic can have multiple challenges with varying difficulty.
