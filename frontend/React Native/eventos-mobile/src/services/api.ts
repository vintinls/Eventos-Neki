import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 👉 defina a baseURL aqui
export const API_BASE = 'http://10.0.2.2:8080'; 
// se rodar em device físico, troque por IP da sua máquina ex: 'http://192.168.0.10:8080'

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
