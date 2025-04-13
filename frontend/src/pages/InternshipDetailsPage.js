import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config';
import { toast } from 'react-toastify';

const InternshipDetailsPage = () => {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/internships/${id}`);
        setInternship(data);
        setLoading(false);
      } catch (error) {
        toast.error('Erreur lors du chargement des détails du stage');
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!internship) {
    return <p>Stage non trouvé.</p>;
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2>{internship.title}</h2>
              <p className="text-muted">
                <i className="fas fa-building me-2"></i>
                {internship.company.companyName}
              </p>
              <div className="mb-3">
                <Badge bg="info" className="me-2">{internship.type}</Badge>
                <Badge bg="secondary" className="me-2">{internship.domain}</Badge>
                {internship.isCompensated && <Badge bg="success">Rémunéré</Badge>}
              </div>
              <p>{internship.description}</p>
              <h5>Exigences</h5>
              <p>{internship.requirements}</p>
              <h5>Compétences requises</h5>
              <p>{internship.skills.join(', ')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Informations</h5>
              <p>
                <i className="fas fa-map-marker-alt me-2"></i>
                {internship.location.city}
              </p>
              <p>
                <i className="fas fa-calendar-alt me-2"></i>
                Début: {new Date(internship.startDate).toLocaleDateString()}
              </p>
              {internship.applicationDeadline && (
                <p>
                  <i className="fas fa-hourglass-end me-2"></i>
                  Date limite: {new Date(internship.applicationDeadline).toLocaleDateString()}
                </p>
              )}
              <p>
                <i className="fas fa-clock me-2"></i>
                Durée: {internship.duration}
              </p>
              {internship.isCompensated && (
                <p>
                  <i className="fas fa-money-bill-wave me-2"></i>
                  Compensation: {internship.compensation} MAD
                </p>
              )}
              <Button as={Link} to={`/applications/${id}`} variant="primary" className="w-100 mt-3">
                Postuler
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InternshipDetailsPage;
