import { useState, useEffect } from 'react';
import { getTokens } from '../utils/cookie';
import dayjs from 'dayjs';

const AUTH_KEY = 'isAuthenticated';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem(AUTH_KEY);
    return stored === 'true';
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for tokens in cookies
        const { token, expiryDate } = getTokens();
        
        if (token && expiryDate) {
          // Check if token is expired
          const isExpired = dayjs(expiryDate).isBefore(dayjs());
          
          if (isExpired) {
            setIsAuthenticated(false);
            localStorage.removeItem(AUTH_KEY);
          } else {
            setIsAuthenticated(true);
          }
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem(AUTH_KEY);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        localStorage.removeItem(AUTH_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_KEY, 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}; 