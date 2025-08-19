import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                if (decodedUser.exp * 1000 > Date.now()) {
                    setUser(decodedUser);
                } else {
                    localStorage.removeItem('access_token');
                }
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem('access_token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await apiClient.post('/auth/login/', { email, password });
        localStorage.setItem('access_token', response.data.access);
        const decodedUser = jwtDecode(response.data.access);
        setUser(decodedUser);
    };

    const signup = async (username, email, password) => {
        await apiClient.post('/auth/signup/', { username, email, password });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
