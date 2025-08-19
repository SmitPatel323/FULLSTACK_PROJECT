import axios from 'axios';

// Connects to the Django backend
const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

// Interceptor to add the auth token to every request
apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default apiClient;
