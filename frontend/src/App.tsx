import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from '@/shared/config/routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './shared/ui';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const router = createBrowserRouter(routes);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Toaster position="bottom-right" />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;