
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            // Assuming you have a way to redirect to login or handle unauth
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const linkService = {
    getAll: () => api.get('/links'),
    create: (linkData) => api.post('/links', linkData),
    update: (id, linkData) => api.put(`/links/${id}`, linkData),
    delete: (id) => api.delete(`/links/${id}`),
};

export const analyticsService = {
    get: (linkId) => api.get(`/analytics/${linkId}`),
};

export default api;
