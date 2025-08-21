import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL do seu backend (ajuste para o endereço real do backend)
const api = axios.create({
  baseURL: 'http://localhost:8080', // coloque o IP da sua máquina
});

// Interceptador para adicionar o token em cada requisição
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
