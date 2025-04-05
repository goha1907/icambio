import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = '' }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img 
        src="/logo.jpeg" 
        alt="iCambio" 
        className="h-12 sm:h-14 w-auto object-contain py-1"
      />
    </Link>
  );
}; 