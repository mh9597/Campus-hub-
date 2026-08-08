import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/layout/Footer';

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow -mt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
