import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { Logo } from '@/shared/ui/Logo';
import { Mail, Clock, CheckCircle, RefreshCw } from 'lucide-react';

/**
 * Страница подтверждения отправки сброса пароля
 * 
 * Отвечает за:
 * - Подтверждение отправки письма для сброса пароля
 * - Инструкции по дальнейшим действиям
 * - Информацию о безопасности процесса
 * - Возможность повторной отправки
 * - Альтернативные способы восстановления
 */
export const ResetPasswordSentPage: React.FC = () => {
  const navigate = useNavigate();
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Таймер для повторной отправки
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleResendEmail = () => {
    // Здесь будет логика повторной отправки
    setEmailSent(true);
    setCanResend(false);
    setResendTimer(60);
    
    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
      setEmailSent(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
      <div className="min-h-screen flex">
        {/* Левая панель с информацией (скрыта на мобильных) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-rose-600 to-pink-700 relative overflow-hidden">
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
                Письмо отправлено!
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Проверьте вашу почту для восстановления пароля
              </p>
            </div>

            {/* Информация о процессе */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Письмо отправлено</h3>
                  <p className="text-white/80">Инструкции отправлены на ваш email</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Безопасный процесс</h3>
                  <p className="text-white/80">Ссылка действительна только 24 часа</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Быстрое восстановление</h3>
                  <p className="text-white/80">Один клик для создания нового пароля</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Защита аккаунта</h3>
                  <p className="text-white/80">Уведомления о всех попытках входа</p>
                </div>
              </div>
            </div>

            {/* Пошаговая инструкция */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold mb-4">Что делать дальше:</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-white/90">Проверьте вашу почту</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-white/90">Найдите письмо от iCambio</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-white/90">Нажмите "Сбросить пароль"</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                  <span className="text-white/90">Создайте новый пароль</span>
                </div>
              </div>
            </div>

            {/* Статистика */}
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-white/80 text-sm">Успешных восстановлений</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">&lt;3 мин</div>
                <div className="text-white/80 text-sm">Среднее время</div>
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
                <Logo className="h-10 w-auto text-rose-600" />
                <span className="ml-2 text-xl font-bold text-rose-600">iCambio</span>
              </div>
            </div>

            {/* Основная карточка */}
            <div className="bg-card rounded-xl shadow-lg p-8 border border-border/50 text-center">
              {/* Иконка */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100">
                <Mail className="h-10 w-10 text-rose-600" />
              </div>

              {/* Заголовок */}
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Письмо отправлено
              </h1>
              <p className="text-muted-foreground mb-6">
                Если указанный email зарегистрирован в системе, мы отправили инструкции по сбросу пароля
              </p>

              {/* Уведомление об отправке */}
              {emailSent && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-green-800 text-sm">Письмо отправлено повторно!</span>
                </div>
              )}

              {/* Инструкции */}
              <div className="bg-gradient-to-r from-blue-50 to-rose-50 rounded-lg p-4 border border-rose-200 mb-6">
                <h3 className="text-sm font-semibold text-rose-800 mb-2">
                  📬 Проверьте вашу почту
                </h3>
                <div className="text-xs text-rose-700 space-y-1 text-left">
                  <p>• Откройте ваш почтовый ящик</p>
                  <p>• Найдите письмо от noreply@icambio.com</p>
                  <p>• Нажмите на кнопку "Сбросить пароль"</p>
                  <p>• Если письма нет, проверьте папку "Спам"</p>
                </div>
          </div>

              {/* Кнопки действий */}
              <div className="space-y-4">
            <Button 
                  onClick={handleResendEmail}
                  disabled={!canResend}
              className="w-full"
                  variant={canResend ? "primary" : "outline"}
            >
                  {canResend ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Отправить письмо снова
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Повторная отправка через {resendTimer}с
                    </>
                  )}
            </Button>

            <Button 
              variant="outline" 
                  onClick={() => navigate('/login')}
              className="w-full"
            >
                  Вернуться к входу
            </Button>
              </div>

              {/* Дополнительные ссылки */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Помните пароль?{' '}
                  <Link 
                    to="/login" 
                    className="font-medium text-rose-600 hover:text-rose-700 transition-colors underline-offset-4 hover:underline"
                  >
                    Войти в систему
                  </Link>
                </p>
              </div>
            </div>

            {/* Информация о безопасности */}
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-amber-800 mb-2">
                    ⏰ Важная информация
                  </h3>
                  <p className="text-xs text-amber-700">
                    Ссылка для сброса пароля действительна 24 часа. После этого потребуется новый запрос.
                  </p>
                </div>
              </div>

              {/* Альтернативные способы */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">
                    🔄 Альтернативные способы
                  </h3>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p>• SMS восстановление (скоро)</p>
                    <p>• Восстановление через поддержку</p>
                    <p>• Двухфакторная аутентификация</p>
                  </div>
                </div>
              </div>

              {/* Быстрые ссылки */}
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link 
                  to="/register" 
                  className="text-muted-foreground hover:text-rose-600 transition-colors"
                >
                  📝 Регистрация
                </Link>
                <Link 
                  to="/faq" 
                  className="text-muted-foreground hover:text-rose-600 transition-colors"
                >
                  ❓ Помощь
                </Link>
                <Link 
                  to="/working-hours" 
                  className="text-muted-foreground hover:text-rose-600 transition-colors"
                >
                  🕒 Поддержка
                </Link>
              </div>
            </div>

            {/* Контакты поддержки */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-green-800 mb-2">
                  💬 Проблемы с восстановлением?
                </h3>
                <p className="text-xs text-green-600 mb-3">
                  Наша поддержка поможет восстановить доступ к аккаунту
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

            {/* Служба безопасности */}
            <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border border-red-200">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  🚨 Служба безопасности
                </h3>
                <p className="text-xs text-red-700 mb-3">
                  Подозрительная активность? Немедленно свяжитесь с нами
                </p>
                <div className="flex justify-center space-x-4">
                  <span className="text-red-600 font-medium">🔒 security@icambio.com</span>
                  <span className="text-red-600 font-medium">📞 +54 911 2345-6789</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 