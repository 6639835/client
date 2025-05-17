import { Link } from "react-router-dom";
import { Sun, Moon, User, Settings, Home, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./theme-provider";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/dashboard" className="mr-4 flex items-center space-x-2">
          <span className="font-bold text-xl">Auth App</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary"
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
            <Link
              to="/settings"
              className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Theme"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <div className="flex items-center">
              {user && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {user.name}
                  </span>
                  <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 