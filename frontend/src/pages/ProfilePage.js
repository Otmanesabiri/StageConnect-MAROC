import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../config';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Récupérer les informations utilisateur
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(`${API_URL}/auth/profile`, config);
        setUserInfo(data);
        setFormData(data);
      } catch (error) {
        toast.error('Erreur lors du chargement du profil');
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.put(`${API_URL}/auth/profile`, formData, config);
      setUserInfo(data);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  if (!userInfo) {
    return <p>Chargement...</p>;
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={6} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="mb-4">Mon Profil</h2>
              <Form onSubmit={handleSubmit}>
                {userInfo.role === 'student' && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Prénom</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName || ''}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </>
                )}

                {userInfo.role === 'company' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Nom de l'entreprise</Form.Label>
                    <Form.Control
                      type="text"
                      name="companyName"
                      value={formData.companyName || ''}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    disabled
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  Mettre à jour
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
