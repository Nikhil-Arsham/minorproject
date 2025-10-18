const User = require('../models/User');
const Badge = require('../models/Badge');

const checkAndAwardBadges = async (userId) => {
  try {
    const user = await User.findById(userId).populate('badges.badge');
    const earnedBadgeIds = user.badges.map(b => b.badge._id.toString());
    
    // Get all available badges
    const allBadges = await Badge.find();
    
    for (const badge of allBadges) {
      // Skip if user already has this badge
      if (earnedBadgeIds.includes(badge._id.toString())) continue;
      
      let shouldAward = false;
      
      switch (badge.criteria.type) {
        case 'problems_solved':
          shouldAward = user.stats.totalSolved >= badge.criteria.value;
          break;
          
        case 'topic_mastery':
          const topicProgress = user.stats.topicProgress.get(badge.criteria.topic);
          shouldAward = topicProgress && topicProgress.solved >= badge.criteria.value;
          break;
          
        case 'difficulty_mastery':
          const difficultyCount = badge.criteria.difficulty === 'Easy' ? user.stats.easySolved :
                                 badge.criteria.difficulty === 'Medium' ? user.stats.mediumSolved :
                                 user.stats.hardSolved;
          shouldAward = difficultyCount >= badge.criteria.value;
          break;
          
        case 'streak':
          shouldAward = user.stats.maxStreak >= badge.criteria.value;
          break;
          
        case 'contest_participation':
          shouldAward = user.stats.contestsParticipated >= badge.criteria.value;
          break;
      }
      
      if (shouldAward) {
        user.badges.push({
          badge: badge._id,
          earnedAt: new Date()
        });
      }
    }
    
    await user.save();
    return user.badges;
  } catch (error) {
    console.error('Error checking badges:', error);
  }
};

module.exports = { checkAndAwardBadges };