import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth as authApi } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('kanakko_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await authApi.getMe();
      setUser(data.user);
    } catch {
      localStorage.removeItem('kanakko_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (phone, password) => {
    setError(null);
    try {
      const data = await authApi.login(phone, password);
      localStorage.setItem('kanakko_token', data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (name, phone, password, shopName) => {
    setError(null);
    try {
      const data = await authApi.register(name, phone, password, shopName);
      localStorage.setItem('kanakko_token', data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('kanakko_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
