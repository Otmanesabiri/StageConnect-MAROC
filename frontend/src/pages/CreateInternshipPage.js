import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../config';

const CreateInternshipPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    requirements: '',
    domain: '',
    city: '',
    address: '',
    remote: false,
    duration: '',
    startDate: '',
    applicationDeadline: '',
    isCompensated: false,
    compensation: 0,
    skills: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
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
      const { data } = await axios.post(`${API_URL}/internships`, formData, config);
      toast.success('Offre de stage créée avec succès');
      setFormData({
        title: '',
        type: '',
        description: '',
        requirements: '',
        domain: '',
        city: '',
        address: '',
        remote: false,
        duration: '',
        startDate: '',
        applicationDeadline: '',
        isCompensated: false,
        compensation: 0,
        skills: '',
      });
    } catch (error) {
      toast.error('Erreur lors de la création de l\'offre de stage');
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="mb-4">Créer une offre de stage</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Titre</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Type de stage</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="PFE">PFE</option>
                    <option value="PFA">PFA</option>
                    <option value="Stage d'observation">Stage d'observation</option>
                    <option value="Stage d'été">Stage d'été</option>
                    <option value="Autre">Autre</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Exigences</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Domaine</Form.Label>
                  <Form.Control
                    type="text"
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ville</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="remote"
                    label="Télétravail possible"
                    checked={formData.remote}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Durée</Form.Label>
                  <Form.Control
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date de début</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date limite de candidature</Form.Label>
                  <Form.Control
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="isCompensated"
                    label="Rémunération"
                    checked={formData.isCompensated}
                    onChange={handleChange}
                  />
                </Form.Group>

                {formData.isCompensated && (
                  <Form.Group className="mb-3">
                    <Form.Label>Montant de la rémunération (MAD)</Form.Label>
                    <Form.Control
                      type="number"
                      name="compensation"
                      value={formData.compensation}
                      onChange={handleChange}
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Compétences requises (séparées par des virgules)</Form.Label>
                  <Form.Control
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  Publier l'offre
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateInternshipPage;
