import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/styles/index.css';
import "react-day-picker/style.css";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib/react-query';
import { ErrorBoundary } from '@/shared/ui';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ErrorBoundary>
);
