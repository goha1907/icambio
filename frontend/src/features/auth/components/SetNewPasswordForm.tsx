import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { supabase } from '@/config/supabase';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Alert } from '@/shared/ui/Alert';
import toast from 'react-hot-toast';

const setNewPasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'Пароль должен содержать минимум 6 символов'),
  confirmPassword: z
    .string()
    .min(6, 'Подтверждение пароля обязательно'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

type SetNewPasswordFormData = z.infer<typeof setNewPasswordSchema>;

export const SetNewPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetNewPasswordFormData>({
    resolver: zodResolver(setNewPasswordSchema),
  });

  useEffect(() => {
    const checkRecoveryToken = async () => {
      try {
        // Получаем все параметры из URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');
        
        // Проверяем наличие ошибок от Supabase
        const error = searchParams.get('error');
        const errorCode = searchParams.get('error_code');
        const errorDescription = searchParams.get('error_description');
        
        // Также проверяем хэш-фрагменты (Supabase иногда использует их)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hashAccessToken = hashParams.get('access_token');
        const hashRefreshToken = hashParams.get('refresh_token');
        const hashType = hashParams.get('type');
        const hashError = hashParams.get('error');
        const hashErrorCode = hashParams.get('error_code');
        const hashErrorDescription = hashParams.get('error_description');
        
        // Логируем все параметры для отладки
        console.log('SetNewPassword: All URL params:', {
          query: {
            token: token?.substring(0, 20) + '...',
            type,
            access_token: access_token?.substring(0, 20) + '...',
            refresh_token: refresh_token?.substring(0, 20) + '...',
            error,
            error_code: errorCode,
            error_description: errorDescription,
          },
          hash: {
            access_token: hashAccessToken?.substring(0, 20) + '...',
            refresh_token: hashRefreshToken?.substring(0, 20) + '...',
            type: hashType,
            error: hashError,
            error_code: hashErrorCode,
            error_description: hashErrorDescription,
          },
          allQueryParams: Object.fromEntries(searchParams.entries()),
          allHashParams: Object.fromEntries(hashParams.entries()),
          fullURL: window.location.href
        });

        // Проверяем ошибки от Supabase
        const finalError = hashError || error;
        const finalErrorCode = hashErrorCode || errorCode;
        const finalErrorDescription = hashErrorDescription || errorDescription;

        if (finalError) {
          console.error('SetNewPassword: Supabase error:', {
            error: finalError,
            error_code: finalErrorCode,
            error_description: finalErrorDescription
          });

          let errorMessage = 'Недействительная или истекшая ссылка восстановления.';
          
          if (finalErrorCode === 'otp_expired') {
            errorMessage = 'Ссылка восстановления истекла. Запросите новую ссылку.';
          } else if (finalError === 'access_denied') {
            errorMessage = 'Доступ запрещен. Возможно, ссылка была уже использована или истекла.';
          } else if (finalErrorDescription) {
            // Переводим стандартные ошибки Supabase
            const decodedDescription = decodeURIComponent(finalErrorDescription);
            if (decodedDescription.includes('expired')) {
              errorMessage = 'Ссылка восстановления истекла. Запросите новую ссылку.';
            } else if (decodedDescription.includes('invalid')) {
              errorMessage = 'Недействительная ссылка восстановления.';
            }
          }

          setError(errorMessage);
          setIsValidSession(false);
          return;
        }

        // Используем токены из хэша, если они есть, иначе из query
        const finalAccessToken = hashAccessToken || access_token;
        const finalRefreshToken = hashRefreshToken || refresh_token;
        const finalType = hashType || type;

        // Проверяем, есть ли access_token и refresh_token (стандартный Supabase redirect)
        if (finalAccessToken && finalRefreshToken && finalType === 'recovery') {
          console.log('SetNewPassword: Found access_token and refresh_token, setting session');
          
          try {
            // Устанавливаем сессию с полученными токенами
            const { data, error } = await supabase.auth.setSession({
              access_token: finalAccessToken,
              refresh_token: finalRefreshToken
            });

            if (error) {
              console.error('SetNewPassword: setSession error:', error);
              setError('Не удалось установить сессию восстановления.');
              setIsValidSession(false);
            } else if (data.session) {
              console.log('SetNewPassword: Session set successfully');
              setIsValidSession(true);
            } else {
              console.log('SetNewPassword: setSession succeeded but no session');
              setError('Не удалось установить сессию.');
              setIsValidSession(false);
            }
          } catch (sessionError) {
            console.error('SetNewPassword: setSession exception:', sessionError);
            setError('Ошибка при установке сессии.');
            setIsValidSession(false);
          }
        }
        // Если есть только token (старый способ)
        else if (finalType === 'recovery' && token) {
          console.log('SetNewPassword: Found token parameter, trying verifyOtp');
          
          try {
            // Для password recovery используем verifyOtp
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'recovery'
            });

            console.log('SetNewPassword: VerifyOtp result:', { 
              hasUser: !!data.user, 
              hasSession: !!data.session,
              error: error?.message 
            });

            if (error) {
              console.error('SetNewPassword: VerifyOtp error:', error);
              setError('Недействительная или истекшая ссылка восстановления.');
              setIsValidSession(false);
            } else if (data.user && data.session) {
              console.log('SetNewPassword: Recovery token verified successfully');
              setIsValidSession(true);
            } else {
              console.log('SetNewPassword: VerifyOtp succeeded but no user/session');
              setError('Не удалось подтвердить токен восстановления.');
              setIsValidSession(false);
            }
          } catch (verifyError) {
            console.error('SetNewPassword: VerifyOtp exception:', verifyError);
            setError('Ошибка при проверке токена восстановления.');
            setIsValidSession(false);
          }
        } else {
          console.log('SetNewPassword: Invalid recovery parameters');
          setError('Недействительная ссылка восстановления.');
          setIsValidSession(false);
        }
      } catch (error) {
        console.error('SetNewPassword: General error:', error);
        setError('Произошла ошибка при проверке токена.');
        setIsValidSession(false);
      }
    };

    checkRecoveryToken();
  }, [searchParams]);

  const onSubmit = async (data: SetNewPasswordFormData) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (error) {
        const errorMessage = 'Не удалось обновить пароль. Попробуйте еще раз.';
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        // Успешно обновили пароль
        toast.success('Пароль успешно обновлен!');
        
        // Выходим из системы, чтобы пользователь вошел с новым паролем
        await supabase.auth.signOut();
        
        // Перенаправляем на страницу входа согласно требованиям
        navigate('/login');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Не удалось обновить пароль';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (isValidSession === null) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Проверка токена восстановления...</p>
      </div>
    );
  }

  if (isValidSession === false) {
    return (
      <div className="space-y-4">
        <Alert type="error">{error}</Alert>
        <Button onClick={() => navigate('/reset-password')} className="w-full">
          Запросить новую ссылку
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <Alert type="error">{error}</Alert>}
      
      <div>
        <Input
          type="password"
          label="Новый пароль"
          {...register('password')}
          error={errors.password?.message}
          placeholder="••••••••"
        />
      </div>

      <div>
        <Input
          type="password"
          label="Подтверждение пароля"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          placeholder="••••••••"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Обновление пароля...' : 'Обновить пароль'}
      </Button>
    </form>
  );
}; 