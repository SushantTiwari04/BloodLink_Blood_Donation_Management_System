import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import RequestPage from './pages/RequestPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

type Page = 'home' | 'register' | 'search' | 'request' | 'admin-login' | 'admin';

interface NavParams {
  bloodGroup?: string;
  city?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [navParams, setNavParams] = useState<NavParams>({});
  const [isAdmin, setIsAdmin] = useState(false);

  const handleNavigate = (page: string, params?: Record<string, string>) => {
    setCurrentPage(page as Page);
    setNavParams(params || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case 'search':
        return (
          <SearchPage
            initialBloodGroup={navParams.bloodGroup}
            initialCity={navParams.city}
          />
        );
      case 'request':
        return <RequestPage onNavigate={handleNavigate} />;
      case 'admin-login':
        return (
          <AdminLoginPage
            onLogin={() => setIsAdmin(true)}
            onNavigate={handleNavigate}
          />
        );
      case 'admin':
        if (!isAdmin) {
          return (
            <AdminLoginPage
              onLogin={() => setIsAdmin(true)}
              onNavigate={handleNavigate}
            />
          );
        }
        return <AdminDashboard />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isAdmin={isAdmin}
        onAdminLogout={handleAdminLogout}
      />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
