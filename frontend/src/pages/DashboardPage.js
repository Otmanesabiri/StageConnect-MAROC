import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../config';
import { Bar } from 'react-chartjs-2';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
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

        // Fetch dashboard stats
        const endpoint =
          userInfo.role === 'student'
            ? `${API_URL}/students/dashboard`
            : `${API_URL}/companies/dashboard`;

        const { data } = await axios.get(endpoint, config);
        setStats(data);
      } catch (error) {
        toast.error('Erreur lors du chargement des données du tableau de bord');
      }
    };

    fetchDashboardData();
  }, []);

  if (!stats) {
    return <p>Chargement...</p>;
  }

  const chartData = {
    labels: ['En attente', 'Acceptées', 'Rejetées', 'Entretiens'],
    datasets: [
      {
        label: 'Statut des candidatures',
        data: [
          stats.pending || 0,
          stats.accepted || 0,
          stats.rejected || 0,
          stats.interviews || 0,
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
      },
    ],
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Tableau de Bord</h2>
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Total des candidatures</h5>
              <p className="display-4 text-primary">{stats.totalApplications}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Profil Complété</h5>
              <p className="display-4 text-success">
                {stats.profileCompleted ? 'Oui' : 'Non'}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Statistiques des candidatures</h5>
              <Bar data={chartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
