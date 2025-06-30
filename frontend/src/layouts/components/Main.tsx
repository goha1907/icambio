import { ReactNode } from 'react';

interface MainProps {
  children: ReactNode;
  className?: string;
}

export const Main = ({ children, className = '' }: MainProps) => {
  return (
    <main className={`flex-1 min-h-0 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 sm:py-8 lg:py-12">
        <div className="animate-fadeIn">
          {children}
        </div>
      </div>
    </main>
  );
};
