import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../config';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    firstName: '',
    lastName: '',
    companyName: '',
  });

  const { email, password, confirmPassword, role, firstName, lastName, companyName } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (role === 'student' && (!firstName || !lastName)) {
      toast.error('Veuillez renseigner votre prénom et nom');
      return;
    }

    if (role === 'company' && !companyName) {
      toast.error('Veuillez renseigner le nom de votre entreprise');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Suppression du confirmPassword avant envoi
      const { confirmPassword, ...registerData } = formData;
      
      const res = await axios.post(`${API_URL}/auth/register`, registerData, config);

      if (res.data) {
        // Stockage du token dans le localStorage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userInfo', JSON.stringify(res.data.user));
        
        toast.success('Inscription réussie!');
        
        // Redirection en fonction du rôle
        if (role === 'student') {
          navigate('/profile');
        } else if (role === 'company') {
          navigate('/profile');
        }
      }
    } catch (error) {
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : 'Une erreur est survenue lors de l\'inscription';
      
      toast.error(message);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center my-4">
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <h2 className="text-center mb-4">Créer un compte</h2>
            
            <Form onSubmit={onSubmit}>
              {/* Type de compte */}
              <Form.Group className="mb-3">
                <Form.Label>Type de compte</Form.Label>
                <div className="d-flex gap-4">
                  <Form.Check
                    type="radio"
                    name="role"
                    id="roleStudent"
                    value="student"
                    label="Étudiant"
                    checked={role === 'student'}
                    onChange={onChange}
                  />
                  <Form.Check
                    type="radio"
                    name="role"
                    id="roleCompany"
                    value="company"
                    label="Entreprise"
                    checked={role === 'company'}
                    onChange={onChange}
                  />
                </div>
              </Form.Group>

              {/* Champs spécifiques selon le type de compte */}
              {role === 'student' ? (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Prénom</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={firstName}
                        onChange={onChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={lastName}
                        onChange={onChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              ) : (
                <Form.Group className="mb-3">
                  <Form.Label>Nom de l'entreprise</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName"
                    value={companyName}
                    onChange={onChange}
                    required
                  />
                </Form.Group>
              )}

              {/* Champs communs */}
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirmer le mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mb-3">
                S'inscrire
              </Button>
              
              <div className="text-center">
                Déjà inscrit? <Link to="/login">Se connecter</Link>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
