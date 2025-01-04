import React, { useState } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux.ts';

const ProfilePage: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  // Добавляем функцию копирования реферальной ссылки
  const handleCopyReferralLink = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      // TODO: Добавить уведомление о успешном копировании
      // Можно использовать react-toastify или bootstrap alert
    }
  };

  return (
    <Container>
      {/* Заголовок и кнопки */}
      <div className="text-center mb-4">
        <h1 className="mb-4">Профиль {user.username}</h1>
        <div className="d-flex justify-content-center gap-3">
          <Button
            variant="primary"
            onClick={() => setIsEditing(!isEditing)}
          >
            Редактировать данные
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/orders')}
          >
            История обменов
          </Button>
          <Button
            variant="success"
            onClick={() => navigate('/exchange')}
          >
            Заказать обмен
          </Button>
        </div>
      </div>

      {/* Карточка профиля */}
      <Card>
        <Card.Body>
          <Row>
            <Col md={3}>
              <div className="text-center mb-3">
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt="Avatar"
                  className="rounded-circle"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
            </Col>
            <Col md={9}>
              <Row className="mb-3">
                <Col sm={4} className="fw-bold">Никнейм:</Col>
                <Col sm={8}>{user.username}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="fw-bold">Имя:</Col>
                <Col sm={8}>{user.firstName || 'Не указано'}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="fw-bold">Фамилия:</Col>
                <Col sm={8}>{user.lastName || 'Не указано'}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="fw-bold">Email:</Col>
                <Col sm={8}>{user.email}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="fw-bold">Телефон:</Col>
                <Col sm={8}>{user.phone || 'Не указан'}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="fw-bold">Telegram:</Col>
                <Col sm={8}>{user.telegram || 'Не указан'}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="fw-bold">Реферальная ссылка:</Col>
                <Col sm={8}>
                  <div className="d-flex align-items-center">
                    <span className="me-2">{user.referralCode}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleCopyReferralLink}
                    >
                      Копировать
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4} className="fw-bold">Реферальный баланс:</Col>
                <Col sm={8}>{user.referralBalance || 0} ₽</Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;