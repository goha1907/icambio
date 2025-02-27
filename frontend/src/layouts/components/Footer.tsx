// frontend/src/layouts/components/Footer.tsx
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Компания */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600">О компании</h3>
          <ul className="mt-4 space-y-2">
            <li><Link to="/about" className="link">О нас</Link></li>
            <li><Link to="/rules" className="link">Правила обмена</Link></li>
            <li><Link to="/aml-kyc" className="link">AML/KYC</Link></li>
          </ul>
        </div>

        {/* Контакты */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600">Контакты</h3>
          <ul className="mt-4 space-y-2">
            <li className="text-secondary">Email: info@icambio.com</li>
            <li className="text-secondary">WhatsApp: +7 XXX XXX XX XX</li>
            <li className="text-secondary">Telegram: @icambio</li>
          </ul>
        </div>
      </div>
      
      <div className="content-wrapper mt-8">
        <p className="text-center text-secondary">
          © 2024 iCambio. Все права защищены.
        </p>
      </div>
    </footer>
  );
};