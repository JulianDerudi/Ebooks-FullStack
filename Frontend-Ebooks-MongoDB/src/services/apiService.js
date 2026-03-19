import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const authService = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
};

// Users
export const userService = {
    getProfile: (userId) => userId ? api.get(`/users/profile/${userId}`) : api.get('/users/profile'),
    updateProfile: (formData) => api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

// Ebooks
export const ebookService = {
    getAll: () => api.get('/ebooks'),
    getById: (id) => api.get(`/ebooks/${id}`),
    create: (formData) => api.post('/ebooks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => api.put(`/ebooks/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/ebooks/${id}`),
    like: (id) => api.post(`/ebooks/${id}/like`),
    unlike: (id) => api.delete(`/ebooks/${id}/like`),
};

export default api;