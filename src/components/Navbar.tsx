import { useState } from 'react';
import { Heart, Menu, X, Droplets } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isAdmin: boolean;
  onAdminLogout: () => void;
}

export default function Navbar({ currentPage, onNavigate, isAdmin, onAdminLogout }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'register', label: 'Donate Blood' },
    { id: 'search', label: 'Find Donors' },
    { id: 'request', label: 'Request Blood' },
  ];

  const handleNav = (page: string) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-red-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 text-white hover:text-red-100 transition-colors"
          >
            <Droplets className="w-7 h-7 fill-white" />
            <span className="font-bold text-xl tracking-tight">BloodLink</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === link.id
                    ? 'bg-white text-red-700'
                    : 'text-red-100 hover:bg-red-600 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
            {isAdmin ? (
              <>
                <button
                  onClick={() => handleNav('admin')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 'admin'
                      ? 'bg-white text-red-700'
                      : 'text-red-100 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={onAdminLogout}
                  className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-red-900 text-white hover:bg-red-800 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNav('admin-login')}
                className={`ml-2 px-4 py-2 rounded-md text-sm font-medium border border-red-300 transition-colors ${
                  currentPage === 'admin-login'
                    ? 'bg-white text-red-700'
                    : 'text-red-100 hover:bg-red-600 hover:text-white'
                }`}
              >
                Admin
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2 rounded-md hover:bg-red-600 transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-red-800 border-t border-red-600 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`block w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === link.id
                  ? 'bg-white text-red-700'
                  : 'text-red-100 hover:bg-red-700'
              }`}
            >
              {link.label}
            </button>
          ))}
          {isAdmin ? (
            <>
              <button
                onClick={() => handleNav('admin')}
                className={`block w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'admin' ? 'bg-white text-red-700' : 'text-red-100 hover:bg-red-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={onAdminLogout}
                className="block w-full text-left px-4 py-2 rounded-md text-sm font-medium text-red-200 hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => handleNav('admin-login')}
              className="block w-full text-left px-4 py-2 rounded-md text-sm font-medium text-red-200 hover:bg-red-700"
            >
              Admin Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
