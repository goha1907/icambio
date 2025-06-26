import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { Mail } from 'lucide-react';

export const ResetPasswordSentPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-form text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-icmop-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-icmop-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Письмо отправлено</h2>
          <p className="text-gray-500">
            Если указанный email зарегистрирован в системе, мы отправили на него
            инструкции по сбросу пароля.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-icmop-primary/5 border border-icmop-primary/20 rounded-lg p-4 text-left">
            <p className="font-semibold text-icmop-primary">
              Не получили письмо?
            </p>
            <p className="text-sm text-gray-700 mt-1">
              Проверьте папку &ldquo;Спам&rdquo; или попробуйте отправить запрос снова.
            </p>
          </div>

          <div className="flex flex-col space-y-3 pt-2">
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Вернуться к входу
            </Button>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/reset-password')}
            >
              Отправить снова
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 