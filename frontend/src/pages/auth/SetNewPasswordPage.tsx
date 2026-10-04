// TODO: Переписать компонент для работы с Django Allauth, убрать весь supabase
// Примерная логика:
// 1. Получить uid и token из URL (например, ?uid=...&token=...)
// 2. Отправить новый пароль на endpoint /auth/users/reset_password_confirm/
// 3. Обработать успех/ошибку

import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Alert } from '@/shared/ui/Alert';
import api from '@/shared/api/api';

export const SetNewPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Получаем uid и token из URL
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!uid || !token) {
      setError('Некорректная ссылка для сброса пароля.');
      return;
    }
    if (!newPassword || newPassword !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/users/reset_password_confirm/', {
        uid,
        token,
        new_password: newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка при сбросе пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Установка нового пароля</CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert variant="success">Пароль успешно изменён! Перенаправление на вход...</Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Новый пароль"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              {error && <Alert variant="destructive">{error}</Alert>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Сохраняем...' : 'Сохранить новый пароль'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 