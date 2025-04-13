const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Routes publiques
router.get('/', companyController.getCompanies);
router.get('/:id', companyController.getCompanyById);

// Routes protégées
router.get('/:id/internships', companyController.getCompanyInternships);
router.put('/profile', protect, restrictTo('company'), companyController.updateCompanyProfile);

module.exports = router;
