import { describe, it, expect } from 'vitest'
import { loginSchema } from '@/shared/validation/auth'

describe('Auth Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should pass with a valid email and password', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      }
      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should fail with an invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'password123',
      }
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Неверный формат email')
      }
    })

    it('should fail with a password that is too short', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123',
      }
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Пароль должен содержать не менее 6 символов'
        )
      }
    })

    it('should fail if email is empty', () => {
        const invalidData = {
          email: '',
          password: 'password123',
        }
        const result = loginSchema.safeParse(invalidData)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Поле обязательно для заполнения')
        }
    })

    it('should fail if password is empty', () => {
        const invalidData = {
          email: 'test@example.com',
          password: '',
        }
        const result = loginSchema.safeParse(invalidData)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Поле обязательно для заполнения')
        }
    })
  })
}) 