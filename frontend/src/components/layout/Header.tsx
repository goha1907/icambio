import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.ts';
import { logout } from '../../features/auth/authSlice.ts';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const [selectedBranch, setSelectedBranch] = React.useState('');

  const branches = [
    { id: 1, name: 'Москва - Центр' },
    { id: 2, name: 'Москва - Юг' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">iCambio</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Form.Select 
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="me-3"
            >
              <option value="">Выберите филиал</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </Form.Select>
            <Nav.Link as={Link} to="/branches">Филиалы</Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <NavDropdown title={user.username} id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/profile">Профиль</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders">Мои заказы</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/change-password">Сменить пароль</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Выход</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link to="/login" as={Link}>
                  Вход
                </Nav.Link>
                <Nav.Link to="/register" as={Link}>
                  Регистрация
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;