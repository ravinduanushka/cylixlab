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
  submitAssignmentProgress,
  getAdminAssignmentStats,
  getStudentSubmissions,
} = require('../controllers/courseController');

const { protect, authorize } = require('../middlewares/authMiddleware');
const { conditionalUpload } = require('../middlewares/uploadMiddleware');

// PDF upload & view routes for Learning Paths and Assignments
// Supports both multipart/form-data via multer and base64 JSON payloads
router.post('/learning-path-pdf', conditionalUpload('file'), uploadLearningPathPdf);
router.get('/learning-path-pdf/:pathId', getLearningPathPdf);
router.post('/assignment-pdf', conditionalUpload('file'), uploadAssignmentPdf);
router.get('/assignment-pdf/:assignmentId', getAssignmentPdf);

// Assignment submission and admin statistics routes
router.post('/assignment-submit', submitAssignmentProgress);
router.get('/admin-assignment-stats', getAdminAssignmentStats);
router.get('/student-submissions', getStudentSubmissions);

router.get('/', getCourses);
router.get('/:id', getCourseById);

router.post('/', createCourse);

router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;
