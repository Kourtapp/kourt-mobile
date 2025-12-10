import { supabase } from './supabase';
import { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const userService = {
    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    async updateProfile(userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) {
        const { data, error } = await (supabase
            .from('profiles') as any)
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async checkUsernameAvailability(username: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .single();

        if (error && error.code === 'PGRST116') return true; // Not found, so available
        if (error) throw error;
        return false; // Found, so not available
    },
};
