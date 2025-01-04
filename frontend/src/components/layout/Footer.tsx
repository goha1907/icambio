import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4}>
            <h5>О компании</h5>
            <ul className="list-unstyled">
              <li><Link to="/about">О нас</Link></li>
              <li><Link to="/branches">Филиалы</Link></li>
              <li><Link to="/exchange-rules">Правила обмена</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Контакты</h5>
            <ul className="list-unstyled">
              <li>Телефон: +7 (XXX) XXX-XX-XX</li>
              <li>Email: info@icambio.com</li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Мы в соцсетях</h5>
            <div className="social-links">
              <a href="#" className="me-2">Telegram</a>
              <a href="#" className="me-2">WhatsApp</a>
              <a href="#" className="me-2">Instagram</a>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <small>&copy; {new Date().getFullYear()} iCambio. Все права защищены.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;