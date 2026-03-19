import { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUserFromToken = async () => {
        const token = localStorage.getItem('token');
        console.log('loadUserFromToken - token exists:', !!token);
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            console.log('Calling userService.getProfile()');
            const response = await userService.getProfile();
            console.log('Profile response:', response.data);
            setUser({ ...response.data.user, token });
        } catch (error) {
            console.error('Error loading user from token:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserFromToken();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            const { token, user: userData } = response.data;
            localStorage.setItem('token', token);
            setUser({ ...userData, token });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            const { token, user: userInfo } = response.data;
            localStorage.setItem('token', token);
            setUser({ ...userInfo, token });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const updateUser = (updatedUser) => {
        setUser(prev => ({ ...prev, ...updatedUser }));
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}