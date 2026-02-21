'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = api.getToken();
            if (token) {
                const response = await api.getMe();
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            api.clearToken();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const response = await api.login(username, password);
        setUser(response.data.user);
        return response;
    };

    const register = async (username, password) => {
        const response = await api.register(username, password);
        setUser(response.data.user);
        return response;
    };

    const logout = () => {
        api.logout();
        setUser(null);
        router.push('/login');
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
