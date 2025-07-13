import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/Form'
import { Input } from '@/shared/ui/Input'
import { PasswordInput } from '@/shared/ui/PasswordInput'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { loginSchema, type LoginFormData } from '@/features/auth/validation'

/**
 * Компонент формы входа в систему.
 * 
 * Отвечает за логику аутентификации: валидация, отправка данных,
 * обработка состояния загрузки и ошибок. Использует `PasswordInput`
 * для поля пароля и интегрирует "Запомнить меня" в состояние формы.
 */
export const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  // Загрузка сохраненных данных из localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    const wasRemembered = localStorage.getItem('rememberMe') === 'true'

    if (savedEmail && wasRemembered) {
      form.setValue('email', savedEmail)
      form.setValue('rememberMe', true)
    }
  }, [form])

  // Автофокус на поле email при монтировании
  useEffect(() => {
    form.setFocus('email')
  }, [form])

  /**
   * Обработка отправки формы
   */
  const onSubmit = async (data: LoginFormData) => {
    const result = await login({ email: data.email, password: data.password })

    if (result && !result.error) {
      if (data.rememberMe) {
        localStorage.setItem('rememberedEmail', data.email)
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberedEmail')
        localStorage.removeItem('rememberMe')
      }
      navigate('/')
    }
    // Ошибки теперь обрабатываются и показываются через toast в useAuth
  }

  return (
    <div className="space-y-4">
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
                  <PasswordInput
                    {...field}
                    placeholder="Введите пароль"
                    autoComplete="current-password"
                    aria-describedby={fieldState.error ? `${field.name}-error` : undefined}
                    variant={fieldState.error ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage id={`${field.name}-error`} />
              </FormItem>
            )}
          />

          {/* Дополнительные опции */}
          <div className="flex items-center justify-between">
            {/* Чекбокс "Запомнить меня" */}
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                      aria-label="Запомнить меня"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">
                      Запомнить меня
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Ссылка на восстановление пароля */}
            <Link
              to="/reset-password"
              className="text-sm font-medium text-icambio-primary hover:text-icambio-primary/80 transition-colors underline-offset-4 hover:underline"
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