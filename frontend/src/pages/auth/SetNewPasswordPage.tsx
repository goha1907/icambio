import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/config/supabase';
import { SetNewPasswordForm } from '@/features/auth/components/SetNewPasswordForm';
import { Button } from '@/shared/ui/Button';
import { Logo } from '@/shared/ui/Logo';
import { Loader } from '@/shared/ui/Loader';
import { Lock, Shield, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Страница установки нового пароля
 * 
 * Отвечает за:
 * - Обработку токена восстановления пароля
 * - Форму установки нового пароля
 * - Рекомендации по безопасности пароля
 * - Информацию о требованиях к паролю
 * - Дополнительные советы по безопасности
 */
export function SetNewPasswordPage() {
  const navigate = useNavigate();
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordTips, setShowPasswordTips] = useState(false);

  useEffect(() => {
    const handleRecoverySession = async () => {
      try {
        console.log('SetNewPasswordPage: Checking for recovery session...');
        console.log('SetNewPasswordPage: Full URL:', window.location.href);
        
        // Получаем параметры из URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const type = urlParams.get('type');
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        
        console.log('SetNewPasswordPage: URL params:', { 
          token: !!token, 
          type, 
          accessToken: !!accessToken, 
          refreshToken: !!refreshToken,
          allParams: Object.fromEntries(urlParams.entries())
        });
        
        // Проверяем разные форматы токенов от Supabase
        if (type === 'recovery') {
          console.log('SetNewPasswordPage: Processing recovery session...');
          
          // Случай 1: Токены напрямую в URL (новый формат Supabase)
          if (accessToken && refreshToken) {
            console.log('SetNewPasswordPage: Found access and refresh tokens in URL');
            
            try {
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              console.log('SetNewPasswordPage: Session set result:', { 
                hasSession: !!data?.session, 
                hasUser: !!data?.user,
                error 
              });
              
              if (error) {
                console.error('SetNewPasswordPage: Session set error:', error);
                toast.error('Ссылка недействительна или истекла. Запросите сброс пароля заново.');
                navigate('/reset-password');
                return;
              }
              
              if (data?.session && data?.user) {
                console.log('SetNewPasswordPage: Recovery session established via tokens');
                setIsSessionReady(true);
                return;
              }
            } catch (sessionError) {
              console.error('SetNewPasswordPage: Error setting session:', sessionError);
            }
          }
          
          // Случай 2: PKCE токен (старый формат)
          if (token) {
            console.log('SetNewPasswordPage: Processing PKCE token...');
            
            try {
              // Для recovery токенов используем verifyOtp
              const { data, error } = await supabase.auth.verifyOtp({
                token_hash: token,
                type: 'recovery'
              });
              
              console.log('SetNewPasswordPage: Token verification result:', { 
                hasSession: !!data?.session, 
                hasUser: !!data?.user,
                error 
              });
              
              if (error) {
                console.error('SetNewPasswordPage: Token verification error:', error);
                
                // Пробуем альтернативный способ - exchangeCodeForSession
                console.log('SetNewPasswordPage: Trying alternative method...');
                const { data: altData, error: altError } = await supabase.auth.exchangeCodeForSession(token);
                
                if (altError) {
                  console.error('SetNewPasswordPage: Alternative method also failed:', altError);
                  toast.error('Ссылка недействительна или истекла. Запросите сброс пароля заново.');
                  navigate('/reset-password');
                  return;
                }
                
                if (altData?.session && altData?.user) {
                  console.log('SetNewPasswordPage: Alternative method succeeded');
                  setIsSessionReady(true);
                  return;
                }
              }
              
              if (data?.session && data?.user) {
                console.log('SetNewPasswordPage: Recovery session established via token verification');
                setIsSessionReady(true);
                return;
              }
            } catch (verifyError) {
              console.error('SetNewPasswordPage: Error during token verification:', verifyError);
            }
          }
          
          // Если дошли до сюда, значит ни один способ не сработал
          console.error('SetNewPasswordPage: All recovery methods failed');
          toast.error('Не удалось обработать ссылку восстановления. Запросите сброс пароля заново.');
          navigate('/reset-password');
          return;
        } else {
          console.log('SetNewPasswordPage: No recovery token found, checking existing session...');
          
          // Проверяем существующую сессию
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          console.log('SetNewPasswordPage: Existing session check:', { 
            hasSession: !!session, 
            sessionError 
          });
          
          if (session) {
            console.log('SetNewPasswordPage: Found existing session');
            setIsSessionReady(true);
          } else {
            console.log('SetNewPasswordPage: No session found, redirecting to reset password');
            toast.error('Нет активной сессии. Запросите сброс пароля заново.');
            navigate('/reset-password');
            return;
          }
        }
      } catch (error) {
        console.error('SetNewPasswordPage: Error handling recovery session:', error);
        toast.error('Произошла ошибка. Попробуйте запросить сброс пароля заново.');
        navigate('/reset-password');
      } finally {
        setIsLoading(false);
      }
    };

    handleRecoverySession();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
        <div className="bg-card rounded-xl shadow-lg p-8 border border-border/50 text-center max-w-md w-full mx-4">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <Loader size="lg" className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Подготовка формы
          </h2>
          <p className="text-muted-foreground">
            Проверяем ссылку восстановления и подготавливаем форму установки пароля...
          </p>
        </div>
      </div>
    );
  }

  if (!isSessionReady) {
    return null; // Будет редирект, так что не показываем ничего
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="min-h-screen flex">
        {/* Левая панель с информацией (скрыта на мобильных) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-green-700 relative overflow-hidden">
          {/* Декоративные элементы */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/4 left-1/3 w-24 h-24 bg-white/5 rounded-full"></div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <Logo className="h-12 w-auto text-white" />
                <span className="ml-3 text-2xl font-bold">iCambio</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                Новый пароль
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Создайте надежный пароль для защиты вашего аккаунта
              </p>
            </div>

            {/* Требования к паролю */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🔐</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Минимум 8 символов</h3>
                  <p className="text-white/80">Чем длиннее, тем безопаснее</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🔤</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Буквы разных регистров</h3>
                  <p className="text-white/80">Заглавные и строчные буквы</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🔢</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Цифры и символы</h3>
                  <p className="text-white/80">Используйте числа и спецсимволы</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🚫</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Избегайте очевидного</h3>
                  <p className="text-white/80">Не используйте личную информацию</p>
                </div>
              </div>
            </div>

            {/* Советы по безопасности */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold mb-4">Советы по безопасности:</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-white/90">Используйте уникальный пароль</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-white/90">Включите двухфакторную аутентификацию</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-white/90">Используйте менеджер паролей</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                  <span className="text-white/90">Регулярно меняйте пароль</span>
                </div>
              </div>
            </div>

            {/* Статистика */}
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">90%</div>
                <div className="text-white/80 text-sm">Взломов из-за слабых паролей</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">99%</div>
                <div className="text-white/80 text-sm">Защита с 2FA</div>
              </div>
            </div>
          </div>
        </div>

        {/* Правая панель с основным контентом */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Логотип для мобильных */}
            <div className="text-center lg:hidden">
              <div className="flex items-center justify-center mb-4">
                <Logo className="h-10 w-auto text-emerald-600" />
                <span className="ml-2 text-xl font-bold text-emerald-600">iCambio</span>
              </div>
            </div>

            {/* Основная карточка с формой */}
            <div className="bg-card rounded-xl shadow-lg p-8 border border-border/50">
              {/* Иконка */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <Lock className="h-10 w-10 text-emerald-600" />
              </div>

              {/* Заголовок */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Установка нового пароля
                </h1>
                <p className="text-muted-foreground">
                  Создайте надежный пароль для защиты вашего аккаунта
                </p>
              </div>

              {/* Форма */}
          <SetNewPasswordForm />

              {/* Кнопка показать/скрыть советы */}
              <div className="mt-6 pt-6 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => setShowPasswordTips(!showPasswordTips)}
                  className="w-full text-sm"
                >
                  {showPasswordTips ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Скрыть советы по безопасности
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Показать советы по безопасности
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Советы по безопасности (раскрывающиеся) */}
            {showPasswordTips && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 space-y-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-3">
                  💡 Как создать надежный пароль
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700">
                      <strong>Длина:</strong> Минимум 12 символов (лучше 16+)
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700">
                      <strong>Разнообразие:</strong> Заглавные, строчные, цифры, символы
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700">
                      <strong>Избегайте:</strong> Словарные слова, даты рождения, имена
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Shield className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700">
                      <strong>Техника:</strong> Используйте фразы или аббревиатуры
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded border border-green-200">
                  <p className="text-xs text-green-700">
                    <strong>Пример хорошего пароля:</strong> "Я_Люблю_iCambio_2024!" 
                    <br />
                    <span className="text-green-600">Длинный, уникальный и легко запоминается</span>
                  </p>
                </div>
              </div>
            )}

            {/* Информация о безопасности */}
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-amber-800 mb-2">
                    ⚡ После смены пароля
                  </h3>
                  <p className="text-xs text-amber-700">
                    Все активные сессии будут завершены. Вам потребуется войти заново на всех устройствах.
                  </p>
                </div>
              </div>

              {/* Быстрые ссылки */}
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link 
                  to="/login" 
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  🔐 Вход
                </Link>
                <Link 
                  to="/faq" 
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  ❓ Помощь
                </Link>
                <Link 
                  to="/working-hours" 
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  🕒 Поддержка
                </Link>
              </div>
            </div>

            {/* Контакты поддержки */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-green-800 mb-2">
                  💬 Нужна помощь?
                </h3>
                <p className="text-xs text-green-600 mb-3">
                  Наша поддержка поможет с любыми вопросами по безопасности
                </p>
                <div className="flex justify-center space-x-4">
                  <a 
                    href="https://wa.me/5491123456789" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 transition-colors"
                  >
                    📱 WhatsApp
                  </a>
                  <a 
                    href="https://t.me/icambio_support" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 transition-colors"
                  >
                    💬 Telegram
                  </a>
                  <a 
                    href="mailto:support@icambio.com" 
                    className="text-green-600 hover:text-green-700 transition-colors"
                  >
                    ✉️ Email
                  </a>
                </div>
              </div>
            </div>

            {/* Информация о безопасности */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-purple-800 mb-2">
                  🛡️ Дополнительная защита
                </h3>
                <p className="text-xs text-purple-700 mb-3">
                  Рекомендуем настроить двухфакторную аутентификацию после входа
                </p>
                <div className="flex justify-center space-x-4 text-xs text-purple-600">
                  <span>📱 SMS</span>
                  <span>🔑 Authenticator</span>
                  <span>📧 Email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 