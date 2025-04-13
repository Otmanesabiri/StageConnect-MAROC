const User = require('../models/User.model');
const Internship = require('../models/Internship.model');

// Obtenir toutes les entreprises
exports.getCompanies = async (req, res) => {
  try {
    const companies = await User.find({ role: 'company' })
      .select('-password')
      .lean();
      
    res.json(companies);
  } catch (error) {
    console.error('Erreur lors de la récupération des entreprises:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir une entreprise par ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await User.findOne({ 
      _id: req.params.id, 
      role: 'company' 
    })
    .select('-password');
    
    if (!company) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }
    
    res.json(company);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'entreprise:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir les stages d'une entreprise
exports.getCompanyInternships = async (req, res) => {
  try {
    const companyId = req.params.id;
    
    // Vérifier si l'entreprise existe
    const companyExists = await User.exists({ 
      _id: companyId, 
      role: 'company' 
    });
    
    if (!companyExists) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }
    
    // Récupérer les stages de l'entreprise
    const internships = await Internship.find({ company: companyId })
      .sort({ createdAt: -1 });
      
    res.json(internships);
  } catch (error) {
    console.error('Erreur lors de la récupération des stages:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour le profil d'une entreprise
exports.updateCompanyProfile = async (req, res) => {
  try {
    const {
      companyName,
      description,
      industry,
      website,
      location,
      phoneNumber,
      socialLinks,
    } = req.body;
    
    // Mise à jour du profil
    const updatedCompany = await User.findByIdAndUpdate(
      req.user._id,
      {
        companyName,
        description,
        industry,
        website,
        location,
        phoneNumber,
        socialLinks,
        profileCompleted: true
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedCompany) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }
    
    res.json(updatedCompany);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
