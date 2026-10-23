const Progress = require('../models/Progress');

// @route GET /api/progress
const getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id }).sort({ date: -1 }).limit(30);
    res.json({ success: true, count: progress.length, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/progress
const logProgress = async (req, res) => {
  try {
    const entry = await Progress.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/progress/stats
const getStats = async (req, res) => {
  try {
    const stats = await Progress.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: '$workoutsCompleted' },
          totalCalories: { $sum: '$totalCaloriesBurned' },
          totalTime: { $sum: '$totalWorkoutTime' },
          avgWeight: { $avg: '$weight' },
        },
      },
    ]);
    res.json({ success: true, data: stats[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProgress, logProgress, getStats };
