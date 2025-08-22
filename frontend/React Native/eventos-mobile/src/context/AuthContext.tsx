import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface Admin {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextData {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sessão salva
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storagedToken = await AsyncStorage.getItem('token');
        const storagedAdmin = await AsyncStorage.getItem('admin');
        if (storagedToken && storagedAdmin) {
          setToken(storagedToken);
          setAdmin(JSON.parse(storagedAdmin));
        }
      } catch (err) {
        console.error('Erro ao carregar storage:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, []);

  // Função de login
  const login = async (email: string, senha: string) => {
    const response = await api.post('/auth/login', { email, senha });
    const { token, administrador } = response.data;

    setToken(token);
    setAdmin(administrador);

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('admin', JSON.stringify(administrador));
  };

  // Função de logout
  const logout = async () => {
    setToken(null);
    setAdmin(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('admin');
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
