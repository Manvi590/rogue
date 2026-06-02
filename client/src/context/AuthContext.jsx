import { createContext, useState, useEffect, useContext } from 'react';
import { apiCall } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only use sessionStorage so that sessions expire when the tab is closed
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || 'null');
    if (userInfo) {
      setUser(userInfo);
    }
    // Clear any lingering localStorage data from previous versions to force logout
    localStorage.removeItem('userInfo');
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await apiCall('/auth/login', 'POST', { email, password });
    setUser(data);
    sessionStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const signup = async (signupData) => {
    const data = await apiCall('/auth/register', 'POST', signupData);
    setUser(data);
    sessionStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const updateProfile = async (profileData) => {
    const data = await apiCall('/auth/profile', 'PUT', profileData, user.token);
    setUser(data);
    sessionStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userInfo');
    sessionStorage.setItem('awr_logout_message', 'You have successfully logged out.');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

