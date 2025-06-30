import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';

/**
 * Интерфейс пропсов для компонента ErrorBoundary
 */
interface ErrorBoundaryProps {
  /** Дочерние компоненты, которые будут обернуты в Error Boundary */
  children: ReactNode;
  /** Кастомный компонент для отображения ошибки (опционально) */
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

/**
 * Интерфейс состояния компонента ErrorBoundary
 */
interface ErrorBoundaryState {
  /** Флаг наличия ошибки */
  hasError: boolean;
  /** Объект ошибки */
  error: Error | null;
}

/**
 * Компонент ErrorBoundary для перехвата и обработки ошибок в дочерних компонентах
 * Реализует паттерн Error Boundary для graceful обработки JavaScript ошибок
 * 
 * @example
 * // Базовое использование
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * 
 * @example
 * // С кастомным fallback
 * <ErrorBoundary fallback={(error, retry) => (
 *   <div>
 *     <h2>Произошла ошибка: {error.message}</h2>
 *     <button onClick={retry}>Повторить</button>
 *   </div>
 * )}>
 *   <SomeComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  /**
   * Статический метод для обновления состояния при возникновении ошибки
   * Вызывается React'ом автоматически при ошибке в дочерних компонентах
   */
  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Обновляем state, чтобы следующий рендер показал fallback UI
    return { hasError: true, error };
  }

  /**
   * Метод для логирования ошибки и дополнительной информации
   * Здесь можно добавить отправку ошибок в сервис аналитики
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Логируем ошибку в консоль для разработки
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // TODO: В продакшене здесь можно добавить отправку в сервис аналитики
    // analytics.captureException(error, { extra: errorInfo });
  }

  /**
   * Метод для сброса состояния ошибки и повторной попытки рендера
   */
  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  /**
   * Рендер компонента
   */
  public render() {
    if (this.state.hasError && this.state.error) {
      // Если передан кастомный fallback, используем его
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Стандартный fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-destructive">
              Что-то пошло не так
            </h2>
            <p className="mb-4 text-muted-foreground">
              Произошла ошибка при загрузке страницы. Пожалуйста, попробуйте обновить страницу или
              вернитесь позже.
            </p>
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                Детали ошибки (для разработчиков)
              </summary>
              <pre className="mt-2 whitespace-pre-wrap break-all bg-muted p-2 rounded">
                {this.state.error.stack}
              </pre>
            </details>
            <Button
              onClick={this.handleRetry}
              variant="outline"
              className="mt-4 w-full"
            >
              Попробовать снова
            </Button>
          </div>
        </div>
      );
    }

    // Если ошибок нет, рендерим дочерние компоненты
    return this.props.children;
  }
}
