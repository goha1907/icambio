import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux.ts';
import { login } from '../features/auth/authSlice.ts';
import { FormInput } from '../components/forms/FormInput.tsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';

const LoginPage: React.FC = () => {
  // const { token } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (token) {
  //     navigate('/', { replace: true });
  //   }
  // }, [token, navigate]);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const dispatch = useAppDispatch();

  const { isLoading, error } = useAppSelector(state => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(login(formData)).unwrap();
      if (result) {
        navigate('/');  // Редирект на главную после успешного входа
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
              <Card.Title className="text-center mb-4">Вход в систему</Card.Title>
              
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
                />
                
                <FormInput
                  label="Пароль"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Введите пароль"
                />
                
                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Вход...' : 'Войти'}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-3">
                <Link to="/register" className="card-link">Регистрация</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;