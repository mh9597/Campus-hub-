import { RouterProvider } from 'react-router-dom';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { router } from './routes';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { queryClient, persister } from './lib/queryClient';

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }}
    >
      <AdminAuthProvider>
        <RouterProvider router={router} />
      </AdminAuthProvider>
    </PersistQueryClientProvider>
  );
}

export default App;



