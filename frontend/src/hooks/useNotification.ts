// frontend/src/hooks/useNotification.ts
import toast from 'react-hot-toast';

export const useNotification = () => {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message)
  };
};