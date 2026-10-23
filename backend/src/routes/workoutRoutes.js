const express = require('express');
const router = express.Router();
const {
  getWorkouts,
  createWorkout,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  completeWorkout,
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getWorkouts).post(createWorkout);
router.route('/:id').get(getWorkoutById).put(updateWorkout).delete(deleteWorkout);
router.put('/:id/complete', completeWorkout);

module.exports = router;
