const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internship.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Routes publiques
router.get('/', internshipController.getInternships);
router.get('/:id', internshipController.getInternshipById);
router.get('/search', internshipController.searchInternships);

// Routes protégées pour les entreprises
router.post('/', protect, restrictTo('company'), internshipController.createInternship);
router.put('/:id', protect, restrictTo('company'), internshipController.updateInternship);
router.delete('/:id', protect, restrictTo('company'), internshipController.deleteInternship);
router.patch('/:id/status', protect, restrictTo('company'), internshipController.updateInternshipStatus);

module.exports = router;
