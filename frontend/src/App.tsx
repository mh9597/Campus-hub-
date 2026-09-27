import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AdminAuthProvider } from './context/AdminAuthContext';

function App() {
  return (
    <AdminAuthProvider>
      <RouterProvider router={router} />
    </AdminAuthProvider>
  );
}

export default App;


