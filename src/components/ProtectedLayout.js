import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Navbar from './Navbar';

const ProtectedLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Use the Navbar component */}
      <Navbar />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-card py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Auth System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ProtectedLayout; 