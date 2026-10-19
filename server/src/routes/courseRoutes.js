const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  uploadLearningPathPdf,
  getLearningPathPdf,
  uploadAssignmentPdf,
  getAssignmentPdf,
} = require('../controllers/courseController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// PDF upload & view routes for Learning Paths and Assignments
router.post('/learning-path-pdf', uploadLearningPathPdf);
router.get('/learning-path-pdf/:pathId', getLearningPathPdf);
router.post('/assignment-pdf', uploadAssignmentPdf);
router.get('/assignment-pdf/:assignmentId', getAssignmentPdf);

router.get('/', getCourses);
router.get('/:id', getCourseById);

router.post('/', createCourse);

router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;