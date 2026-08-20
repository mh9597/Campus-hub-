import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/common/ScrollToTop';

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow -mt-20 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
