import { supabase } from './supabase';
import { Database } from '../types/database.types';

type Court = Database['public']['Tables']['courts']['Row'];

export const courtService = {
    async getNearbyCourts(latitude: number, longitude: number, radiusKm: number = 10) {
        const { data, error } = await (supabase.rpc as any)('get_nearby_courts', {
            p_latitude: latitude,
            p_longitude: longitude,
            p_radius_km: radiusKm,
        });

        if (error) throw error;
        return data;
    },

    async getCourtDetails(courtId: string) {
        const { data, error } = await supabase
            .from('courts')
            .select('*')
            .eq('id', courtId)
            .single();

        if (error) throw error;
        return data;
    },

    async getFeaturedCourts() {
        const { data, error } = await supabase
            .from('courts')
            .select('*')
            .eq('is_active', true)
            .order('rating', { ascending: false })
            .limit(5);

        if (error) throw error;
        return data;
    },
};
