const Submission = require("../models/Submission");

const getLeaderboard = async (req, res) => {
  try {
    // Get leaderboard based on rating (gamified approach)
    const leaderboard = await require('../models/User').find({})
      .select('username profile.name profile.country profile.rating profile.maxRating stats.totalSolved stats.currentStreak stats.maxStreak stats.easySolved stats.mediumSolved stats.hardSolved createdAt')
      .sort({ 'profile.rating': -1, 'stats.totalSolved': -1 })
      .limit(100);

    // Calculate ranks and add gamification data
    const enhancedLeaderboard = leaderboard.map((user, index) => {
      const rank = index + 1;
      let rankBadge = '';

      if (rank === 1) rankBadge = '🥇';
      else if (rank === 2) rankBadge = '🥈';
      else if (rank === 3) rankBadge = '🥉';
      else if (rank <= 10) rankBadge = '🏅';
      else if (rank <= 50) rankBadge = '⭐';
      else rankBadge = '📈';

      // Calculate activity level
      const daysSinceJoin = Math.floor((new Date() - user.createdAt) / (1000 * 60 * 60 * 24));
      const activityLevel = user.stats.totalSolved / Math.max(daysSinceJoin, 1);

      // Calculate consistency score
      const consistencyScore = user.stats.maxStreak > 0 ?
        (user.stats.currentStreak / user.stats.maxStreak) * 100 : 0;

      return {
        id: user._id,
        rank,
        rankBadge,
        username: user.username,
        name: user.profile.name,
        country: user.profile.country,
        rating: user.profile.rating,
        maxRating: user.profile.maxRating,
        totalSolved: user.stats.totalSolved,
        currentStreak: user.stats.currentStreak,
        maxStreak: user.stats.maxStreak,
        easySolved: user.stats.easySolved,
        mediumSolved: user.stats.mediumSolved,
        hardSolved: user.stats.hardSolved,
        activityLevel: Math.round(activityLevel * 100) / 100,
        consistencyScore: Math.round(consistencyScore),
        // Achievement badges
        achievements: {
          streakMaster: user.stats.maxStreak >= 30,
          problemSolver: user.stats.totalSolved >= 100,
          ratingExpert: user.profile.rating >= 2000,
          balancedCoder: user.stats.easySolved >= 20 && user.stats.mediumSolved >= 15 && user.stats.hardSolved >= 10,
          consistentCoder: consistencyScore >= 80
        }
      };
    });

    res.status(200).json({
      leaderboard: enhancedLeaderboard,
      totalUsers: enhancedLeaderboard.length,
      lastUpdated: new Date(),
      gamificationEnabled: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getLeaderboard };