import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container className="text-center py-5">
      <Row>
        <Col>
          <h1 className="display-1 text-danger">404</h1>
          <h2 className="mb-4">Page non trouvée</h2>
          <p className="text-muted mb-4">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Button as={Link} to="/" variant="primary">
            Retour à l'accueil
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
