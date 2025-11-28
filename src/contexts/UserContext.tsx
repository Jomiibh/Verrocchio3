import { createContext, useContext, useState, type ReactNode } from 'react';
import { type UserModel } from '@/components/data/orm/orm_user';
import { saveAuthToken, getAuthToken } from '@/lib/api';

interface UserContextType {
  currentUser: UserModel | null;
  setCurrentUser: (user: UserModel | null, rememberMe?: boolean) => void;
  logout: () => void;
  token: string | null;
  setAuthToken: (token: string | null, rememberMe?: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'verrocchio_user';
const TOKEN_KEY = 'verrocchio_auth_token';

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<UserModel | null>(() => {
    // Try to load user from sessionStorage first, then localStorage
    const loadUser = (storage: Storage) => {
      try {
        const stored = storage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored) as UserModel;
      } catch (error) {
        console.error('Error loading user from storage:', error);
      }
      return null;
    };

    const sessionUser = loadUser(sessionStorage);
    if (sessionUser) return sessionUser;
    return loadUser(localStorage);
  });
  const [token, setToken] = useState<string | null>(() => getAuthToken());

  const setCurrentUser = (user: UserModel | null, rememberMe = false) => {
    setCurrentUserState(user);

    if (user) {
      // Always persist to sessionStorage to survive refreshes in this tab
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user to sessionStorage:', error);
      }

      // Only persist to localStorage when remember me is checked
      try {
        if (rememberMe) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
      }
    } else {
      // Clear both storages when logging out
      try {
        sessionStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Error removing user from storage:', error);
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    saveAuthToken(null);
  };

  const setAuthToken = (value: string | null, rememberMe = false) => {
    setToken(value);
    saveAuthToken(value, rememberMe);
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout, token, setAuthToken }}>
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
