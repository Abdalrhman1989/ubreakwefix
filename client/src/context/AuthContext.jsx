import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // The exposed user (with activeRole)
    const [realUser, setRealUser] = useState(null); // The actual DB user
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token and user data on load
        const checkSession = async () => {
            const storedToken = localStorage.getItem('token');
            const storedActiveRole = localStorage.getItem('activeRole');
            const storedUser = localStorage.getItem('user');

            if (storedToken) {
                try {
                    // VERIFY SESSION via API to get fresh role data
                    const res = await axios.get('/api/auth/verify', {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    });

                    const freshRealUser = res.data.user;
                    setRealUser(freshRealUser);

                    // Apply active role preference if valid
                    // If storedActiveRole is invalid for this user (e.g. says business but they are not), fallback to real role
                    let effectiveRole = freshRealUser.role;
                    if (storedActiveRole && (freshRealUser.role === 'business' || storedActiveRole === 'user')) {
                        effectiveRole = storedActiveRole;
                    }

                    const initialUser = { ...freshRealUser, role: effectiveRole };
                    setUser(initialUser);
                    localStorage.setItem('user', JSON.stringify(initialUser)); // Sync local storage with fresh data
                } catch (err) {
                    console.error("Session verification failed", err);
                    // If verification fails (e.g. invalid token, user deleted), we MUST clear the session
                    // otherwise we fall back to corrupted/stale local data
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    localStorage.removeItem('activeRole');
                    setUser(null);
                    setRealUser(null);
                }
            } else {
                // No token, ensure clean state
                setUser(null);
                setRealUser(null);
            }
            setLoading(false);
        };

        checkSession();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            const { user, token } = res.data;

            // Clear any old active role settings
            localStorage.removeItem('activeRole');

            setRealUser(user);
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            return { success: true, user };
        } catch (error) {
            console.error("Login failed", error);
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const res = await axios.post('/api/auth/register', userData);
            return { success: true, message: res.data.message };
        } catch (error) {
            console.error("Registration failed", error);
            return { success: false, error: error.response?.data?.error || 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        setRealUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('activeRole');
    };

    const switchRole = () => {
        console.log("switchRole called. realUser:", realUser);
        if (!realUser || realUser.role !== 'business') {
            console.warn("switchRole aborted: Not a business user or realUser missing.");
            return;
        }

        const newRole = user.role === 'business' ? 'user' : 'business';
        console.log("Switching role to:", newRole);

        setUser(prev => {
            const updated = { ...prev, role: newRole };
            console.log("New User State:", updated);
            return updated;
        });

        localStorage.setItem('activeRole', newRole);
    };

    const value = {
        user,
        realUser, // Expose real user to check eligibility
        loading,
        login,
        register,
        logout,
        switchRole
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
