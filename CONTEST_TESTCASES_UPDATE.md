# Contest Test Cases Update - Summary

## Overview
Updated the system to allow adding test cases when creating contests, with support for hidden test cases (just like in problem creation).

## Changes Made

### 1. Backend - Model Updates

#### `/backend/models/TestCase.js`
- **Before**: TestCase only supported `challengeId`
- **After**: TestCase now supports both `challengeId` and `contestId`
- Added validation to ensure at least one of them is provided
- Maintained `isHidden` field for hiding test cases from users

### 2. Backend - Controller Updates

#### `/backend/controllers/TestCase.js`
- Added `getTestCasesByContest()` - Retrieves test cases for a specific contest
- Added `createContestTestCase()` - Creates test cases for contest
- Admin users can see all test cases (including hidden), regular users only see non-hidden ones

### 3. Backend - Routes Updates

#### `/backend/routes/TestCase.js`
- Added `GET /testcases/contest/:id` - Get all test cases for a contest
- Added `POST /testcases/contest/:id` - Create test cases for a contest
- Existing challenge routes remain unchanged for backward compatibility

### 4. Frontend - Contest Creation UI Updates

#### `/frontend/src/pages/CreateContest.js`

**State Management**:
- Each problem now includes a `testCases` array
- Each test case has: `input`, `expectedOutput`, and `isHidden` fields

**New Functions**:
- `addTestCase(problemIndex)` - Add a test case to a problem
- `removeTestCase(problemIndex, testCaseIndex)` - Remove a test case
- `handleTestCaseChange()` - Handle test case input changes

**UI Changes**:
- Added "Test Cases for Problem X" section under each problem
- Test case input/output fields with 2-column layout
- "Hidden" checkbox for each test case
- "Add Test Case" button to add more test cases
- "Remove" button to delete test cases

**Form Submission Logic**:
1. Creates the contest first
2. Creates each problem/challenge
3. Creates test cases for each problem
4. Associates all challenges with the contest

**Validation**:
- All test case inputs and expected outputs must be filled
- Error handling with user-friendly messages

## Features

✅ **Multiple Test Cases Per Problem**: Each contest problem can have multiple test cases
✅ **Hidden Test Cases**: Mark test cases as hidden to keep them from users during the contest
✅ **Backward Compatible**: Existing challenge test cases still work the same way
✅ **Admin Visibility**: Admin users can see all test cases including hidden ones
✅ **User Privacy**: Regular users only see non-hidden test cases
✅ **Easy to Use**: Similar UI to problem creation page

## API Endpoints

### Get Contest Test Cases
```
GET /api/testcases/contest/:contestId
```

### Create Contest Test Case
```
POST /api/testcases/contest/:contestId
Body: {
  "input": "test input",
  "expectedOutput": "expected output",
  "isHidden": false/true
}
```

## Usage Flow

1. Admin navigates to "Create Contest"
2. Fills in contest details (name, start time, end time, description)
3. For each problem:
   - Adds problem title, description, difficulty, and points
   - Adds test cases with input/output pairs
   - Marks test cases as hidden if needed
4. Submits form
5. System creates:
   - Contest record
   - Challenge records for each problem
   - Test cases for each challenge
   - Links challenges to contest

## Testing Checklist

- [ ] Can create contest with problems
- [ ] Can add multiple test cases per problem
- [ ] Can mark test cases as hidden
- [ ] Can remove test cases (minimum 1 required)
- [ ] Test case inputs and outputs are properly validated
- [ ] Contest creation properly links all challenges
- [ ] Admin can see all test cases including hidden ones
- [ ] Regular users only see non-hidden test cases

## Backward Compatibility

✅ All existing problem/challenge creation remains unchanged
✅ All existing test case endpoints for challenges still work
✅ No breaking changes to existing APIs