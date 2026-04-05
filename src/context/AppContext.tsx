import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User, Toast, Product, Store, Task } from '../types';
import type { User as UserType } from '../types';
import { DUMMY_USERS, DUMMY_STORES, DUMMY_PRODUCTS, DUMMY_TASKS, LOGIN_CREDENTIALS } from '../data/dummy';

interface LoginCredential {
  email: string;
  password: string;
  userId: string;
}

interface AppContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  users: UserType[];
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
  stores: Store[];
  setStores: React.Dispatch<React.SetStateAction<Store[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  loginCredentials: LoginCredential[];
  setLoginCredentials: React.Dispatch<React.SetStateAction<LoginCredential[]>>;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error') => void;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserType[]>(DUMMY_USERS);
  const [stores, setStores] = useState<Store[]>(DUMMY_STORES);
  const [products, setProducts] = useState<Product[]>(DUMMY_PRODUCTS);
  const [tasks, setTasks] = useState<Task[]>(DUMMY_TASKS);
  const [loginCredentials, setLoginCredentials] = useState<LoginCredential[]>(LOGIN_CREDENTIALS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const login = useCallback((user: User) => {
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      users, setUsers,
      stores, setStores,
      products, setProducts,
      tasks, setTasks,
      loginCredentials, setLoginCredentials,
      toasts, showToast,
      sidebarOpen, setSidebarOpen,
      isDarkMode, toggleDarkMode,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
