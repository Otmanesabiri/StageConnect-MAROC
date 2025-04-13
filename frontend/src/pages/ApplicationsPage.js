import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../config';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch user role
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setUserRole(userInfo.role);

        // Fetch applications based on role
        const endpoint =
          userInfo.role === 'student'
            ? `${API_URL}/applications/student`
            : `${API_URL}/applications/company`;

        const { data } = await axios.get(endpoint, config);
        setApplications(data);
        setLoading(false);
      } catch (error) {
        toast.error('Erreur lors du chargement des candidatures');
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (applications.length === 0) {
    return <p>Aucune candidature trouvée.</p>;
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">{userRole === 'student' ? 'Mes Candidatures' : 'Candidatures Reçues'}</h2>
      <Row>
        {applications.map((application) => (
          <Col md={6} key={application._id} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <h5>{application.internship.title}</h5>
                <p className="text-muted">
                  {userRole === 'student'
                    ? application.internship.company.companyName
                    : `${application.student.firstName} ${application.student.lastName}`}
                </p>
                <Badge bg="info" className="me-2">
                  {application.status}
                </Badge>
                <p className="mt-3">{application.coverLetter}</p>
                {userRole === 'company' && (
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={() => toast.info('Fonctionnalité à implémenter')}
                  >
                    Modifier le statut
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ApplicationsPage;
