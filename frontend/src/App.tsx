import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { SpotifyProvider } from './context/SpotifyContext';

function App() {
  return (
    <AdminAuthProvider>
      <SpotifyProvider>
        <RouterProvider router={router} />
      </SpotifyProvider>
    </AdminAuthProvider>
  );
}

export default App;


