import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les informations utilisateur du localStorage au chargement
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const logoutHandler = () => {
    // Supprimer les informations d'authentification
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    
    // Rediriger vers la page d'accueil
    navigate('/');
  };

  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect className="py-2">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="fw-bold">
              <i className="fas fa-briefcase me-2"></i>
              StageConnect Maroc
            </Navbar.Brand>
          </LinkContainer>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/internships">
                <Nav.Link>
                  <i className="fas fa-search me-1"></i> Stages
                </Nav.Link>
              </LinkContainer>
              
              {userInfo ? (
                <>
                  {userInfo.role === 'company' && (
                    <LinkContainer to="/create-internship">
                      <Nav.Link>
                        <i className="fas fa-plus-circle me-1"></i> Publier une offre
                      </Nav.Link>
                    </LinkContainer>
                  )}
                  
                  <LinkContainer to="/dashboard">
                    <Nav.Link>
                      <i className="fas fa-chart-line me-1"></i> Tableau de bord
                    </Nav.Link>
                  </LinkContainer>
                  
                  <NavDropdown 
                    title={
                      userInfo.role === 'company' 
                        ? userInfo.companyName 
                        : `${userInfo.firstName} ${userInfo.lastName}`
                    } 
                    id="username"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>
                        <i className="fas fa-user me-2"></i> Profil
                      </NavDropdown.Item>
                    </LinkContainer>
                    
                    <LinkContainer to="/applications">
                      <NavDropdown.Item>
                        <i className="fas fa-file-alt me-2"></i>
                        {userInfo.role === 'company' ? 'Candidatures reçues' : 'Mes candidatures'}
                      </NavDropdown.Item>
                    </LinkContainer>
                    
                    <NavDropdown.Divider />
                    
                    <NavDropdown.Item onClick={logoutHandler}>
                      <i className="fas fa-sign-out-alt me-2"></i> Déconnexion
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <i className="fas fa-sign-in-alt me-1"></i> Connexion
                    </Nav.Link>
                  </LinkContainer>
                  
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <i className="fas fa-user-plus me-1"></i> Inscription
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
