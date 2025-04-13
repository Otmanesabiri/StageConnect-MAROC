const Internship = require('../models/Internship.model');

// Obtenir toutes les offres de stage (avec filtres)
exports.getInternships = async (req, res) => {
  try {
    const { 
      type, 
      domain, 
      city, 
      isCompensated, 
      remote,
      page = 1,
      limit = 10,
      sort = '-createdAt',
      status = 'open'
    } = req.query;

    const query = { status };

    // Appliquer les filtres si fournis
    if (type) query.type = type;
    if (domain) query.domain = domain;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (isCompensated) query.isCompensated = isCompensated === 'true';
    if (remote) query['location.remote'] = remote === 'true';

    // Pagination
    const skip = (page - 1) * limit;

    // Exécuter la requête
    const internships = await Internship.find(query)
      .populate('company', 'companyName email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Compter le nombre total de stages correspondants
    const total = await Internship.countDocuments(query);

    res.json({
      internships,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des stages:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir un stage par ID
exports.getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('company', 'companyName email location description');

    if (!internship) {
      return res.status(404).json({ message: 'Stage non trouvé' });
    }

    res.json(internship);
  } catch (error) {
    console.error('Erreur lors de la récupération du stage:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Rechercher des stages
exports.searchInternships = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Requête de recherche manquante' });
    }
    
    const internships = await Internship.find(
      { $text: { $search: q }, status: 'open' },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .populate('company', 'companyName');
    
    res.json(internships);
  } catch (error) {
    console.error('Erreur lors de la recherche de stages:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Créer une nouvelle offre de stage
exports.createInternship = async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      requirements,
      location,
      domain,
      duration,
      startDate,
      endDate,
      isCompensated,
      compensation,
      skills,
      applicationDeadline,
      status = 'open',
      maxApplications
    } = req.body;

    const newInternship = new Internship({
      title,
      company: req.user._id,
      type,
      description,
      requirements,
      location,
      domain,
      duration,
      startDate,
      endDate,
      isCompensated,
      compensation,
      skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
      applicationDeadline,
      status,
      maxApplications
    });

    const internship = await newInternship.save();
    res.status(201).json(internship);
  } catch (error) {
    console.error('Erreur lors de la création du stage:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour une offre de stage
exports.updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: 'Stage non trouvé' });
    }

    // Vérifier que l'utilisateur actuel est bien le propriétaire du stage
    if (internship.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé à modifier ce stage' });
    }

    // Convertir les skills en tableau si fourni
    if (req.body.skills && typeof req.body.skills === 'string') {
      req.body.skills = req.body.skills.split(',').map(skill => skill.trim());
    }

    const updatedInternship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedInternship);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du stage:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une offre de stage
exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: 'Stage non trouvé' });
    }

    // Vérifier que l'utilisateur actuel est bien le propriétaire du stage
    if (internship.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce stage' });
    }

    await internship.remove();
    res.json({ message: 'Stage supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du stage:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour le statut d'une offre de stage
exports.updateInternshipStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['open', 'closed', 'draft'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }
    
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: 'Stage non trouvé' });
    }

    // Vérifier que l'utilisateur actuel est bien le propriétaire du stage
    if (internship.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé à modifier ce stage' });
    }

    internship.status = status;
    await internship.save();
    
    res.json({ message: 'Statut mis à jour avec succès', internship });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
