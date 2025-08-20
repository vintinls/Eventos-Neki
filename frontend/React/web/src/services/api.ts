// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Interceptor para injetar token
api.interceptors.request.use((config) => {
  // tenta pegar do localStorage, se não achar pega do sessionStorage
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
