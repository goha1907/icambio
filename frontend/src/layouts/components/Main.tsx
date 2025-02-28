import { ReactNode } from 'react';

interface MainProps {
  children: ReactNode;
}

export const Main = ({ children }: MainProps) => {
  return (
    <main className="main-container">
      <div className="content-wrapper">{children}</div>
    </main>
  );
};
