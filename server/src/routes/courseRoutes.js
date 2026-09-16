const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', getCourses);
router.get('/:id', getCourseById);

router.post('/', createCourse);

router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;