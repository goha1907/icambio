import React from 'react';
import { Link } from 'react-router-dom';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { Logo } from '@/shared/ui/Logo';

/**
 * Страница регистрации нового пользователя
 * 
 * Отвечает за:
 * - Общую верстку и расположение элементов на странице
 * - Заголовки и навигационные элементы
 * - Ссылки на другие страницы
 * - Дополнительную информацию (правила, политики)
 * - Брендинг и визуальные элементы
 * - Мотивационную информацию для регистрации
 */
export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="min-h-screen flex">
        {/* Левая панель с преимуществами регистрации (скрыта на мобильных) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-green-700 relative overflow-hidden">
          {/* Декоративные элементы */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full"></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full"></div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <Logo className="h-12 w-auto text-white" />
                <span className="ml-3 text-2xl font-bold">iCambio</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                Присоединяйтесь к iCambio
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Создайте аккаунт и получите доступ к выгодным обменам валют
              </p>
            </div>

            {/* Преимущества регистрации */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🎁</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Бонус за регистрацию</h3>
                  <p className="text-white/80">Скидка 0.5% на первые 5 операций</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">История операций</h3>
                  <p className="text-white/80">Отслеживайте все ваши обмены</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🔔</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Уведомления</h3>
                  <p className="text-white/80">Получайте SMS и email уведомления</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Реферальная программа</h3>
                  <p className="text-white/80">Зарабатывайте на приглашениях</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">💎</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">VIP статус</h3>
                  <p className="text-white/80">Повышенные лимиты и приоритет</p>
                </div>
              </div>
            </div>

            {/* Процесс регистрации */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold mb-4">Простая регистрация:</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-white/90">Заполните форму</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-white/90">Подтвердите email</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-white/90">Начните обменивать</span>
                </div>
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
                <Logo className="h-10 w-auto text-emerald-600" />
                <span className="ml-2 text-xl font-bold text-emerald-600">iCambio</span>
              </div>
            </div>

            {/* Заголовок страницы */}
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Создать аккаунт
              </h1>
              <p className="mt-2 text-muted-foreground">
                Зарегистрируйтесь и получите доступ к выгодным обменам
              </p>
            </div>

            {/* Форма регистрации */}
            <div className="bg-card rounded-xl shadow-lg p-8 border border-border/50">
              <RegisterForm />
              
              {/* Разделитель */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">или</span>
                </div>
              </div>

              {/* Быстрая регистрация */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-emerald-800 mb-2">
                    ⚡ Быстрая регистрация
                  </h3>
                  <p className="text-xs text-emerald-600 mb-3">
                    Создайте аккаунт одним кликом через социальные сети
                  </p>
                  <div className="space-y-2">
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center">
                      📧 Продолжить с Google
                    </button>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center">
                      📱 Продолжить с Facebook
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Ссылка на вход */}
              <div className="text-center mt-6 pt-6 border-t border-border">
                <p className="text-muted-foreground">
                  Уже есть аккаунт?{' '}
                  <Link 
                    to="/login" 
                    className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors underline-offset-4 hover:underline"
                  >
                    Войти в систему
                  </Link>
                </p>
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className="text-center space-y-4">
              <p className="text-xs text-muted-foreground">
                Регистрируясь, вы соглашаетесь с{' '}
                <Link 
                  to="/rules" 
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  правилами обмена
                </Link>
                {', '}
                <Link 
                  to="/aml-kyc" 
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  политикой AML/KYC
                </Link>
                {' и '}
                <Link 
                  to="/privacy" 
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  политикой конфиденциальности
                </Link>
              </p>

              {/* Быстрые ссылки */}
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link 
                  to="/rates" 
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  📊 Курсы валют
                </Link>
                <Link 
                  to="/faq" 
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  ❓ Частые вопросы
                </Link>
                <Link 
                  to="/reviews" 
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  ⭐ Отзывы клиентов
                </Link>
              </div>
            </div>

            {/* Безопасность и гарантии */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">
                  🛡️ Ваши данные под защитой
                </h3>
                <p className="text-xs text-blue-600 mb-3">
                  256-битное шифрование • Проверенная компания • Лицензированная деятельность
                </p>
                <div className="flex justify-center space-x-4 text-xs">
                  <span className="text-blue-600">🔒 SSL Certificate</span>
                  <span className="text-blue-600">🏛️ Банковская защита</span>
                  <span className="text-blue-600">✅ KYC проверка</span>
                </div>
              </div>
            </div>

            {/* Контакты для вопросов */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-amber-800 mb-2">
                  💬 Есть вопросы по регистрации?
                </h3>
                <p className="text-xs text-amber-600 mb-3">
                  Наши специалисты помогут вам пройти регистрацию
                </p>
                <div className="flex justify-center space-x-4">
                  <a 
                    href="https://wa.me/5491123456789" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    📱 WhatsApp
                  </a>
                  <a 
                    href="https://t.me/icambio_support" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    💬 Telegram
                  </a>
                  <a 
                    href="mailto:support@icambio.com" 
                    className="text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    ✉️ Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 