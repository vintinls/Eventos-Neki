import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL do backend - precisa ter http:// e a porta
const api = axios.create({
  baseURL: 'http://10.0.2.2:8080',
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
