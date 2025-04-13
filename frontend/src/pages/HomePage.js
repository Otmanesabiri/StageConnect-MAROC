import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const HomePage = () => {
  const [latestInternships, setLatestInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les dernières offres de stage
    const fetchLatestInternships = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/internships?limit=4`);
        setLatestInternships(data.internships);
      } catch (error) {
        console.error('Erreur lors de la récupération des stages:', error);
      }
    };

    fetchLatestInternships();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/internships?search=${searchQuery}`);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold">Trouvez votre stage idéal au Maroc</h1>
              <p className="lead mb-4">
                StageConnect Maroc connecte les étudiants avec les meilleures entreprises
                pour des opportunités de stage enrichissantes et valorisantes.
              </p>
              <Form onSubmit={handleSearch}>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Rechercher des stages (ex: développeur, marketing, Casablanca...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" variant="light" id="button-search">
                    <i className="fas fa-search"></i> Rechercher
                  </Button>
                </InputGroup>
              </Form>
              <div className="d-flex gap-2 mt-4">
                <Link to="/register" className="btn btn-light">
                  <i className="fas fa-user-plus me-2"></i> S'inscrire
                </Link>
                <Link to="/internships" className="btn btn-outline-light">
                  <i className="fas fa-list me-2"></i> Voir tous les stages
                </Link>
              </div>
            </Col>
            <Col lg={6}>
              <img
                src="https://www.undp.org/sites/g/files/zskgke326/files/migration/ma/1c00f158-9a5e-4491-9f08-167c17bc087d_UNDP-MA-jeunes-insertion.jpg"
                alt="Étudiants en stage"
                className="img-fluid rounded shadow-sm"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Featured Internships */}
      <Container className="py-5">
        <h2 className="text-center mb-4">Dernières offres de stage</h2>
        <Row>
          {latestInternships.length > 0 ? (
            latestInternships.map((internship) => (
              <Col md={6} lg={3} key={internship._id} className="mb-4">
                <Card className="h-100 shadow-sm hover-shadow">
                  <Card.Body>
                    <Card.Title>{internship.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {internship.company.companyName}
                    </Card.Subtitle>
                    <div className="mb-2">
                      <span className="badge bg-info me-2">{internship.type}</span>
                      <span className="badge bg-secondary">{internship.location.city}</span>
                    </div>
                    <Card.Text>{internship.description.substring(0, 100)}...</Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white">
                    <Link to={`/internships/${internship._id}`} className="btn btn-outline-primary btn-sm w-100">
                      Voir détails
                    </Link>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center">
              <p>Chargement des stages...</p>
            </Col>
          )}
        </Row>
        <div className="text-center mt-3">
          <Link to="/internships" className="btn btn-primary">
            Voir toutes les offres
          </Link>
        </div>
      </Container>

      {/* How it Works */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-5">Comment ça marche</h2>
          <Row className="text-center">
            <Col md={4} className="mb-4 mb-md-0">
              <div className="border border-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                <i className="fas fa-user-plus fa-2x text-primary"></i>
              </div>
              <h4>1. Créez votre compte</h4>
              <p className="text-muted">
                Inscrivez-vous en tant qu'étudiant ou entreprise et complétez votre profil.
              </p>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <div className="border border-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                <i className="fas fa-search fa-2x text-primary"></i>
              </div>
              <h4>2. Trouvez ou publiez</h4>
              <p className="text-muted">
                Étudiants: recherchez des stages. Entreprises: publiez vos offres.
              </p>
            </Col>
            <Col md={4}>
              <div className="border border-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                <i className="fas fa-handshake fa-2x text-primary"></i>
              </div>
              <h4>3. Connectez-vous</h4>
              <p className="text-muted">
                Postulez aux offres ou recrutez les meilleurs talents pour votre entreprise.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Testimonials */}
      <Container className="py-5">
        <h2 className="text-center mb-4">Témoignages</h2>
        <Row>
          <Col md={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex mb-3">
                  <div className="flex-shrink-0">
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Profil étudiant"
                      className="rounded-circle"
                      width="60"
                    />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5 className="mb-0">Amina Benali</h5>
                    <p className="text-muted">Étudiante en informatique, ENSIAS</p>
                  </div>
                </div>
                <p className="fst-italic">
                  "Grâce à StageConnect Maroc, j'ai trouvé un stage PFE dans une entreprise internationale en moins de deux semaines. Le processus était simple et l'interface intuitive!"
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex mb-3">
                  <div className="flex-shrink-0">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Profil recruteur"
                      className="rounded-circle"
                      width="60"
                    />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5 className="mb-0">Karim Idrissi</h5>
                    <p className="text-muted">Responsable RH, TechMaroc</p>
                  </div>
                </div>
                <p className="fst-italic">
                  "En tant qu'entreprise, nous avons pu trouver des stagiaires motivés et talentueux. La plateforme nous permet de filtrer les candidatures et d'optimiser notre processus de recrutement."
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* CTA Section */}
      <div className="bg-primary text-white text-center py-5">
        <Container>
          <h2 className="mb-3">Prêt à décrocher le stage de vos rêves?</h2>
          <p className="lead mb-4">
            Rejoignez des milliers d'étudiants et d'entreprises déjà présents sur StageConnect Maroc
          </p>
          <Button as={Link} to="/register" variant="light" size="lg" className="me-2">
            S'inscrire maintenant
          </Button>
          <Button as={Link} to="/internships" variant="outline-light" size="lg">
            Parcourir les stages
          </Button>
        </Container>
      </div>
    </>
  );
};

export default HomePage;
