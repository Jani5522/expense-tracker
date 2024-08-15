import { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to authenticate the user (e.g., checking if they're already logged in)
  const authenticate = useCallback(async () => {
    try {
      const response = await fetch('/api/authentication');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    authenticate(); // Fetch the user on component mount
  }, [authenticate]);

  const login = useCallback(async (credentials) => {
    try {
      const response = await fetch('/api/authentication/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        const err = await response.json();
        return err;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      const response = await fetch('/api/authentication/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
