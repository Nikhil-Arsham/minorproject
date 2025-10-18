const Badge = require('../models/Badge');

const createBadge = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const badge = new Badge(req.body);
    await badge.save();
    res.status(201).json(badge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBadges = async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBadgeById = async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    if (!badge) {
      return res.status(404).json({ error: 'Badge not found' });
    }
    res.json(badge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBadge = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const badge = await Badge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!badge) {
      return res.status(404).json({ error: 'Badge not found' });
    }
    res.json(badge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteBadge = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const badge = await Badge.findByIdAndDelete(req.params.id);
    if (!badge) {
      return res.status(404).json({ error: 'Badge not found' });
    }
    res.json({ message: 'Badge deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const seedBadges = async (req, res) => {
  try {
    // Temporarily allow seeding without admin check

    const defaultBadges = [
      // Problem solving badges
      { name: 'First Steps', description: 'Solve your first problem', icon: '🎯', criteria: { type: 'problems_solved', value: 1 }, rarity: 'Common' },
      { name: 'Problem Solver', description: 'Solve 10 problems', icon: '🧠', criteria: { type: 'problems_solved', value: 10 }, rarity: 'Common' },
      { name: 'Code Warrior', description: 'Solve 25 problems', icon: '⚔️', criteria: { type: 'problems_solved', value: 25 }, rarity: 'Rare' },
      { name: 'Algorithm Master', description: 'Solve 50 problems', icon: '👑', criteria: { type: 'problems_solved', value: 50 }, rarity: 'Epic' },
      { name: 'Legend', description: 'Solve 100 problems', icon: '⭐', criteria: { type: 'problems_solved', value: 100 }, rarity: 'Legendary' },

      // Difficulty badges
      { name: 'Easy Rider', description: 'Solve 10 easy problems', icon: '🟢', criteria: { type: 'difficulty_mastery', value: 10, difficulty: 'Easy' }, rarity: 'Common' },
      { name: 'Medium Master', description: 'Solve 10 medium problems', icon: '🟡', criteria: { type: 'difficulty_mastery', value: 10, difficulty: 'Medium' }, rarity: 'Rare' },
      { name: 'Hard Hero', description: 'Solve 5 hard problems', icon: '🔴', criteria: { type: 'difficulty_mastery', value: 5, difficulty: 'Hard' }, rarity: 'Epic' },

      // Streak badges
      { name: 'Consistent', description: 'Maintain a 7-day streak', icon: '🔥', criteria: { type: 'streak', value: 7 }, rarity: 'Rare' },
      { name: 'Unstoppable', description: 'Maintain a 30-day streak', icon: '🚀', criteria: { type: 'streak', value: 30 }, rarity: 'Epic' },

      // Rating badges
      { name: 'Rising Star', description: 'Reach 1500 rating', icon: '🌟', criteria: { type: 'problems_solved', value: 1 }, rarity: 'Rare' }, // This should be rating-based, but using problems_solved for now
    ];

    const createdBadges = await Badge.insertMany(defaultBadges);
    res.status(201).json({ message: 'Badges seeded successfully', badges: createdBadges });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBadge,
  getBadges,
  getBadgeById,
  updateBadge,
  deleteBadge,
  seedBadges
};