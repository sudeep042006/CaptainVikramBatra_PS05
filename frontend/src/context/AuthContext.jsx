import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Attempt to get session (works for real supabase or returns null for mock)
        supabase.auth.getSession().then(({ data }) => {
            if (data && data.session) {
                setSession(data.session);
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email) => {
        // Mock Login: Manually set a session object
        const mockSession = {
            user: { email: email || 'demo@neurcall.ai', id: 'mock-user-id' },
            access_token: 'mock-token'
        };
        setSession(mockSession);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    const value = {
        session,
        loading,
        user: session?.user,
        login, // Exported for Login.jsx
        signOut
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
