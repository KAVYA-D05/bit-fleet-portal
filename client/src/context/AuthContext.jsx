import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('bit_fleet_token'));
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'info') => {
    setNotification({ msg, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('bit_fleet_token');
      if (savedToken) {
        try {
          const meRes = await api.getMe();
          if (meRes.success && meRes.user) {
            setUser(meRes.user);
          } else {
            localStorage.removeItem('bit_fleet_token');
            setToken(null);
            setUser(null);
          }
        } catch (e) {
          localStorage.removeItem('bit_fleet_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.success) {
        localStorage.setItem('bit_fleet_token', res.token);
        setToken(res.token);
        setUser(res.user);
        showNotification(`Welcome, ${res.user.name}! (${res.user.role})`, 'success');
        return res.user;
      }
    } catch (err) {
      showNotification(err.message || 'Login failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleSSO = async (email, name) => {
    setLoading(true);
    try {
      const res = await api.googleSSO(email, name);
      if (res.success) {
        localStorage.setItem('bit_fleet_token', res.token);
        setToken(res.token);
        setUser(res.user);
        showNotification(`Signed in with BIT Google SSO as ${res.user.name}`, 'success');
        return res.user;
      }
    } catch (err) {
      showNotification(err.message || 'SSO failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('bit_fleet_token');
    setToken(null);
    setUser(null);
    showNotification('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || 'FACULTY',
        loading,
        notification,
        login,
        googleSSO,
        logout,
        showNotification
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
