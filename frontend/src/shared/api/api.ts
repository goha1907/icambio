import axios, { AxiosError, AxiosResponse } from 'axios'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import toast from 'react-hot-toast'

// Создаем инстанс axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor для добавления токена к запросам
api.interceptors.request.use(
  (config) => {
    const { session } = useAuthStore.getState()
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor для обработки ответов
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    const { response } = error
    
    if (response?.status === 401) {
      // При получении 401 ошибки разлогиниваем пользователя
      const { logout } = useAuthStore.getState()
      logout()
      toast.error('Сессия истекла. Пожалуйста, войдите снова.')
      
      // Перенаправляем на страницу логина
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } else if (response?.status === 403) {
      toast.error('У вас нет прав для выполнения этого действия')
    } else if (response?.status === 500) {
      toast.error('Ошибка сервера. Попробуйте позже.')
    } else if (!response) {
      toast.error('Ошибка сети. Проверьте подключение к интернету.')
    }
    
    return Promise.reject(error)
  }
)

export default api 