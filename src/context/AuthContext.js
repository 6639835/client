import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastActivity, setLastActivity] = useState(null);
  
  // Instance of axios with base URL
  const api = axios.create({
    baseURL: 'http://localhost:5001/api/auth'
  });
  
  // Add interceptor for token refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If error is 401 and we haven't already tried to refresh
      if (error.response?.status === 401 && 
          error.response?.data?.tokenExpired && 
          !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const storedUser = JSON.parse(localStorage.getItem('user'));
          
          if (storedUser?.refreshToken) {
            // Try to refresh the token
            const refreshRes = await axios.post(
              'http://localhost:5001/api/auth/refresh-token', 
              { refreshToken: storedUser.refreshToken }
            );
            
            const { token, refreshToken } = refreshRes.data;
            
            // Update user in localStorage
            const updatedUser = { ...storedUser, token, refreshToken };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Update user in state
            setUser(updatedUser);
            
            // Update auth header and retry the original request
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, log out the user
          logout();
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );

  // Load user from storage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setLastActivity(new Date().toISOString());
    }
    setLoading(false);
  }, []);

  // Update last activity timestamp on user interactions
  useEffect(() => {
    if (isAuthenticated) {
      const handleActivity = () => {
        setLastActivity(new Date().toISOString());
      };

      window.addEventListener('click', handleActivity);
      window.addEventListener('keydown', handleActivity);

      return () => {
        window.removeEventListener('click', handleActivity);
        window.removeEventListener('keydown', handleActivity);
      };
    }
  }, [isAuthenticated]);

  // Check for session timeout
  useEffect(() => {
    if (isAuthenticated && lastActivity) {
      const sessionTimeout = 30 * 60 * 1000; // 30 minutes
      
      const interval = setInterval(() => {
        const now = new Date();
        const lastActivityTime = new Date(lastActivity);
        const timeSinceLastActivity = now.getTime() - lastActivityTime.getTime();
        
        if (timeSinceLastActivity > sessionTimeout) {
          logout();
          alert('Your session has expired. Please login again.');
        }
      }, 60 * 1000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, lastActivity]);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/register', userData);
      
      // Set user and token in local storage
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Set user in state
      setUser(response.data);
      setIsAuthenticated(true);
      setLastActivity(new Date().toISOString());
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
      
      const response = await api.post('/login', userData);
      
      // Set user and token in local storage
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Set user in state
      setUser(response.data);
      setIsAuthenticated(true);
      setLastActivity(new Date().toISOString());
      setLoading(false);
      
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    }
  };

  // Logout user
  const logout = useCallback(async () => {
    try {
      if (isAuthenticated && user?.token) {
        // Call the logout API to invalidate the refresh token on server
        await api.post('/logout', {}, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Remove user from local storage
      localStorage.removeItem('user');
      
      // Set state
      setUser(null);
      setIsAuthenticated(false);
      setLastActivity(null);
    }
  }, [isAuthenticated, user, api]);

  // Get user profile
  const getUserProfile = async () => {
    try {
      setLoading(true);
      
      const response = await api.get('/me', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    }
  };
  
  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put('/profile', userData, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      // Update user in local storage and state
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    }
  };
  
  // Change password
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put('/password', passwordData, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
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
        lastActivity,
        register,
        login,
        logout,
        getUserProfile,
        updateProfile,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;