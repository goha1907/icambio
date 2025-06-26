import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Обновляем state, чтобы следующий рендер показал fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Логируем ошибку в сервис аналитики
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
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
              <summary>Детали ошибки</summary>
              <pre className="mt-2 whitespace-pre-wrap break-all">
                {this.state.error?.stack}
              </pre>
            </details>
            <Button
              onClick={() => this.setState({ hasError: false, error: null })}
              variant="outline"
              className="mt-4 w-full"
            >
              Попробовать снова
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
