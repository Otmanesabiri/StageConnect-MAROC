import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../config';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      const res = await axios.post(`${API_URL}/auth/login`, formData, config);

      if (res.data) {
        // Stockage du token dans le localStorage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userInfo', JSON.stringify(res.data.user));
        
        toast.success('Connexion réussie!');
        
        // Redirection vers la page appropriée selon le rôle
        if (res.data.user.role === 'student' || res.data.user.role === 'company') {
          navigate('/dashboard');
        } else if (res.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : 'Identifiants incorrects';
      
      toast.error(message);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center my-5">
        <Col md={5}>
          <Card className="p-4 shadow-sm">
            <h2 className="text-center mb-4">Connexion</h2>
            
            <Form onSubmit={onSubmit}>
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

              <Form.Group className="mb-4">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mb-3">
                Se connecter
              </Button>
              
              <div className="text-center mt-3">
                <div className="mb-2">
                  <Link to="/forgot-password">Mot de passe oublié?</Link>
                </div>
                <div>
                  Pas encore inscrit? <Link to="/register">Créer un compte</Link>
                </div>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
