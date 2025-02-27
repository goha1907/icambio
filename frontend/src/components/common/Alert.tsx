// frontend/src/components/common/Alert.tsx
import { ReactNode } from 'react';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type: AlertType;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Alert = ({ type, children, dismissible, onDismiss }: AlertProps) => {
  const styles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200'
  };

  return (
    <div
      className={`p-4 mb-4 border rounded-lg flex justify-between items-start ${styles[type]}`}
      role="alert"
    >
      <div>{children}</div>
      
      {dismissible && (
        <button
          onClick={onDismiss}
          className="ml-4 text-sm font-medium hover:opacity-75"
          aria-label="Закрыть"
        >
          ×
        </button>
      )}
    </div>
  );
};