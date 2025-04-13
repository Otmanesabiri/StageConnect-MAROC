import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>StageConnect Maroc</h5>
            <p className="text-muted">
              Plateforme connectant les étudiants marocains avec des opportunités de stage dans tout le Royaume.
            </p>
          </Col>
          
          <Col md={3} className="mb-3 mb-md-0">
            <h5>Liens utiles</h5>
            <ul className="list-unstyled">
              <li className="mb-1">
                <Link to="/internships" className="text-decoration-none text-muted">
                  Offres de stage
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/register" className="text-decoration-none text-muted">
                  Créer un compte
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/login" className="text-decoration-none text-muted">
                  Se connecter
                </Link>
              </li>
            </ul>
          </Col>
          
          <Col md={3} className="mb-3 mb-md-0">
            <h5>Ressources</h5>
            <ul className="list-unstyled">
              <li className="mb-1">
                <Link to="/faq" className="text-decoration-none text-muted">
                  FAQ
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/contact" className="text-decoration-none text-muted">
                  Contact
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/about" className="text-decoration-none text-muted">
                  À propos
                </Link>
              </li>
            </ul>
          </Col>
          
          <Col md={2}>
            <h5>Nous suivre</h5>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-light">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-light">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-light">
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
            </div>
          </Col>
        </Row>
        
        <hr className="my-3 bg-secondary" />
        
        <Row>
          <Col className="text-center text-muted">
            <small>&copy; {new Date().getFullYear()} StageConnect Maroc. Tous droits réservés.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
