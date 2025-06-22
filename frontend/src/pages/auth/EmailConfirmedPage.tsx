import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/config/supabase'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Loader } from '@/shared/ui/Loader'

export const EmailConfirmedPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Получаем токены из URL параметров
        const access_token = searchParams.get('access_token')
        const refresh_token = searchParams.get('refresh_token')
        const type = searchParams.get('type')

        if (type === 'signup' && access_token && refresh_token) {
          // Устанавливаем сессию в Supabase
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token
          })

          if (error) {
            console.error('Error setting session:', error)
            setStatus('error')
            setMessage('Ошибка подтверждения email. Попробуйте войти в систему.')
          } else if (data.user) {
            setStatus('success')
            setMessage('Email успешно подтверждён! Теперь вы можете пользоваться системой.')
            
            // Перенаправляем на главную страницу через 3 секунды
            setTimeout(() => {
              navigate('/')
            }, 3000)
          }
        } else {
          setStatus('error')
          setMessage('Неверная ссылка подтверждения.')
        }
      } catch (error) {
        console.error('Confirmation error:', error)
        setStatus('error')
        setMessage('Произошла ошибка при подтверждении email.')
      }
    }

    handleEmailConfirmation()
  }, [searchParams, navigate])

  const handleGoToLogin = () => {
    navigate('/login')
  }

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="p-8 text-center">
          {status === 'loading' && (
            <div>
              <Loader />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Подтверждение email...
              </h2>
              <p className="text-gray-600">
                Пожалуйста, подождите, пока мы подтверждаем ваш email адрес.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Email подтверждён!
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Вы будете автоматически перенаправлены через несколько секунд...
              </p>
              <Button onClick={handleGoHome} className="w-full">
                Перейти на главную
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ошибка подтверждения
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Button onClick={handleGoToLogin} className="w-full">
                  Войти в систему
                </Button>
                <Button onClick={handleGoHome} variant="outline" className="w-full">
                  На главную
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
} 