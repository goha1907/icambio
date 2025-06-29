import React from 'react';
import { Link } from 'react-router-dom';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { Logo } from '@/shared/ui/Logo';

/**
 * Страница сброса пароля
 * 
 * Отвечает за:
 * - Общую верстку и расположение элементов на странице
 * - Заголовки и навигационные элементы
 * - Ссылки на другие страницы
 * - Поддерживающую информацию и инструкции
 * - Брендинг и визуальные элементы
 * - Дополнительные способы восстановления доступа
 */
export const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <div className="min-h-screen flex">
        {/* Левая панель с информацией о безопасности (скрыта на мобильных) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 to-amber-700 relative overflow-hidden">
          {/* Декоративные элементы */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-white/5 rounded-full"></div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <Logo className="h-12 w-auto text-white" />
                <span className="ml-3 text-2xl font-bold">iCambio</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                Восстановление пароля
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Не переживайте, мы поможем вам восстановить доступ к аккаунту
              </p>
            </div>

            {/* Информация о процессе */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Быстрое восстановление</h3>
                  <p className="text-white/80">Получите ссылку на email за секунды</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Безопасность</h3>
                  <p className="text-white/80">Ссылка действительна только 24 часа</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Простота</h3>
                  <p className="text-white/80">Один клик для создания нового пароля</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Защита аккаунта</h3>
                  <p className="text-white/80">Ваши средства всегда под защитой</p>
                </div>
              </div>
            </div>

            {/* Пошаговый процесс */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold mb-4">Как это работает:</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-white/90">Введите email адрес</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-white/90">Проверьте почту</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-white/90">Перейдите по ссылке</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                  <span className="text-white/90">Создайте новый пароль</span>
                </div>
              </div>
            </div>

            {/* Статистика безопасности */}
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-white/80 text-sm">Успешных восстановлений</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">&lt;5 мин</div>
                <div className="text-white/80 text-sm">Среднее время</div>
              </div>
            </div>
          </div>
        </div>

        {/* Правая панель с формой */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Логотип для мобильных */}
            <div className="text-center lg:hidden">
              <div className="flex items-center justify-center mb-4">
                <Logo className="h-10 w-auto text-orange-600" />
                <span className="ml-2 text-xl font-bold text-orange-600">iCambio</span>
              </div>
            </div>

            {/* Заголовок страницы */}
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Забыли пароль?
              </h1>
              <p className="mt-2 text-muted-foreground">
                Введите ваш email и мы отправим инструкции по восстановлению
              </p>
            </div>

            {/* Форма сброса пароля */}
            <div className="bg-card rounded-xl shadow-lg p-8 border border-border/50">
              <ResetPasswordForm />
              
              {/* Разделитель */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">или</span>
                </div>
              </div>

              {/* Альтернативные способы восстановления */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">
                    🔐 Другие способы восстановления
                  </h3>
                  <p className="text-xs text-blue-600 mb-3">
                    Если у вас нет доступа к email
                  </p>
                  <div className="space-y-2">
                    <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                      📱 Восстановить через SMS
                    </button>
                    <button className="w-full bg-green-100 hover:bg-green-200 text-green-800 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                      💬 Связаться с поддержкой
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Ссылка на вход */}
              <div className="text-center mt-6 pt-6 border-t border-border">
                <p className="text-muted-foreground">
                  Вспомнили пароль?{' '}
                  <Link 
                    to="/login" 
                    className="font-medium text-orange-600 hover:text-orange-700 transition-colors underline-offset-4 hover:underline"
                  >
                    Вернуться ко входу
                  </Link>
                </p>
              </div>
            </div>

            {/* Важная информация */}
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                    ⚠️ Важная информация
                  </h3>
                  <div className="text-xs text-yellow-700 space-y-1">
                    <p>• Ссылка для восстановления действительна 24 часа</p>
                    <p>• Проверьте папку "Спам" если письмо не пришло</p>
                    <p>• Можно запросить новую ссылку через 5 минут</p>
                  </div>
                </div>
              </div>

              {/* Быстрые ссылки */}
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link 
                  to="/register" 
                  className="text-muted-foreground hover:text-orange-600 transition-colors"
                >
                  👤 Создать аккаунт
                </Link>
                <Link 
                  to="/faq" 
                  className="text-muted-foreground hover:text-orange-600 transition-colors"
                >
                  ❓ Частые вопросы
                </Link>
                <Link 
                  to="/working-hours" 
                  className="text-muted-foreground hover:text-orange-600 transition-colors"
                >
                  🕒 График поддержки
                </Link>
              </div>
            </div>

            {/* Контакты службы поддержки */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  🆘 Проблемы с восстановлением?
                </h3>
                <p className="text-xs text-red-600 mb-3">
                  Наша служба безопасности поможет восстановить доступ
                </p>
                <div className="flex justify-center space-x-4">
                  <a 
                    href="https://wa.me/5491123456789" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    📱 WhatsApp
                  </a>
                  <a 
                    href="https://t.me/icambio_security" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    🔒 Безопасность
                  </a>
                  <a 
                    href="mailto:security@icambio.com" 
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    ✉️ Email
                  </a>
                </div>
              </div>
            </div>

            {/* Безопасность */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  🛡️ Ваша безопасность - наш приоритет
                </h3>
                <div className="flex justify-center space-x-4 text-xs text-gray-600">
                  <span>🔐 256-bit шифрование</span>
                  <span>🏛️ Банковский уровень</span>
                  <span>✅ Двухфакторная аутентификация</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 