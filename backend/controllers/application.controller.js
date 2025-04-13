const Application = require('../models/Application.model');
const Internship = require('../models/Internship.model');

// Créer une nouvelle candidature
exports.createApplication = async (req, res) => {
  try {
    const internshipId = req.params.internshipId;
    const studentId = req.user._id;
    const { coverLetter, cvUrl } = req.body;
    
    // Vérifier si l'offre de stage existe
    const internship = await Internship.findById(internshipId);
    
    if (!internship) {
      return res.status(404).json({ message: 'Stage non trouvé' });
    }
    
    // Vérifier si le stage est toujours ouvert
    if (internship.status !== 'open') {
      return res.status(400).json({ 
        message: 'Ce stage n\'accepte plus de candidatures' 
      });
    }
    
    // Vérifier si l'étudiant a déjà postulé
    const existingApplication = await Application.findOne({
      student: studentId,
      internship: internshipId
    });
    
    if (existingApplication) {
      return res.status(400).json({ 
        message: 'Vous avez déjà postulé à ce stage' 
      });
    }
    
    // Vérifier si le nombre maximal de candidatures est atteint
    if (internship.maxApplications && 
        internship.applicationsCount >= internship.maxApplications) {
      return res.status(400).json({ 
        message: 'Le nombre maximum de candidatures pour ce stage a été atteint' 
      });
    }
    
    // Créer la candidature
    const newApplication = new Application({
      student: studentId,
      internship: internshipId,
      coverLetter,
      cvUrl,
      status: 'pending'
    });
    
    const application = await newApplication.save();
    
    // Mettre à jour le compteur de candidatures de l'offre
    await Internship.findByIdAndUpdate(
      internshipId,
      { $inc: { applicationsCount: 1 } }
    );
    
    res.status(201).json({
      message: 'Candidature envoyée avec succès',
      application
    });
  } catch (error) {
    console.error('Erreur lors de la création de la candidature:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir toutes les candidatures d'une entreprise
exports.getCompanyApplications = async (req, res) => {
  try {
    // Récupérer les IDs de stage de l'entreprise
    const companyInternships = await Internship.find({ company: req.user._id })
      .select('_id');
    
    const internshipIds = companyInternships.map(internship => internship._id);
    
    // Récupérer les candidatures pour ces stages
    const applications = await Application.find({ 
      internship: { $in: internshipIds } 
    })
      .populate('student', '-password')
      .populate('internship')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Erreur lors de la récupération des candidatures:', error);
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

// Obtenir une candidature par ID
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('student', '-password')
      .populate({
        path: 'internship',
        populate: { path: 'company', select: '-password' }
      });
    
    if (!application) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    
    // Vérifier que l'utilisateur a le droit de voir cette candidature
    const isStudent = req.user.role === 'student' && 
                     application.student._id.toString() === req.user._id.toString();
    
    const isCompany = req.user.role === 'company' && 
                     application.internship.company._id.toString() === req.user._id.toString();
    
    if (!isStudent && !isCompany) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à consulter cette candidature' 
      });
    }
    
    res.json(application);
  } catch (error) {
    console.error('Erreur lors de la récupération de la candidature:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour le statut d'une candidature
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    
    if (!status || !['pending', 'accepted', 'rejected', 'interview', 'withdrawn'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }
    
    const application = await Application.findById(req.params.id)
      .populate('internship');
      
    if (!application) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    
    // Vérifier que l'entreprise est bien propriétaire du stage
    if (application.internship.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à modifier cette candidature' 
      });
    }
    
    application.status = status;
    
    if (feedback) {
      application.feedback = feedback;
    }
    
    await application.save();
    
    res.json({
      message: 'Statut de candidature mis à jour avec succès',
      application
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Retirer une candidature (par l'étudiant)
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    
    // Vérifier que l'étudiant est bien propriétaire de la candidature
    if (application.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à retirer cette candidature' 
      });
    }
    
    // Mettre à jour le statut
    application.status = 'withdrawn';
    await application.save();
    
    res.json({
      message: 'Candidature retirée avec succès',
      application
    });
  } catch (error) {
    console.error('Erreur lors du retrait de la candidature:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
