import { supabase } from './supabase';
import { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const authService = {
    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    async updateProfile(userId: string, updates: Partial<Profile>) {
        const { data, error } = await (supabase
            .from('profiles') as any)
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },
};
