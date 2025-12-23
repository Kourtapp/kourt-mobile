import { create } from 'zustand';
import { stripeService } from '@/services/stripeService';
import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';

export interface PaymentMethod {
    id: string;
    brand: string;
    last4: string;
    expiry?: string;
    expMonth?: number;
    expYear?: number;
}

interface PaymentStore {
    selectedCard: PaymentMethod | null;
    cards: PaymentMethod[];
    stripeCustomerId: string | null;
    loading: boolean;
    error: string | null;

    setSelectedCard: (card: PaymentMethod | null) => void;
    loadSavedCards: () => Promise<void>;
    addCard: (card: PaymentMethod) => void;
    removeCard: (cardId: string) => Promise<void>;
    initializeCustomer: () => Promise<string | null>;
    reset: () => void;
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
    selectedCard: null,
    cards: [],
    stripeCustomerId: null,
    loading: false,
    error: null,

    setSelectedCard: (card) => set({ selectedCard: card }),

    initializeCustomer: async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            // Check if user already has a Stripe customer ID in their profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('stripe_customer_id')
                .eq('id', user.id)
                .single();

            const profileData = profile as any;
            if (profileData?.stripe_customer_id) {
                set({ stripeCustomerId: profileData.stripe_customer_id });
                return profileData.stripe_customer_id;
            }

            // Create new Stripe customer
            const { customerId } = await stripeService.getOrCreateCustomer({
                email: user.email || '',
                name: user.user_metadata?.name || '',
            });

            // Save to profile
            await (supabase
                .from('profiles') as any)
                .update({ stripe_customer_id: customerId })
                .eq('id', user.id);

            set({ stripeCustomerId: customerId });
            return customerId;
        } catch (error) {
            logger.error('[PaymentStore] initializeCustomer error:', error);
            return null;
        }
    },

    loadSavedCards: async () => {
        set({ loading: true, error: null });

        try {
            let customerId = get().stripeCustomerId;

            if (!customerId) {
                customerId = await get().initializeCustomer();
            }

            if (!customerId) {
                set({ cards: [], loading: false });
                return;
            }

            const { paymentMethods } = await stripeService.getPaymentMethods(customerId);

            const cards: PaymentMethod[] = paymentMethods.map((pm) => ({
                id: pm.id,
                brand: pm.brand,
                last4: pm.last4,
                expMonth: pm.expMonth,
                expYear: pm.expYear,
                expiry: `${pm.expMonth.toString().padStart(2, '0')}/${pm.expYear.toString().slice(-2)}`,
            }));

            set({ cards, loading: false });
        } catch (error: any) {
            logger.error('[PaymentStore] loadSavedCards error:', error);
            set({ cards: [], loading: false, error: error.message });
        }
    },

    addCard: (card) => set((state) => ({
        cards: [...state.cards, card],
        selectedCard: card,
    })),

    removeCard: async (cardId) => {
        try {
            await stripeService.deletePaymentMethod(cardId);

            set((state) => ({
                cards: state.cards.filter((c) => c.id !== cardId),
                selectedCard: state.selectedCard?.id === cardId ? null : state.selectedCard,
            }));
        } catch (error: any) {
            logger.error('[PaymentStore] removeCard error:', error);
            throw error;
        }
    },

    reset: () => set({
        selectedCard: null,
        cards: [],
        stripeCustomerId: null,
        loading: false,
        error: null,
    }),
}));
