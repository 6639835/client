import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const ProtectedLayout = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-4 shadow-md bg-card">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Auth System</h1>
          
          <div className="flex items-center">
            <ThemeToggle />
            
            <div className="hidden md:flex space-x-4 mx-4">
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/profile" className="hover:underline">Profile</Link>
              <Link to="/settings" className="hover:underline">Settings</Link>
            </div>
            
            <div className="relative">
              <button 
                onClick={toggleMenu}
                className="flex items-center focus:outline-none"
              >
                <span className="mr-2">{user?.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg py-1 z-10">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm hover:bg-accent/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-sm hover:bg-accent/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-accent/10"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Nav */}
      <div className="md:hidden bg-card shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between">
          <Link to="/dashboard" className="px-3 py-2 rounded hover:bg-accent hover:text-white">Dashboard</Link>
          <Link to="/profile" className="px-3 py-2 rounded hover:bg-accent hover:text-white">Profile</Link>
          <Link to="/settings" className="px-3 py-2 rounded hover:bg-accent hover:text-white">Settings</Link>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-card py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Auth System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ProtectedLayout; 