import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { logger } from '../utils/logger';

// Tipos de consentimento conforme LGPD
export type ConsentType = 'location' | 'camera' | 'notifications' | 'analytics' | 'marketing';

export interface ConsentState {
  type: ConsentType;
  granted: boolean;
  grantedAt: Date | null;
  revokedAt: Date | null;
}

export interface ConsentInfo {
  type: ConsentType;
  title: string;
  description: string;
  essential: boolean; // Se é essencial para funcionamento básico
  icon: string;
}

// Informações sobre cada tipo de consentimento
export const CONSENT_INFO: Record<ConsentType, ConsentInfo> = {
  location: {
    type: 'location',
    title: 'Localização',
    description: 'Usado para encontrar quadras próximas e sugerir partidas na sua região.',
    essential: false,
    icon: 'location-on',
  },
  camera: {
    type: 'camera',
    title: 'Câmera e Fotos',
    description: 'Permite adicionar foto de perfil, fotos de partidas e compartilhar momentos.',
    essential: false,
    icon: 'camera-alt',
  },
  notifications: {
    type: 'notifications',
    title: 'Notificações',
    description: 'Receba alertas sobre convites para partidas, mensagens e atualizações importantes.',
    essential: false,
    icon: 'notifications',
  },
  analytics: {
    type: 'analytics',
    title: 'Análise de Uso',
    description: 'Ajuda a melhorar o app analisando como você o usa (dados anônimos).',
    essential: false,
    icon: 'analytics',
  },
  marketing: {
    type: 'marketing',
    title: 'Marketing',
    description: 'Receba novidades, promoções e dicas personalizadas sobre esportes e eventos.',
    essential: false,
    icon: 'campaign',
  },
};

const STORAGE_KEY = '@kourt:consents';

interface UseConsentReturn {
  consents: Record<ConsentType, ConsentState>;
  loading: boolean;
  hasCompletedOnboarding: boolean;
  grantConsent: (type: ConsentType) => Promise<void>;
  revokeConsent: (type: ConsentType) => Promise<void>;
  grantAllConsents: () => Promise<void>;
  revokeAllConsents: () => Promise<void>;
  acceptEssentialOnly: () => Promise<void>;
  hasConsent: (type: ConsentType) => boolean;
  completeConsentOnboarding: () => Promise<void>;
}

export function useConsent(): UseConsentReturn {
  const { user } = useAuthStore();
  const [consents, setConsents] = useState<Record<ConsentType, ConsentState>>({
    location: { type: 'location', granted: false, grantedAt: null, revokedAt: null },
    camera: { type: 'camera', granted: false, grantedAt: null, revokedAt: null },
    notifications: { type: 'notifications', granted: false, grantedAt: null, revokedAt: null },
    analytics: { type: 'analytics', granted: false, grantedAt: null, revokedAt: null },
    marketing: { type: 'marketing', granted: false, grantedAt: null, revokedAt: null },
  });
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Load consents from AsyncStorage and Supabase
  const loadConsents = useCallback(async () => {
    setLoading(true);
    try {
      // First, try to load from AsyncStorage (faster, works offline)
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConsents(parsed.consents);
        setHasCompletedOnboarding(parsed.hasCompletedOnboarding || false);
      }

      // Then sync with Supabase if user is logged in
      if (user?.id) {
        const { data, error } = await supabase
          .from('user_consents')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          logger.error('[useConsent] Error loading from Supabase:', error);
        } else if (data && data.length > 0) {
          const newConsents = { ...consents };
          data.forEach((record: any) => {
            const type = record.consent_type as ConsentType;
            newConsents[type] = {
              type,
              granted: record.granted,
              grantedAt: record.granted_at ? new Date(record.granted_at) : null,
              revokedAt: record.revoked_at ? new Date(record.revoked_at) : null,
            };
          });
          setConsents(newConsents);

          // Save to AsyncStorage
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
            consents: newConsents,
            hasCompletedOnboarding: true,
          }));
          setHasCompletedOnboarding(true);
        }
      }
    } catch (err) {
      logger.error('[useConsent] Error loading consents:', err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Save consent to both AsyncStorage and Supabase
  const saveConsent = useCallback(async (type: ConsentType, granted: boolean) => {
    const now = new Date();
    const newState: ConsentState = {
      type,
      granted,
      grantedAt: granted ? now : consents[type].grantedAt,
      revokedAt: !granted ? now : null,
    };

    // Update local state
    const newConsents = { ...consents, [type]: newState };
    setConsents(newConsents);

    // Save to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      consents: newConsents,
      hasCompletedOnboarding,
    }));

    // Save to Supabase if user is logged in
    if (user?.id) {
      try {
        const { error } = await (supabase
          .from('user_consents') as any)
          .upsert({
            user_id: user.id,
            consent_type: type,
            granted,
            granted_at: granted ? now.toISOString() : null,
            revoked_at: !granted ? now.toISOString() : null,
          }, {
            onConflict: 'user_id,consent_type',
          });

        if (error) {
          logger.error('[useConsent] Error saving to Supabase:', error);
        }
      } catch (err) {
        logger.error('[useConsent] Error saving consent:', err);
      }
    }
  }, [consents, user?.id, hasCompletedOnboarding]);

  // Grant a specific consent
  const grantConsent = useCallback(async (type: ConsentType) => {
    await saveConsent(type, true);
    logger.log(`[useConsent] Granted consent: ${type}`);
  }, [saveConsent]);

  // Revoke a specific consent
  const revokeConsent = useCallback(async (type: ConsentType) => {
    await saveConsent(type, false);
    logger.log(`[useConsent] Revoked consent: ${type}`);
  }, [saveConsent]);

  // Grant all consents
  const grantAllConsents = useCallback(async () => {
    const types: ConsentType[] = ['location', 'camera', 'notifications', 'analytics', 'marketing'];
    for (const type of types) {
      await saveConsent(type, true);
    }
    logger.log('[useConsent] Granted all consents');
  }, [saveConsent]);

  // Revoke all consents (LGPD Art. 18)
  const revokeAllConsents = useCallback(async () => {
    const types: ConsentType[] = ['location', 'camera', 'notifications', 'analytics', 'marketing'];
    for (const type of types) {
      await saveConsent(type, false);
    }

    // Call Supabase function to revoke all at once
    if (user?.id) {
      try {
        const { error } = await (supabase.rpc as any)('revoke_all_user_consents', {
          p_user_id: user.id,
        });
        if (error) {
          logger.error('[useConsent] Error revoking all consents:', error);
        }
      } catch (err) {
        logger.error('[useConsent] Error calling revoke function:', err);
      }
    }

    logger.log('[useConsent] Revoked all consents');
  }, [saveConsent, user?.id]);

  // Accept only essential consents (reject non-essential)
  const acceptEssentialOnly = useCallback(async () => {
    const types: ConsentType[] = ['location', 'camera', 'notifications', 'analytics', 'marketing'];
    for (const type of types) {
      const essential = CONSENT_INFO[type].essential;
      await saveConsent(type, essential);
    }
    logger.log('[useConsent] Accepted essential consents only');
  }, [saveConsent]);

  // Check if a specific consent is granted
  const hasConsent = useCallback((type: ConsentType): boolean => {
    return consents[type].granted;
  }, [consents]);

  // Mark consent onboarding as complete
  const completeConsentOnboarding = useCallback(async () => {
    setHasCompletedOnboarding(true);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      consents,
      hasCompletedOnboarding: true,
    }));
    logger.log('[useConsent] Completed consent onboarding');
  }, [consents]);

  // Load consents on mount
  useEffect(() => {
    loadConsents();
  }, [loadConsents]);

  // Subscribe to changes if user is logged in
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`consents-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_consents',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          logger.log('[useConsent] Consent changed:', payload);
          loadConsents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, loadConsents]);

  return {
    consents,
    loading,
    hasCompletedOnboarding,
    grantConsent,
    revokeConsent,
    grantAllConsents,
    revokeAllConsents,
    acceptEssentialOnly,
    hasConsent,
    completeConsentOnboarding,
  };
}
