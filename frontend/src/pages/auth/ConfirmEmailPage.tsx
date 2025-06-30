import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { Logo } from '@/shared/ui/Logo';
import { MailCheck, Clock, RefreshCw, CheckCircle } from 'lucide-react';

/**
 * Страница подтверждения электронной почты
 * 
 * Отвечает за:
 * - Информирование пользователя о необходимости подтверждения email
 * - Инструкции по поиску письма и действиям
 * - Возможность повторной отправки письма
 * - Таймер для повторной отправки
 * - Дополнительные советы и поддержка
 */
export const ConfirmEmailPage: React.FC = () => {
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
    // Здесь будет логика повторной отправки email
    setEmailSent(true);
    setCanResend(false);
    setResendTimer(60);
    
    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
      setEmailSent(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      <div className="min-h-screen flex">
        {/* Левая панель с информацией (скрыта на мобильных) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-600 to-blue-700 relative overflow-hidden">
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
                Почти готово!
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Осталось только подтвердить ваш email адрес
              </p>
            </div>

            {/* Преимущества подтверждения */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Безопасность аккаунта</h3>
                  <p className="text-white/80">Защита от несанкционированного доступа</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Важные уведомления</h3>
                  <p className="text-white/80">Получайте информацию о транзакциях</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Восстановление доступа</h3>
                  <p className="text-white/80">Возможность сброса пароля</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Отчеты и аналитика</h3>
                  <p className="text-white/80">Ежемесячные отчеты по операциям</p>
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
                  <span className="text-white/90">Нажмите на ссылку</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                  <span className="text-white/90">Войдите в систему</span>
                </div>
              </div>
            </div>

            {/* Статистика */}
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-white/80 text-sm">Писем доставляется</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">&lt;2 мин</div>
                <div className="text-white/80 text-sm">Время доставки</div>
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
                <Logo className="h-10 w-auto text-cyan-600" />
                <span className="ml-2 text-xl font-bold text-cyan-600">iCambio</span>
              </div>
            </div>

            {/* Основная карточка */}
            <div className="bg-card rounded-xl shadow-lg p-8 border border-border/50 text-center">
              {/* Иконка */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-100">
                <MailCheck className="h-10 w-10 text-cyan-600" />
              </div>

              {/* Заголовок */}
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Подтвердите ваш email
              </h1>
              <p className="text-muted-foreground mb-6">
                Мы отправили письмо с подтверждением на ваш email адрес
              </p>

              {/* Уведомление об отправке */}
              {emailSent && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-green-800 text-sm">Письмо отправлено повторно!</span>
                </div>
              )}

              {/* Инструкции */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200 mb-6">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">
                  📬 Проверьте вашу почту
                </h3>
                <div className="text-xs text-blue-700 space-y-1 text-left">
                  <p>• Откройте ваш почтовый ящик</p>
                  <p>• Найдите письмо от noreply@icambio.com</p>
                  <p>• Нажмите на кнопку "Подтвердить email"</p>
                  <p>• Если письма нет, проверьте папку "Спам"</p>
                </div>
          </div>

              {/* Кнопки действий */}
              <div className="space-y-4">
            <Button
                  onClick={handleResendEmail}
                  disabled={!canResend}
              className="w-full"
                  variant={canResend ? "default" : "outline"}
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
                  Перейти к входу
            </Button>
              </div>

              {/* Дополнительные ссылки */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Нужна помощь?{' '}
                  <Link 
                    to="/faq" 
                    className="font-medium text-cyan-600 hover:text-cyan-700 transition-colors underline-offset-4 hover:underline"
                  >
                    Частые вопросы
                  </Link>
                </p>
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                    ⏰ Срок действия ссылки
                  </h3>
                  <p className="text-xs text-yellow-700">
                    Ссылка для подтверждения действительна 24 часа. После этого потребуется запросить новую.
                  </p>
                </div>
              </div>

              {/* Быстрые ссылки */}
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link 
                  to="/register" 
                  className="text-muted-foreground hover:text-cyan-600 transition-colors"
                >
                  📝 Регистрация
                </Link>
                <Link 
                  to="/faq" 
                  className="text-muted-foreground hover:text-cyan-600 transition-colors"
                >
                  ❓ Помощь
                </Link>
                <Link 
                  to="/working-hours" 
                  className="text-muted-foreground hover:text-cyan-600 transition-colors"
                >
                  🕒 Поддержка
                </Link>
              </div>
            </div>

            {/* Контакты поддержки */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-green-800 mb-2">
                  💬 Проблемы с подтверждением?
                </h3>
                <p className="text-xs text-green-600 mb-3">
                  Наша поддержка поможет активировать ваш аккаунт
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
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  🛡️ Безопасность превыше всего
                </h3>
                <div className="flex justify-center space-x-4 text-xs text-gray-600">
                  <span>🔐 Защищенные ссылки</span>
                  <span>⏰ Ограниченное время</span>
                  <span>✅ Проверенные домены</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 