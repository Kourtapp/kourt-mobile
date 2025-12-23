import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

export type ServiceCategory =
  | 'personal_trainer'
  | 'sports_coach'
  | 'nutritionist'
  | 'physiotherapist'
  | 'masseuse';

export interface Professional {
  id: string;
  user_id: string;
  bio: string | null;
  specialties: string[];
  qualifications: string | null;
  profile_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalService {
  id: string;
  professional_id: string;
  category: ServiceCategory;
  title: string;
  description: string | null;
  price_cents: number;
  duration_minutes: number | null;
  is_active: boolean;
  created_at: string;
}

export function useProfessionals() {
  const [loading, setLoading] = useState(false);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [services, setServices] = useState<ProfessionalService[]>([]);

  const fetchProfessional = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setProfessional(data as any);

      if (data) {
        const profData = data as any;
        const { data: servicesData, error: servicesError } = await supabase
          .from('professional_services')
          .select('*')
          .eq('professional_id', profData.id)
          .order('created_at', { ascending: false });

        if (servicesError) throw servicesError;
        setServices(servicesData || []);
      }
    } catch (error) {
      logger.error('[useProfessionals] Error fetching professional:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfessional();
  }, [fetchProfessional]);

  async function createProfessional(data: Partial<Professional>) {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const { data: newProfessional, error } = await supabase
        .from('professionals')
        .insert([{ ...data, user_id: user.id }] as any)
        .select()
        .single();

      if (error) throw error;

      setProfessional(newProfessional);
      return newProfessional;
    } catch (error) {
      logger.error('[useProfessionals] Error creating professional:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateProfessional(data: Partial<Professional>) {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !professional) throw new Error('No professional found');

      const { data: updated, error } = await (supabase
        .from('professionals') as any)
        .update(data)
        .eq('id', professional.id)
        .select()
        .single();

      if (error) throw error;

      setProfessional(updated);
      return updated;
    } catch (error) {
      logger.error('[useProfessionals] Error updating professional:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function createService(data: Omit<ProfessionalService, 'id' | 'professional_id' | 'created_at'>) {
    try {
      setLoading(true);
      if (!professional) throw new Error('No professional found');

      const { data: newService, error } = await supabase
        .from('professional_services')
        .insert([{ ...data, professional_id: professional.id }] as any)
        .select()
        .single();

      if (error) throw error;

      setServices(prev => [newService, ...prev]);
      return newService;
    } catch (error) {
      logger.error('[useProfessionals] Error creating service:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateService(serviceId: string, data: Partial<ProfessionalService>) {
    try {
      setLoading(true);

      const { data: updated, error } = await (supabase
        .from('professional_services') as any)
        .update(data)
        .eq('id', serviceId)
        .select()
        .single();

      if (error) throw error;

      setServices(prev => prev.map(s => s.id === serviceId ? updated : s));
      return updated;
    } catch (error) {
      logger.error('[useProfessionals] Error updating service:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function deleteService(serviceId: string) {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('professional_services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      setServices(prev => prev.filter(s => s.id !== serviceId));
    } catch (error) {
      logger.error('[useProfessionals] Error deleting service:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    professional,
    services,
    loading,
    createProfessional,
    updateProfessional,
    createService,
    updateService,
    deleteService,
    refetch: fetchProfessional,
  };
}
