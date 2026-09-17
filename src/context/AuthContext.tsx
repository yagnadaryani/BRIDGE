import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { storageService } from '../services/storage';
import { DEMO_STUDENT, DEMO_TEACHER } from '../data/mockData';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginAsStudent: () => void;
  loginAsTeacher: () => void;
  loginWithEmail: (email: string, role: UserRole, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return storageService.getCurrentUser();
  });

  useEffect(() => {
    if (currentUser) {
      storageService.setCurrentUser(currentUser);
    }
  }, [currentUser]);

  const loginAsStudent = () => {
    setCurrentUser(DEMO_STUDENT);
  };

  const loginAsTeacher = () => {
    setCurrentUser(DEMO_TEACHER);
  };

  const loginWithEmail = (email: string, role: UserRole, name?: string) => {
    const newUser: UserProfile = {
      id: 'user_' + Math.random().toString(36).substring(2, 9),
      name: name || (email.split('@')[0] ? email.split('@')[0].toUpperCase() : 'Engineer'),
      email,
      role,
      department: 'Computer & Systems Engineering'
    };
    storageService.registerUser(newUser);
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const role = currentUser?.role || 'STUDENT';
  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        loginAsStudent,
        loginAsTeacher,
        loginWithEmail,
        logout
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
