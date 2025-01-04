import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux.ts';
import { register, clearError } from '../features/auth/authSlice.ts';
import { FormInput } from '../components/forms/FormInput.tsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(register(formData));
    if (!result.error) {
      navigate('/login');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">Регистрация</Card.Title>
              
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <FormInput
                  label="Имя пользователя"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Введите имя пользователя"
                  required
                />
                
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Введите email"
                  required
                />
                
                <FormInput
                  label="Пароль"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Введите пароль"
                  required
                />
                
                <FormInput
                  label="Подтверждение пароля"
                  name="password2"
                  type="password"
                  value={formData.password2}
                  onChange={handleChange}
                  placeholder="Повторите пароль"
                  required
                />
                
                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-3">
                <Link to="/login" className="card-link">Уже есть аккаунт? Войти</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;