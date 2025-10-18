const Submission = require("../models/Submission");
const TestCase = require("../models/TestCase");
const TestCaseResult = require("../models/TestCaseResult");
const User = require("../models/User");
const Challenge = require("../models/Challenge");
const ContestParticipation = require("../models/ContestParticipation");
const codeExecutor = require("../services/codeExecutor");
const { checkAndAwardBadges } = require("../services/badgeService");

const runCode = async (req, res) => {
  try {
    const { code, challengeId, language } = req.body;
    
    // Get visible test cases for testing
    const testCases = await TestCase.find({ 
      challengeId, 
      isHidden: false 
    });
    
    const results = [];
    
    for (const testCase of testCases) {
      const result = await codeExecutor.executeCode(code, language, testCase.input);
      
      // Normalize output for comparison (trim whitespace and newlines)
      const actualOutput = result.output.trim().replace(/\r\n/g, '\n');
      const expectedOutput = testCase.expectedOutput.trim().replace(/\r\n/g, '\n');
      
      const passed = result.success && actualOutput === expectedOutput;
      
      results.push({
        passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        output: result.output,
        error: result.error,
        runtime: result.runtime
      });
    }
    
    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitCode = async (req, res) => {
  try {
    const { challengeId, code, language, contestId } = req.body;
    
    // Create submission
    const submission = new Submission({
      userId: req.user.id,
      challengeId,
      code,
      language,
      status: 'pending',
      contestId: contestId || null
    });
    
    await submission.save();
    
    // Get all test cases (including hidden ones)
    const testCases = await TestCase.find({ challengeId });
    
    let passedCount = 0;
    const testResults = [];
    
    for (const testCase of testCases) {
      const result = await codeExecutor.executeCode(code, language, testCase.input);
      
      const passed = result.success && result.output.trim() === testCase.expectedOutput.trim();
      if (passed) passedCount++;
      
      const testCaseResult = new TestCaseResult({
        submissionId: submission._id,
        testCaseId: testCase._id,
        status: passed ? 'passed' : 'failed',
        output: result.output,
        error: result.error,
        runtime: result.runtime
      });
      
      await testCaseResult.save();
      testResults.push(testCaseResult);
    }
    
    // Update submission status based on test results
    const allPassed = passedCount === testCases.length;
    submission.status = allPassed ? 'accepted' : 'wrong_answer';
    submission.score = testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 100;
    await submission.save();
    
    // Update contest participation if this is a contest submission
    let contestParticipation = null;
    if (contestId && allPassed) {
      const challenge = await Challenge.findById(challengeId);
      
      // Find or create contest participation
      contestParticipation = await ContestParticipation.findOne({
        userId: req.user.id,
        contestId
      });
      
      if (!contestParticipation) {
        contestParticipation = new ContestParticipation({
          userId: req.user.id,
          contestId,
          totalScore: 0,
          solvedProblems: [],
          problemScores: []
        });
      }
      
      // Check if this problem was already solved in this contest
      const alreadySolved = contestParticipation.solvedProblems.includes(challengeId);
      
      if (!alreadySolved) {
        // Add problem points to total score
        contestParticipation.solvedProblems.push(challengeId);
        contestParticipation.totalScore += (challenge.points || 10);
        contestParticipation.problemScores.push({
          problemId: challengeId,
          score: challenge.points || 10,
          submissionCount: 1
        });
      } else {
        // Already solved, just update submission count
        const problemScore = contestParticipation.problemScores.find(
          ps => ps.problemId.toString() === challengeId.toString()
        );
        if (problemScore) {
          problemScore.submissionCount += 1;
        }
      }
      
      contestParticipation.updatedAt = new Date();
      await contestParticipation.save();
    }
    
    // Update user stats if problem is solved
    let achievements = [];
    let ratingChange = 0;
    let newStats = null;
    let updatedBadges = null;

    if (allPassed) {
      const user = await User.findById(req.user.id);
      const challenge = await Challenge.findById(challengeId);

      // Check if user hasn't solved this problem before
      const previousSubmission = await Submission.findOne({
        userId: req.user.id,
        challengeId,
        status: 'accepted',
        _id: { $ne: submission._id }
      });
  
      if (!previousSubmission) {
        achievements.push(`✅ Solved ${challenge.title}`);

        // Calculate rating change
        if (challenge.difficulty === 'Easy') {
          ratingChange = 10;
          achievements.push(`🏆 +10 rating points (Easy problem)`);
        } else if (challenge.difficulty === 'Medium') {
          ratingChange = 20;
          achievements.push(`🏆 +20 rating points (Medium problem)`);
        } else if (challenge.difficulty === 'Hard') {
          ratingChange = 30;
          achievements.push(`🏆 +30 rating points (Hard problem)`);
        }

        // Calculate new stats BEFORE updating user
        const newTotalSolved = user.stats.totalSolved + 1;
        const today = new Date();
        const lastSolvedDate = user.stats.lastSolvedDate;
        let newCurrentStreak = user.stats.currentStreak;

        if (lastSolvedDate) {
          const daysDiff = Math.floor((today - lastSolvedDate) / (1000 * 60 * 60 * 24));
          if (daysDiff === 1) {
            newCurrentStreak += 1; // Consecutive day
          } else if (daysDiff > 1) {
            newCurrentStreak = 1; // Streak broken
          }
          // If daysDiff === 0, same day - keep current streak
        } else {
          newCurrentStreak = 1; // First problem solved
        }

        // Check for streak achievements
        if (newCurrentStreak > 1) {
          achievements.push(`🔥 ${newCurrentStreak} day streak!`);
        }
        if (newCurrentStreak >= 7) {
          achievements.push(`⚡ Week warrior! 7+ day streak!`);
        }
        if (newCurrentStreak >= 30) {
          achievements.push(`👑 Streak master! 30+ day streak!`);
        }

        // Check for milestone achievements
        if (newTotalSolved >= 10 && user.stats.totalSolved < 10) {
          achievements.push(`🎉 First 10 problems solved!`);
        } else if (newTotalSolved >= 25 && user.stats.totalSolved < 25) {
          achievements.push(`🚀 Quarter century! 25 problems solved!`);
        } else if (newTotalSolved >= 50 && user.stats.totalSolved < 50) {
          achievements.push(`🌟 50 problems solved milestone!`);
        } else if (newTotalSolved >= 100 && user.stats.totalSolved < 100) {
          achievements.push(`👑 100 problems solved - Expert level!`);
        } else if (newTotalSolved >= 200 && user.stats.totalSolved < 200) {
          achievements.push(`🏅 200 problems solved - Master level!`);
        }

        // Check for difficulty-specific achievements
        const newEasySolved = user.stats.easySolved + (challenge.difficulty === 'Easy' ? 1 : 0);
        const newMediumSolved = user.stats.mediumSolved + (challenge.difficulty === 'Medium' ? 1 : 0);
        const newHardSolved = user.stats.hardSolved + (challenge.difficulty === 'Hard' ? 1 : 0);

        if (newEasySolved >= 20 && user.stats.easySolved < 20) {
          achievements.push(`🟢 Easy master! 20 easy problems solved!`);
        }
        if (newMediumSolved >= 15 && user.stats.mediumSolved < 15) {
          achievements.push(`🟡 Medium conqueror! 15 medium problems solved!`);
        }
        if (newHardSolved >= 10 && user.stats.hardSolved < 10) {
          achievements.push(`🔴 Hard hero! 10 hard problems solved!`);
        }

        // Check for rating achievements
        const newRating = user.profile.rating + ratingChange;
        if (newRating >= 1500 && user.profile.rating < 1500) {
          achievements.push(`⭐ Reached 1500 rating!`);
        } else if (newRating >= 1800 && user.profile.rating < 1800) {
          achievements.push(`🌟 Reached 1800 rating!`);
        } else if (newRating >= 2000 && user.profile.rating < 2000) {
          achievements.push(`👑 Reached 2000 rating - Expert!`);
        } else if (newRating >= 2200 && user.profile.rating < 2200) {
          achievements.push(`🔥 Reached 2200 rating - Master!`);
        }

        // Check for special achievements
        if (newTotalSolved >= 5 && user.stats.totalSolved < 5) {
          achievements.push(`🎯 Getting started! 5 problems solved!`);
        }

        // Check for speed achievements (if runtime is very fast)
        // Note: This check is disabled as 'result' is not available outside the loop
        // if (result.runtime < 10) {
        //   achievements.push(`⚡ Lightning fast! Solved in under 10ms!`);
        // }

        // Check for perfect submissions (first try)
        const totalAttempts = await Submission.countDocuments({
          userId: req.user.id,
          challengeId
        });
        if (totalAttempts === 1) {
          achievements.push(`💯 First try success! Perfect submission!`);
        }

        // NOW UPDATE THE USER STATS IN DATABASE
        // Add problem to solved problems list
        if (!user.solvedProblems.includes(challengeId)) {
          user.solvedProblems.push(challengeId);
        }

        // Update basic stats
        // Update basic stats
        user.stats.totalSolved += 1;

        // Update difficulty stats
        if (challenge.difficulty === 'Easy') {
          user.stats.easySolved += 1;
          user.profile.rating += 10;
        } else if (challenge.difficulty === 'Medium') {
          user.stats.mediumSolved += 1;
          user.profile.rating += 20;
        } else if (challenge.difficulty === 'Hard') {
          user.stats.hardSolved += 1;
          user.profile.rating += 30;
        }

        // Update max rating
        if (user.profile.rating > user.profile.maxRating) {
          user.profile.maxRating = user.profile.rating;
        }

        console.log('Before user.save() - Stats:', {
          totalSolved: user.stats.totalSolved,
          easySolved: user.stats.easySolved,
          mediumSolved: user.stats.mediumSolved,
          hardSolved: user.stats.hardSolved,
          rating: user.profile.rating,
          rank: user.profile.rank
        });

        // Update profile rank based on total problems solved
        const currentTotalSolved = user.stats.totalSolved;
        let newRank = user.profile.rank || 'Beginner';

        if (newTotalSolved >= 500) {
          newRank = 'Grandmaster';
        } else if (newTotalSolved >= 201) {
          newRank = 'Master';
        } else if (newTotalSolved >= 101) {
          newRank = 'Expert';
        } else if (newTotalSolved >= 51) {
          newRank = 'Advanced';
        } else if (newTotalSolved >= 26) {
          newRank = 'Intermediate';
        } else if (newTotalSolved >= 11) {
          newRank = 'Novice';
        } else {
          newRank = 'Beginner';
        }

        if (newRank !== user.profile.rank) {
          user.profile.rank = newRank;
          achievements.push(`🏅 Promoted to ${newRank}!`);
        }

        // Update topic progress
        challenge.topics.forEach(topic => {
          if (!user.stats.topicProgress.has(topic)) {
            user.stats.topicProgress.set(topic, { solved: 0, total: 0 });
          }
          const progress = user.stats.topicProgress.get(topic);
          progress.solved += 1;
          user.stats.topicProgress.set(topic, progress);
        });

        // Update streak tracking
        user.stats.currentStreak = newCurrentStreak;
        if (user.stats.currentStreak > user.stats.maxStreak) {
          user.stats.maxStreak = user.stats.currentStreak;
        }
        user.stats.lastSolvedDate = today;

        // SAVE USER TO DATABASE
        await user.save();
        console.log('After user.save() - Stats saved successfully');

        // Check and award badges
        try {
          updatedBadges = await checkAndAwardBadges(req.user.id);
        } catch (badgeError) {
          console.error('Error checking badges:', badgeError);
        }

        // Store new stats for response
        newStats = {
          totalSolved: newTotalSolved,
          currentStreak: newCurrentStreak,
          rating: newRating
        };
      }
    }

    res.status(201).json({
      submission,
      status: submission.status,
      score: submission.score,
      passedTests: passedCount,
      totalTests: testCases.length,
      message: allPassed ? '🎉 Problem completed successfully!' : '❌ Some test cases failed',
      achievements: allPassed ? achievements : [],
      ratingChange: allPassed ? ratingChange : 0,
      newStats: allPassed ? newStats : null,
      badges: allPassed ? updatedBadges : null,
      success: allPassed,
      gamificationActive: true,
      contestScore: contestParticipation ? contestParticipation.totalScore : null,
      contestParticipation: contestParticipation ? contestParticipation : null
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const testGamification = async (req, res) => {
  try {
    // This is a test endpoint to verify gamification is working
    const { userId, challengeId } = req.body;

    if (!userId || !challengeId) {
      return res.status(400).json({
        error: 'userId and challengeId are required',
        example: {
          userId: 'user_id_here',
          challengeId: 'challenge_id_here'
        }
      });
    }

    const user = await User.findById(userId);
    const challenge = await Challenge.findById(challengeId);

    if (!user || !challenge) {
      return res.status(404).json({ error: 'User or Challenge not found' });
    }

    // Simulate the gamification calculations
    const mockResult = {
      success: true,
      output: 'Test output',
      error: '',
      runtime: 25
    };

    // Calculate achievements (same logic as in submitCode)
    let achievements = [];
    let ratingChange = 0;

    achievements.push(`✅ Solved ${challenge.title}`);

    if (challenge.difficulty === 'Easy') {
      ratingChange = 10;
      achievements.push(`🏆 +10 rating points (Easy problem)`);
    } else if (challenge.difficulty === 'Medium') {
      ratingChange = 20;
      achievements.push(`🏆 +20 rating points (Medium problem)`);
    } else if (challenge.difficulty === 'Hard') {
      ratingChange = 30;
      achievements.push(`🏆 +30 rating points (Hard problem)`);
    }

    // Mock new stats
    const newStats = {
      totalSolved: user.stats.totalSolved + 1,
      currentStreak: user.stats.currentStreak + 1,
      rating: user.profile.rating + ratingChange
    };

    // Add milestone achievements
    if (newStats.totalSolved >= 10) achievements.push(`🎉 10 problems solved milestone!`);
    if (newStats.currentStreak >= 7) achievements.push(`🔥 7 day streak!`);
    if (newStats.rating >= 1500) achievements.push(`⭐ Reached 1500 rating!`);

    res.json({
      success: true,
      message: 'Gamification test successful!',
      user: {
        id: user._id,
        name: user.profile.name,
        currentStats: {
          totalSolved: user.stats.totalSolved,
          rating: user.profile.rating,
          currentStreak: user.stats.currentStreak
        },
        newStats,
        ratingChange,
        achievements,
        challenge: {
          title: challenge.title,
          difficulty: challenge.difficulty,
          topics: challenge.topics
        }
      },
      gamificationFeatures: {
        ratingSystem: true,
        streakTracking: true,
        achievementSystem: true,
        milestoneRewards: true,
        topicProgress: true,
        leaderboardIntegration: true
      }
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
      gamificationStatus: 'Error in gamification system'
    });
  }
};

module.exports = { runCode, submitCode, testGamification };
