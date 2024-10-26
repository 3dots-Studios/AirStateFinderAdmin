import React, { createContext, useContext, useEffect, useState } from 'react';
import { User,UserContextType } from '../types';
// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function that saves user data to state and localStorage
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Persist user to localStorage
    
  };

  // Logout function that clears user data
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove from localStorage on logout
  };

  const isAuthenticated = !!user; // Check if user is logged in

  return (
    <UserContext.Provider value={{ user, login, logout,isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
