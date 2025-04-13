const User = require('../models/User.model');
const Application = require('../models/Application.model');

// Obtenir un étudiant par ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await User.findOne({ 
      _id: req.params.id, 
      role: 'student' 
    })
    .select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'étudiant:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour le profil d'un étudiant
exports.updateStudentProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      education,
      skills,
      experience,
      bio,
      phoneNumber,
      address,
      socialLinks,
    } = req.body;
    
    // Préparation des données
    let updateData = {
      firstName,
      lastName,
      education,
      experience,
      bio,
      phoneNumber,
      address,
      profileCompleted: true
    };
    
    // Traiter les compétences si elles sont fournies
    if (skills) {
      if (typeof skills === 'string') {
        updateData.skills = skills.split(',').map(skill => skill.trim());
      } else if (Array.isArray(skills)) {
        updateData.skills = skills;
      }
    }
    
    // Traiter les liens sociaux
    if (socialLinks) {
      updateData.socialLinks = socialLinks;
    }
    
    // Mise à jour du profil
    const updatedStudent = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    
    res.json(updatedStudent);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Télécharger un CV
exports.uploadCV = async (req, res) => {
  try {
    // Cette fonction nécessiterait une implémentation de téléchargement de fichiers
    // Généralement avec multer ou une autre bibliothèque similaire
    
    // Pour cette première version, simulons un téléchargement réussi
    const cvUrl = req.body.cvUrl || null;
    
    if (!cvUrl) {
      return res.status(400).json({ message: 'Aucun CV fourni' });
    }
    
    const updatedStudent = await User.findByIdAndUpdate(
      req.user._id,
      { cvUrl },
      { new: true }
    ).select('-password');
    
    res.json({
      message: 'CV téléchargé avec succès',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement du CV:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir le tableau de bord d'un étudiant
exports.getStudentDashboard = async (req, res) => {
  try {
    // Récupérer les candidatures de l'étudiant
    const applications = await Application.find({ student: req.user._id })
      .populate({
        path: 'internship',
        populate: { path: 'company', select: 'companyName' }
      })
      .sort({ createdAt: -1 });
    
    // Calculer les statistiques
    const stats = {
      totalApplications: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      interviews: applications.filter(app => app.status === 'interview').length,
    };
    
    // Vérifier si le profil est complet
    const profileCompleted = req.user.profileCompleted || false;
    
    res.json({
      stats,
      recentApplications: applications.slice(0, 5),
      profileCompleted
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du tableau de bord:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir toutes les candidatures d'un étudiant
exports.getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate({
        path: 'internship',
        populate: { path: 'company', select: 'companyName' }
      })
      .sort({ updatedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Erreur lors de la récupération des candidatures:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
