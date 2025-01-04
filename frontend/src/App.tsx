import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.tsx';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import { ProtectedRoute } from './components/common/ProtectedRoute.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
};

export default App;