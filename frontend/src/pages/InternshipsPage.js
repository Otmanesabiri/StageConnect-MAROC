import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    domain: '',
    city: '',
    isCompensated: '',
    remote: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Domaines d'activité pour le filtre
  const domains = [
    'Informatique et IT',
    'Ingénierie',
    'Finance et Comptabilité',
    'Marketing et Communication',
    'Commerce et Vente',
    'Ressources Humaines',
    'Santé',
    'Éducation',
    'Juridique',
    'Autre'
  ];

  // Types de stage
  const internshipTypes = [
    'PFE',
    'PFA',
    'Stage d\'observation',
    'Stage d\'été',
    'Autre'
  ];

  // Villes principales au Maroc
  const cities = [
    'Casablanca',
    'Rabat',
    'Marrakech',
    'Fès',
    'Tanger',
    'Agadir',
    'Meknès',
    'Oujda',
    'Kénitra',
    'Tétouan',
    'Layounne',
    'Essaouira',
    'El Jadida',
    'Dakhla',
    'Berkane',
    'Nador',
    'Salé',
    'Mohammedia',
    'Settat',
    'Safi',
  ];

  useEffect(() => {
    // Récupérer les offres de stage en fonction des filtres et de la page
    const fetchInternships = async () => {
      try {
        setLoading(true);
        
        const params = { page, ...filters };
        
        // Ajouter le terme de recherche s'il existe
        if (searchTerm) {
          params.q = searchTerm;
        }
        
        // Utiliser l'endpoint recherche si searchTerm est défini
        const endpoint = searchTerm 
          ? `${API_URL}/internships/search` 
          : `${API_URL}/internships`;
          
        const { data } = await axios.get(endpoint, { params });
        
        if (searchTerm) {
          // Format spécifique pour la recherche
          setInternships(data);
          setTotalPages(Math.ceil(data.length / 10)); // Approximation
        } else {
          // Format standard pour les filtres
          setInternships(data.internships);
          setTotalPages(data.pages);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des stages:', error);
        setError('Une erreur est survenue lors du chargement des stages.');
        setLoading(false);
      }
    };

    fetchInternships();
  }, [filters, page, searchTerm]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setPage(1); // Réinitialiser à la première page lors du changement de filtre
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Réinitialiser à la première page lors de la recherche
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      domain: '',
      city: '',
      isCompensated: '',
      remote: '',
    });
    setSearchTerm('');
    setPage(1);
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Offres de Stage</h1>
      
      {/* Barre de recherche */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="align-items-end">
              <Col md={10}>
                <Form.Group>
                  <Form.Label>Rechercher</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Rechercher par titre, compétence, mot-clé..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Button type="submit" variant="primary" className="w-100 mb-2">
                  <i className="fas fa-search me-2"></i>Rechercher
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      <Row>
        {/* Filtres */}
        <Col md={3}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Filtres</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                {/* Type de stage */}
                <Form.Group className="mb-3">
                  <Form.Label>Type de stage</Form.Label>
                  <Form.Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tous les types</option>
                    {internshipTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                {/* Domaine */}
                <Form.Group className="mb-3">
                  <Form.Label>Domaine</Form.Label>
                  <Form.Select
                    name="domain"
                    value={filters.domain}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tous les domaines</option>
                    {domains.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                {/* Ville */}
                <Form.Group className="mb-3">
                  <Form.Label>Ville</Form.Label>
                  <Form.Select
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                  >
                    <option value="">Toutes les villes</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                {/* Rémunération */}
                <Form.Group className="mb-3">
                  <Form.Label>Rémunération</Form.Label>
                  <Form.Select
                    name="isCompensated"
                    value={filters.isCompensated}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tous</option>
                    <option value="true">Rémunéré</option>
                    <option value="false">Non rémunéré</option>
                  </Form.Select>
                </Form.Group>
                
                {/* Remote */}
                <Form.Group className="mb-3">
                  <Form.Label>Modalité</Form.Label>
                  <Form.Select
                    name="remote"
                    value={filters.remote}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tous</option>
                    <option value="true">Télétravail possible</option>
                    <option value="false">Présentiel uniquement</option>
                  </Form.Select>
                </Form.Group>
                
                <Button
                  variant="secondary"
                  className="w-100"
                  onClick={clearFilters}
                >
                  Réinitialiser les filtres
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Liste des stages */}
        <Col md={9}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Chargement...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : internships.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x mb-3 text-muted"></i>
              <h3>Aucune offre de stage trouvée</h3>
              <p className="text-muted">
                Essayez de modifier vos critères de recherche ou consultez à nouveau plus tard.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <p className="text-muted">
                  {internships.length} résultat(s) trouvé(s)
                </p>
              </div>
              
              {internships.map((internship) => (
                <Card key={internship._id} className="mb-3 shadow-sm hover-shadow">
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <Link
                          to={`/internships/${internship._id}`}
                          className="text-decoration-none"
                        >
                          <h5 className="mb-1">{internship.title}</h5>
                        </Link>
                        <p className="text-muted mb-2">
                          {internship.company.companyName} - {internship.location.city}
                        </p>
                        <p className="mb-2">
                          {internship.description.substring(0, 150)}
                          {internship.description.length > 150 ? '...' : ''}
                        </p>
                        <div className="mb-2">
                          <Badge bg="info" className="me-1">
                            {internship.type}
                          </Badge>
                          <Badge bg="secondary" className="me-1">
                            {internship.domain}
                          </Badge>
                          {internship.isCompensated && (
                            <Badge bg="success" className="me-1">
                              Rémunéré
                            </Badge>
                          )}
                          {internship.location.remote && (
                            <Badge bg="primary" className="me-1">
                              Télétravail possible
                            </Badge>
                          )}
                        </div>
                      </Col>
                      <Col md={4} className="d-flex flex-column justify-content-between">
                        <div>
                          <p className="text-muted mb-1">
                            <i className="fas fa-calendar-alt me-2"></i>
                            {new Date(internship.startDate).toLocaleDateString()}
                          </p>
                          <p className="text-muted mb-1">
                            <i className="fas fa-clock me-2"></i>
                            {internship.duration}
                          </p>
                          {internship.applicationDeadline && (
                            <p className="text-muted">
                              <i className="fas fa-hourglass-end me-2"></i>
                              Date limite: {new Date(internship.applicationDeadline).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="text-end">
                          <Link
                            to={`/internships/${internship._id}`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            Voir détails
                          </Link>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Button
                    variant="outline-primary"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="me-2"
                  >
                    <i className="fas fa-chevron-left"></i> Précédent
                  </Button>
                  
                  <div className="mx-3 d-flex align-items-center">
                    Page {page} sur {totalPages}
                  </div>
                  
                  <Button
                    variant="outline-primary"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Suivant <i className="fas fa-chevron-right"></i>
                  </Button>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default InternshipsPage;
