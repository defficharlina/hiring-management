import { supabase } from '../lib/supabase';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignUpData extends LoginCredentials {
    fullName: string;
    role?: 'admin' | 'user';
}

export const authService = {
    // Login
    async login(credentials: LoginCredentials) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) throw error;

        // Get user role from users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role, full_name')
            .eq('id', data.user?.id)
            .single();

        if (userError) throw userError;

        return {
            user: data.user,
            session: data.session,
            role: userData.role,
            fullName: userData.full_name,
        };
    },

    // Sign up
    async signUp(signUpData: SignUpData) {
        const { data, error } = await supabase.auth.signUp({
            email: signUpData.email,
            password: signUpData.password,
        });

        if (error) throw error;

        // Insert user data into users table
        if (data.user) {
            const { error: insertError } = await supabase
                .from('users')
                .insert({
                    id: data.user.id,
                    email: signUpData.email,
                    role: signUpData.role || 'user',
                    full_name: signUpData.fullName,
                    password_hash: 'managed_by_supabase_auth', // Dummy value karena password dikelola oleh Supabase Auth
                });

            if (insertError) throw insertError;
        }

        return data;
    },

    // Logout
    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    // Get current session
    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    },

    // Get current user
    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (user) {
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('role, full_name')
                .eq('id', user.id)
                .single();

            if (userError) throw userError;

            return {
                ...user,
                role: userData.role,
                fullName: userData.full_name,
            };
        }

        return null;
    },
};
