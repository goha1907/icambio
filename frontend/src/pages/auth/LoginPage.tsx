import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Logo } from '@/shared/ui/Logo';

/**
 * Страница входа в систему
 * 
 * Отвечает за:
 * - Общую верстку и расположение элементов на странице
 * - Заголовки и навигационные элементы
 * - Ссылки на другие страницы
 * - Дополнительную информацию (правила, политики)
 * - Брендинг и визуальные элементы
 */
export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-icmop-background to-blue-50">
      <div className="min-h-screen flex">
        {/* Левая панель с брендингом (скрыта на мобильных) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-icmop-primary to-blue-600 relative overflow-hidden">
          {/* Декоративные элементы */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full"></div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <Logo className="h-12 w-auto text-white" />
                <span className="ml-3 text-2xl font-bold">iCambio</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                Добро пожаловать в iCambio
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Надежный обмен валют с выгодными курсами и быстрыми операциями
              </p>
            </div>

            {/* Преимущества */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Безопасность</h3>
                  <p className="text-white/80">SSL-шифрование и защита данных</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Скорость</h3>
                  <p className="text-white/80">Обмен за 5-15 минут</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Выгодные курсы</h3>
                  <p className="text-white/80">Лучшие курсы на рынке</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Надежность</h3>
                  <p className="text-white/80">Тысячи довольных клиентов</p>
                </div>
              </div>
            </div>

            {/* Статистика */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">5K+</div>
                <div className="text-white/80 text-sm">Клиентов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">$2M+</div>
                <div className="text-white/80 text-sm">Обменено</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.9</div>
                <div className="text-white/80 text-sm">Рейтинг</div>
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
                <Logo className="h-10 w-auto text-icmop-primary" />
                <span className="ml-2 text-xl font-bold text-icmop-primary">iCambio</span>
              </div>
            </div>

            {/* Заголовок страницы */}
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Вход в систему
              </h1>
              <p className="mt-2 text-muted-foreground">
                Войдите в свой аккаунт для управления операциями
              </p>
            </div>

            {/* Форма входа */}
            <div className="bg-card rounded-xl shadow-lg p-8 border border-border/50">
              <LoginForm />
              
              {/* Разделитель */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">или</span>
                </div>
              </div>

              {/* Демо-вход */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">
                    🚀 Демо-режим
                  </h3>
                  <p className="text-xs text-blue-600 mb-3">
                    Попробуйте сервис без регистрации
                  </p>
                  <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                    Войти как гость
                  </button>
                </div>
              </div>
              
              {/* Ссылка на регистрацию */}
              <div className="text-center mt-6 pt-6 border-t border-border">
                <p className="text-muted-foreground">
                  Еще нет аккаунта?{' '}
                  <Link 
                    to="/register" 
                    className="font-medium text-icmop-primary hover:text-icmop-primary/80 transition-colors underline-offset-4 hover:underline"
                  >
                    Зарегистрироваться
                  </Link>
                </p>
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className="text-center space-y-4">
              <p className="text-xs text-muted-foreground">
                Входя в систему, вы соглашаетесь с{' '}
                <Link 
                  to="/rules" 
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  правилами обмена
                </Link>
                {' '}и{' '}
                <Link 
                  to="/aml-kyc" 
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  политикой AML/KYC
                </Link>
              </p>

              {/* Быстрые ссылки */}
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link 
                  to="/rates" 
                  className="text-muted-foreground hover:text-icmop-primary transition-colors"
                >
                  📊 Курсы валют
                </Link>
                <Link 
                  to="/faq" 
                  className="text-muted-foreground hover:text-icmop-primary transition-colors"
                >
                  ❓ Частые вопросы
                </Link>
                <Link 
                  to="/working-hours" 
                  className="text-muted-foreground hover:text-icmop-primary transition-colors"
                >
                  🕒 График работы
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
                  Наша поддержка готова помочь 24/7
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 