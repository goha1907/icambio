import { ReactNode } from 'react';

// Общий контейнер карточки
interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>{children}</div>;
};

// Заголовок карточки
interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  return <div className={`mb-6 ${className}`}>{children}</div>;
};

// Заголовок
interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export const CardTitle = ({ children, className = '' }: CardTitleProps) => {
  return <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h3>;
};

// Описание под заголовком
interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const CardDescription = ({ children, className = '' }: CardDescriptionProps) => {
  return <p className={`mt-1 text-sm text-gray-600 ${className}`}>{children}</p>;
};

// Основной контент
interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent = ({ children, className = '' }: CardContentProps) => {
  return <div className={className}>{children}</div>;
};

// Нижняя часть карточки
interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className = '' }: CardFooterProps) => {
  return <div className={`mt-6 ${className}`}>{children}</div>;
};
