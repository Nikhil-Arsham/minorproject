const Contest = require("../models/Contest");
const Submission = require("../models/Submission");
const getAllContests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const now = new Date();
    const query = {};
    if (status === "active") query.endTime = { $gte: now };
    else if (status === "past") query.endTime = { $lt: now };
    const contests = await Contest.find(query)
      .populate("challenges", "title")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();
    const total = await Contest.countDocuments(query);
    // Add title for frontend compatibility
    const contestsWithTitle = contests.map(contest => ({ ...contest, title: contest.name }));
    res.status(200).json({
      contests: contestsWithTitle,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getContestById = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate("challenges", "title description difficulty points")
      .lean();
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    // If user is authenticated, include progress
    if (req.user) {
      const userSubmissions = await Submission.find({
        userId: req.user.id,
        contestId: req.params.id
      }).select('challengeId status').lean();

      // Create a map of challengeId to status
      const progressMap = {};
      userSubmissions.forEach(sub => {
        if (!progressMap[sub.challengeId]) {
          progressMap[sub.challengeId] = { attempted: true, solved: false };
        }
        if (sub.status === 'accepted') {
          progressMap[sub.challengeId].solved = true;
        }
      });

      // Add progress to challenges
      contest.challenges = contest.challenges.map(challenge => ({
        ...challenge,
        id: challenge._id,
        solved: progressMap[challenge._id]?.solved || false,
        attempted: progressMap[challenge._id]?.attempted || false
      }));
    }

    res.status(200).json(contest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createContest = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    const contest = new Contest({
      ...req.body,
      createdBy: req.user.id,
    });
    await contest.save();
    res.status(201).json(contest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateContest = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    const contest = await Contest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }
    res.status(200).json({ ...contest, title: contest.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteContest = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    const contest = await Contest.findByIdAndDelete(req.params.id);
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }
    res.status(200).json({ message: "Contest deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getContestLeaderboard = async (req, res) => {
  try {
    const { id } = req.params;
    const contest = await Contest.findById(id).lean();
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const submissions = await Submission.aggregate([
      { $match: { contestId: contest._id, status: "accepted" } },
      {
        $group: {
          _id: "$userId",
          totalScore: { $sum: "$score" },
          lastSubmission: { $max: "$submittedAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          username: "$user.username",
          name: "$user.profile.name",
          country: "$user.profile.country",
          totalScore: 1,
          lastSubmission: 1,
        },
      },
      { $sort: { totalScore: -1, lastSubmission: 1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
    ]);
    const total = await Submission.distinct("userId", { contestId: contest._id, status: "accepted" }).then(
      (users) => users.length
    );
    res.status(200).json({
      leaderboard: submissions.map((entry, index) => ({
        rank: (page - 1) * limit + index + 1,
        ...entry,
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllContests,
  getContestById,
  createContest,
  updateContest,
  deleteContest,
  getContestLeaderboard,
};