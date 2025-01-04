import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const HomePage: React.FC = () => {
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Card className="text-center py-5">
            <Card.Body>
              <h1>Добро пожаловать в iCambio</h1>
              <p className="lead">
                Ваш надежный партнер в обмене валют
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Здесь будут компоненты с курсами валют и калькулятором */}
    </Container>
  );
};

export default HomePage;