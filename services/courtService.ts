import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';
import { logger } from '../utils/logger';
import { sanitizeObject } from '../utils/inputValidator';

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

    async createCourt(courtData: any) {
        // ✅ SANITIZE all user inputs to prevent XSS
        const sanitized = sanitizeObject(courtData);

        // ✅ Validate required fields
        if (!sanitized.name || sanitized.name.length < 3) {
            throw new Error('Nome da quadra inválido (mínimo 3 caracteres)');
        }

        if (!sanitized.sport) {
            throw new Error('Esporte é obrigatório');
        }

        // Remove undefined fields to avoid DB errors
        const cleanData = Object.fromEntries(
            Object.entries(sanitized).filter(([_, v]) => v !== undefined && v !== null)
        );

        const { data, error } = await supabase
            .from('courts')
            .insert(cleanData as any)
            .select()
            .single();

        if (error) {
            logger.error('[courtService] Error creating court:', error);
            throw error;
        }

        logger.log('[courtService] Court created successfully:', (data as any).id);
        return data as Court;
    },
};
