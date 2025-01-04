import React from 'react';
import Header from './Header.tsx';
import Footer from './Footer.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 py-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;