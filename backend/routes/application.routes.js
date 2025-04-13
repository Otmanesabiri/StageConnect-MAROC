const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Routes pour les étudiants
router.post('/:internshipId', protect, restrictTo('student'), applicationController.createApplication);
router.get('/student', protect, restrictTo('student'), applicationController.getStudentApplications);
router.delete('/:id', protect, restrictTo('student'), applicationController.withdrawApplication);

// Routes pour les entreprises
router.get('/company', protect, restrictTo('company'), applicationController.getCompanyApplications);
router.get('/:id', protect, applicationController.getApplicationById);
router.patch('/:id/status', protect, restrictTo('company'), applicationController.updateApplicationStatus);

module.exports = router;
