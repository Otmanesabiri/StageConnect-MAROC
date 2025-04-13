const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Routes publiques
router.get('/:id', studentController.getStudentById);

// Routes protégées
router.put('/profile', protect, restrictTo('student'), studentController.updateStudentProfile);
router.post('/cv', protect, restrictTo('student'), studentController.uploadCV);
router.get('/dashboard', protect, restrictTo('student'), studentController.getStudentDashboard);
router.get('/applications', protect, restrictTo('student'), studentController.getStudentApplications);

module.exports = router;
