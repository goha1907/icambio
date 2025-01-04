import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
  size?: 'sm' | 'lg';
  variant?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'lg',
  variant = 'primary'
}) => {
  return (
    <div className="d-flex justify-content-center align-items-center p-3">
      <Spinner
        animation="border"
        role="status"
        size={size}
        variant={variant}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};