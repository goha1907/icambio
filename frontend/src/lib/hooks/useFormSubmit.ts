import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './useNotification';

interface FormSubmitOptions<T> {
  onSubmit: (data: T) => Promise<any>;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
  redirectPath?: string;
}

export function useFormSubmit<T>({
  onSubmit,
  onSuccess,
  onError,
  successMessage,
  errorMessage,
  redirectPath
}: FormSubmitOptions<T>) {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: T) => {
    setIsSubmitting(true);
    try {
      const result = await onSubmit(data);
      
      if (successMessage) {
        success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      if (redirectPath) {
        navigate(redirectPath);
      }
      
      setIsSubmitting(false);
      return result;
    } catch (err: any) {
      setIsSubmitting(false);
      
      const errorMsg = errorMessage || err.message || 'Произошла ошибка';
      showError(errorMsg);
      
      if (onError) {
        onError(err);
      }
      
      return Promise.reject(err);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
}