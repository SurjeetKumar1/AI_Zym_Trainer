const express = require('express');
const router = express.Router();
const { getProgress, logProgress, getStats } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getProgress).post(logProgress);
router.get('/stats', getStats);

module.exports = router;
