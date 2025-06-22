import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/shared/ui/Card'

export const ConfirmEmailPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Подтвердите ваш email
            </h2>
            <p className="text-gray-600 mb-6">
              Мы отправили письмо с подтверждением на ваш email адрес.
              Перейдите по ссылке в письме, чтобы активировать аккаунт и затем войдите в систему.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Не получили письмо?</strong>
                <br />
                Проверьте папку "Спам" или попробуйте зарегистрироваться снова.
              </p>
            </div>

            <Link
              to="/login"
              className="w-full inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 text-center"
            >
              Перейти к входу
            </Link>

            <Link
              to="/register"
              className="w-full inline-block px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 text-center"
            >
              Попробовать снова
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
} 