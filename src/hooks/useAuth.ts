import { useState, useEffect } from 'react';
import { getAllTxs } from '../api/transaction';

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
        // Only check API if we have a stored auth state
        if (localStorage.getItem(AUTH_KEY) === 'true') {
          await getAllTxs({page: 1, pageSize: 10});
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
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