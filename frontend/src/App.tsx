import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from '@/shared/config/routes';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './shared/ui';

function App() {
  const router = createBrowserRouter(routes);

  return (
    <ErrorBoundary>
      <Toaster position="bottom-right" />
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;