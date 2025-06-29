import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/Button'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/Form'
import { Input } from '@/shared/ui/Input'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  loginSchema,
  LoginFormData,
} from '@/shared/validation/auth'

/**
 * Компонент формы входа в систему
 * 
 * Отвечает только за логику формы аутентификации:
 * - Валидация полей с помощью React Hook Form + Zod
 * - Показать/скрыть пароль с Eye/EyeOff иконками
 * - Запомнить данные входа (localStorage)
 * - Автофокус и автозаполнение
 * - Улучшенная обработка ошибок
 * - Accessibility поддержка
 * 
 * Верстка страницы и общее расположение элементов находится в LoginPage.tsx
 */
export const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  
  // Состояния компонента
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  // Реф для автофокуса на поле email
  const emailInputRef = useRef<HTMLInputElement>(null)

  // Инициализация формы с улучшенными настройками
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit', // Валидация только при отправке формы
    reValidateMode: 'onChange', // Перевалидация при изменении после первой отправки
  })

  // Автофокус на поле email при монтировании компонента
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus()
    }
  }, [])

  // Загрузка сохраненных данных из localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    const wasRemembered = localStorage.getItem('rememberMe') === 'true'
    
    if (savedEmail && wasRemembered) {
      form.setValue('email', savedEmail)
      setRememberMe(true)
    }
  }, [form])



  /**
   * Переключение видимости пароля
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  /**
   * Обработка отправки формы
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data)
      
      if (result.error) {
        // Ошибки теперь показываются через toast в useAuth
        return
      }

      // Сохраняем email если пользователь выбрал "Запомнить меня"
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', data.email)
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberedEmail')
        localStorage.removeItem('rememberMe')
      }

      // Успешный вход - перенаправляем на главную
      navigate('/')
    } catch (error) {
      console.error('Login form error:', error)
      // Ошибки теперь показываются через toast в useAuth
    }
  }

  return (
    <div className="space-y-4">{/* Уменьшил отступ так как заголовок теперь в LoginPage */}

      {/* Форма входа */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Поле Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email адрес <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    ref={emailInputRef}
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    aria-describedby={fieldState.error ? `${field.name}-error` : undefined}
                    variant={fieldState.error ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage id={`${field.name}-error`} />
              </FormItem>
            )}
          />

          {/* Поле Пароль */}
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Пароль <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Введите пароль"
                      autoComplete="current-password"
                      aria-describedby={fieldState.error ? `${field.name}-error` : undefined}
                      variant={fieldState.error ? 'error' : 'default'}
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage id={`${field.name}-error`} />
              </FormItem>
            )}
          />

          {/* Дополнительные опции */}
          <div className="flex items-center justify-between">
            {/* Чекбокс "Запомнить меня" */}
            <div className="flex items-center space-x-2">
                             <input
                 id="remember-me"
                 type="checkbox"
                 checked={rememberMe}
                 onChange={(e) => setRememberMe(e.target.checked)}
                 disabled={isLoading}
                 className="h-4 w-4 rounded border-input accent-icmop-primary focus:ring-2 focus:ring-icmop-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
               />
              <label 
                htmlFor="remember-me" 
                className="text-sm font-medium text-foreground cursor-pointer select-none"
              >
                Запомнить меня
              </label>
            </div>

            {/* Ссылка на восстановление пароля */}
            <Link 
              to="/reset-password" 
              className="text-sm font-medium text-icmop-primary hover:text-icmop-primary/80 transition-colors underline-offset-4 hover:underline"
            >
              Забыли пароль?
            </Link>
          </div>

          {/* Кнопка отправки */}
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Вход в систему...
              </>
            ) : (
              'Войти в систему'
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}