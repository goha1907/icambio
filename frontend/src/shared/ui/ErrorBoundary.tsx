import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { Link } from './Link';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reload: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Умный логгер ошибок, который работает по-разному в зависимости от окружения
 */
const logError = (error: Error, errorInfo: ErrorInfo) => {
  if (process.env.NODE_ENV === 'development') {
    // В режиме разработки просто выводим в консоль
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  } else {
    // В режиме продакшена здесь будет отправка в Sentry, LogRocket и т.д.
    // Например: Sentry.captureException(error, { extra: errorInfo });
  }
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError(error, errorInfo);
  }

  /**
   * Перезагружает страницу для полного сброса состояния
   */
  private handleReload = (): void => {
    window.location.reload();
  };

  public render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError && error) {
      if (fallback) {
        return fallback(error, this.handleReload);
      }

      // Новый, более универсальный и надежный UI
      return (
        <div
          role="alert"
          className="mx-auto my-12 max-w-lg rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center"
        >
          <h2 className="mb-2 text-xl font-bold text-destructive">
            Произошла ошибка
            </h2>
          <p className="mb-6 text-destructive/80">
            К сожалению, в работе приложения произошел сбой.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={this.handleReload} variant="outline">
              Перезагрузить страницу
            </Button>
            <Button asChild variant="secondary">
              <Link to="/">На главную</Link>
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                Техническая информация
              </summary>
              <pre className="mt-2 whitespace-pre-wrap rounded bg-muted/50 p-2 font-mono">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return children;
  }
}