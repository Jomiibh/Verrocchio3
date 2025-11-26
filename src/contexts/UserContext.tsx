import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type UserModel } from '@/components/data/orm/orm_user';

interface UserContextType {
  currentUser: UserModel | null;
  setCurrentUser: (user: UserModel | null, rememberMe?: boolean) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'verrocchio_user';

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<UserModel | null>(() => {
    // Try to load user from localStorage on initial mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as UserModel;
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    }
    return null;
  });

  const setCurrentUser = (user: UserModel | null, rememberMe = false) => {
    setCurrentUserState(user);

    if (user && rememberMe) {
      // Save to localStorage if remember me is checked
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
      }
    } else if (!user) {
      // Clear localStorage when logging out
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Error removing user from localStorage:', error);
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
