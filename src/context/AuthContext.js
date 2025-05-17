import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from storage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      // Set user and token in local storage
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Set user in state
      setUser(response.data);
      setIsAuthenticated(true);
      setLoading(false);
      
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/api/auth/login', userData);
      
      // Set user and token in local storage
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Set user in state
      setUser(response.data);
      setIsAuthenticated(true);
      setLoading(false);
      
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    // Remove user from local storage
    localStorage.removeItem('user');
    
    // Set state
    setUser(null);
    setIsAuthenticated(false);
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };
      
      const response = await axios.get('http://localhost:5000/api/auth/me', config);
      
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        getUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 