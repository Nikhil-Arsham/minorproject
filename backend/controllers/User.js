const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { CustomError } = require("../utils/errorHandler");

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, profile, role } = req.body;
    
    // Debug logging
    console.log('Registration request body:', req.body);
    console.log('Extracted role:', role);
    console.log('Role type:', typeof role);
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(new CustomError("Username or email already exists", 409));
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      profile: profile || { name: username },
      role: role || 'user',
    });
    
    console.log('User object before save:', {
      username: user.username,
      email: user.email,
      role: user.role
    });
    
    await user.save();
    
    console.log('User saved with role:', user.role);
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      } 
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new CustomError("Invalid email or password", 401));
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    
    res.status(200).json({ 
      token, 
      user: { 
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      } 
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user.id;
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const getUserSubmissions = async (req, res, next) => {
  try {
    const userId = req.params.id;
    res.json({ submissions: [] });
  } catch (error) {
    next(error);
  }
};


const getUserStats = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user.id;
    const user = await User.findById(userId).populate('solvedProblems');

    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    // Calculate additional stats
    const totalProblemsAttempted = await require('../models/Submission').countDocuments({
      userId: userId
    });

    const successfulSubmissions = await require('../models/Submission').countDocuments({
      userId: userId,
      status: 'accepted'
    });

    const recentSubmissions = await require('../models/Submission')
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('challengeId', 'title difficulty');


    res.json({
      stats: {
        totalSolved: user.stats.totalSolved,
        easySolved: user.stats.easySolved,
        mediumSolved: user.stats.mediumSolved,
        hardSolved: user.stats.hardSolved,
        currentStreak: user.stats.currentStreak,
        maxStreak: user.stats.maxStreak,
        lastSolvedDate: user.stats.lastSolvedDate,
        totalAttempted: totalProblemsAttempted,
        successRate: totalProblemsAttempted > 0 ? Math.round((successfulSubmissions / totalProblemsAttempted) * 100) : 0
      },
      profile: {
        rating: user.profile.rating,
        maxRating: user.profile.maxRating,
        rank: user.profile.rank
      },
      solvedProblems: user.solvedProblems,
      recentActivity: recentSubmissions,
      achievements: {
        firstTen: user.stats.totalSolved >= 10,
        firstFifty: user.stats.totalSolved >= 50,
        firstHundred: user.stats.totalSolved >= 100,
        streakMaster: user.stats.maxStreak >= 30,
        ratingExpert: user.profile.rating >= 2000
      }
    });
  } catch (error) {
    next(error);
  }
};

const getUserBadges = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user.id;
    const user = await User.findById(userId).populate('badges.badge');

    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    // Generate dynamic badges based on user achievements
    const dynamicBadges = [];

    // Problem-solving badges
    if (user.stats.totalSolved >= 1) {
      dynamicBadges.push({
        _id: 'first-solve',
        name: 'First Steps',
        description: 'Solved your first problem!',
        icon: '🎯',
        color: '#10B981',
        rarity: 'Common'
      });
    }

    if (user.stats.totalSolved >= 10) {
      dynamicBadges.push({
        _id: 'ten-solved',
        name: 'Getting Started',
        description: 'Solved 10 problems!',
        icon: '🚀',
        color: '#3B82F6',
        rarity: 'Common'
      });
    }

    if (user.stats.totalSolved >= 50) {
      dynamicBadges.push({
        _id: 'fifty-solved',
        name: 'Problem Solver',
        description: 'Solved 50 problems!',
        icon: '⭐',
        color: '#F59E0B',
        rarity: 'Rare'
      });
    }

    if (user.stats.totalSolved >= 100) {
      dynamicBadges.push({
        _id: 'hundred-solved',
        name: 'Century Club',
        description: 'Solved 100 problems!',
        icon: '👑',
        color: '#EF4444',
        rarity: 'Epic'
      });
    }

    // Streak badges
    if (user.stats.maxStreak >= 7) {
      dynamicBadges.push({
        _id: 'week-streak',
        name: 'Week Warrior',
        description: '7+ day solving streak!',
        icon: '⚡',
        color: '#8B5CF6',
        rarity: 'Rare'
      });
    }

    if (user.stats.maxStreak >= 30) {
      dynamicBadges.push({
        _id: 'month-streak',
        name: 'Streak Master',
        description: '30+ day solving streak!',
        icon: '🔥',
        color: '#F97316',
        rarity: 'Epic'
      });
    }

    // Rating badges
    if (user.profile.rating >= 1500) {
      dynamicBadges.push({
        _id: 'rating-1500',
        name: 'Skilled Coder',
        description: 'Reached 1500 rating!',
        icon: '🎖️',
        color: '#06B6D4',
        rarity: 'Rare'
      });
    }

    if (user.profile.rating >= 2000) {
      dynamicBadges.push({
        _id: 'rating-2000',
        name: 'Expert Coder',
        description: 'Reached 2000 rating!',
        icon: '🏆',
        color: '#D946EF',
        rarity: 'Epic'
      });
    }

    // Difficulty-specific badges
    if (user.stats.easySolved >= 20) {
      dynamicBadges.push({
        _id: 'easy-master',
        name: 'Easy Master',
        description: 'Solved 20+ easy problems!',
        icon: '🟢',
        color: '#10B981',
        rarity: 'Common'
      });
    }

    if (user.stats.mediumSolved >= 15) {
      dynamicBadges.push({
        _id: 'medium-conqueror',
        name: 'Medium Conqueror',
        description: 'Solved 15+ medium problems!',
        icon: '🟡',
        color: '#F59E0B',
        rarity: 'Rare'
      });
    }

    if (user.stats.hardSolved >= 10) {
      dynamicBadges.push({
        _id: 'hard-hero',
        name: 'Hard Hero',
        description: 'Solved 10+ hard problems!',
        icon: '🔴',
        color: '#EF4444',
        rarity: 'Epic'
      });
    }

    // Combine user-earned badges with dynamic badges
    const allBadges = [...user.badges, ...dynamicBadges.map(badge => ({
      badge: badge,
      earnedAt: new Date(),
      _id: badge._id
    }))];

    res.json({
      badges: allBadges,
      totalBadges: allBadges.length,
      earnedBadges: user.badges.length,
      dynamicBadges: dynamicBadges.length
    });
  } catch (error) {
    next(error);
  }
};

const getUserContests = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user.id;
    
    // For now, return empty array since we don't have contest participation tracking yet
    // In a full implementation, you would query a ContestParticipation model
    res.json([]);
  } catch (error) {
    next(error);
  }
};

const makeUserAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { role: 'admin' }, { new: true });
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    res.json({ message: 'User made admin', user });
  } catch (error) {
    next(error);
  }
};

const makeFirstUserAdmin = async (req, res) => {
  try {
    const user = await User.findOne().sort({ createdAt: 1 });
    if (user) {
      user.role = 'admin';
      await user.save();
      res.json({ message: 'First user made admin', user: { id: user._id, username: user.username, role: user.role } });
    } else {
      res.status(404).json({ error: 'No users found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserSubmissions,
  getUserStats,
  getUserBadges,
  getUserContests,
  makeUserAdmin,
  makeFirstUserAdmin,
};
