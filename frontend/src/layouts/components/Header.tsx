import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { UserMenu } from '@/features/profile/components/UserMenu';

export const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link nav-link-active' : 'nav-link';
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="text-xl font-bold text-blue-600">
            iCambio
          </Link>
          <Link to="/exchange" className={isActive('/exchange')}>
            Заказать обмен
          </Link>
          {/* <Link to="/aml-kyc" className={isActive('/aml-kyc')}>
            AML/KYC
          </Link> */}
        </div>
        <div className="header-right">
          {isAuthenticated && user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link to="/login" className="btn-primary">
                Вход
              </Link>
              <Link to="/register" className="btn-primary">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
