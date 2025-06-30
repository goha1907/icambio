import React from 'react';
import { Link } from 'react-router-dom';
import { ChangePasswordForm } from '@/features/auth/components/ChangePasswordForm';
import { Logo } from '@/shared/ui/Logo';

/**
 * Страница смены пароля
 * 
 * Отвечает за:
 * - Общую верстку и расположение элементов на странице
 * - Заголовки и навигационные элементы
 * - Ссылки на другие страницы
 * - Информацию о безопасности и рекомендации
 * - Брендинг и визуальные элементы
 * - Дополнительные советы по безопасности
 */
export const ChangePasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="min-h-screen flex">
        {/* Левая панель с информацией о безопасности (скрыта на мобильных) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-indigo-700 relative overflow-hidden">
          {/* Декоративные элементы */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-white/5 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-white/5 rounded-full"></div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <Logo className="h-12 w-auto text-white" />
                <span className="ml-3 text-2xl font-bold">iCambio</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                Обновление пароля
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Регулярная смена пароля - важная часть защиты вашего аккаунта
              </p>
            </div>

            {/* Рекомендации по безопасности */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🔐</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Сильный пароль</h3>
                  <p className="text-white/80">Используйте комбинацию букв, цифр и символов</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Регулярное обновление</h3>
                  <p className="text-white/80">Меняйте пароль каждые 3-6 месяцев</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🚫</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Уникальность</h3>
                  <p className="text-white/80">Не используйте один пароль для разных сервисов</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Двухфакторная аутентификация</h3>
                  <p className="text-white/80">Дополнительный уровень защиты</p>
                </div>
              </div>
            </div>

            {/* Что делать НЕ стоит */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold mb-4">❌ Избегайте:</h3>
              <div className="space-y-2 text-white/90">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-white/60 rounded-full"></span>
                  <span>Простые пароли (123456, password)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-white/60 rounded-full"></span>
                  <span>Личную информацию (дата рождения, имя)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-white/60 rounded-full"></span>
                  <span>Сохранение паролей в браузере</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-white/60 rounded-full"></span>
                  <span>Передачу пароля третьим лицам</span>
                </div>
              </div>
            </div>

            {/* Статистика безопасности */}
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">90%</div>
                <div className="text-white/80 text-sm">Взломов из-за слабых паролей</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">2FA</div>
                <div className="text-white/80 text-sm">Снижает риски на 99%</div>
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
                <Logo className="h-10 w-auto text-purple-600" />
                <span className="ml-2 text-xl font-bold text-purple-600">iCambio</span>
              </div>
            </div>

            {/* Заголовок страницы */}
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Смена пароля
              </h1>
              <p className="mt-2 text-muted-foreground">
                Обновите ваш пароль для повышения безопасности аккаунта
              </p>
            </div>

            {/* Форма смены пароля */}
            <div className="bg-card rounded-xl shadow-lg p-8 border border-border/50">
              <ChangePasswordForm />
              
              {/* Разделитель */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">дополнительно</span>
                </div>
              </div>

              {/* Генератор паролей */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-green-800 mb-2">
                    🎲 Генератор надежных паролей
                  </h3>
                  <p className="text-xs text-green-600 mb-3">
                    Создайте криптостойкий пароль одним кликом
                  </p>
                  <button className="w-full bg-green-100 hover:bg-green-200 text-green-800 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                    Сгенерировать пароль
                  </button>
                </div>
              </div>
              
              {/* Ссылка на профиль */}
              <div className="text-center mt-6 pt-6 border-t border-border">
                <p className="text-muted-foreground">
                  <Link 
                    to="/profile" 
                    className="font-medium text-purple-600 hover:text-purple-700 transition-colors underline-offset-4 hover:underline"
                  >
                    ← Вернуться в профиль
                  </Link>
                </p>
              </div>
            </div>

            {/* Рекомендации для пользователя */}
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">
                    💡 Советы по безопасности
                  </h3>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p>• Используйте менеджер паролей для хранения</p>
                    <p>• Включите уведомления о входе в аккаунт</p>
                    <p>• Регулярно проверяйте активные сессии</p>
                  </div>
                </div>
              </div>

              {/* Быстрые ссылки */}
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link 
                  to="/profile" 
                  className="text-muted-foreground hover:text-purple-600 transition-colors"
                >
                  👤 Мой профиль
                </Link>
                <Link 
                  to="/profile/security" 
                  className="text-muted-foreground hover:text-purple-600 transition-colors"
                >
                  🛡️ Настройки безопасности
                </Link>
                <Link 
                  to="/faq" 
                  className="text-muted-foreground hover:text-purple-600 transition-colors"
                >
                  ❓ Частые вопросы
                </Link>
              </div>
            </div>

            {/* Двухфакторная аутентификация */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                  🔐 Включите двухфакторную аутентификацию
                </h3>
                <p className="text-xs text-yellow-700 mb-3">
                  Дополнительная защита с помощью SMS или приложения-аутентификатора
                </p>
                <Link 
                  to="/profile/security/2fa"
                  className="inline-block w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Настроить 2FA
                </Link>
              </div>
            </div>

            {/* Контакты поддержки */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  🆘 Подозрительная активность?
                </h3>
                <p className="text-xs text-red-600 mb-3">
                  Немедленно обратитесь в службу безопасности
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

            {/* Информация о защите */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  🛡️ Ваши данные защищены
                </h3>
                <div className="flex justify-center space-x-4 text-xs text-gray-600">
                  <span>🔐 AES-256 шифрование</span>
                  <span>🏛️ Банковские стандарты</span>
                  <span>✅ Постоянный мониторинг</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 