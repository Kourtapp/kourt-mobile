import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

/**
 * Service to interact with Stripe via Supabase Edge Functions
 */
export const stripeService = {
    /**
     * Create a Payment Intent for card payments
     */
    async createPaymentIntent(params: {
        amount: number; // in cents
        currency?: string;
        booking_id?: string;
        customer_email?: string;
    }): Promise<{
        clientSecret: string;
        paymentIntentId: string;
    }> {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
            body: {
                amount: params.amount,
                currency: params.currency || 'brl',
                booking_id: params.booking_id,
                customer_email: params.customer_email,
            },
        });

        if (error) {
            logger.error('[stripeService] createPaymentIntent error:', error);
            throw new Error('Erro ao criar intenção de pagamento');
        }

        return data;
    },

    /**
     * Create a PIX payment
     */
    async createPixPayment(params: {
        amount: number; // in cents
        booking_id?: string;
        customer_email?: string;
        customer_name?: string;
        customer_tax_id?: string; // CPF
    }): Promise<{
        paymentIntentId: string;
        pixQrCode: string;
        pixQrCodeBase64: string;
        expiresAt: string;
    }> {
        const { data, error } = await supabase.functions.invoke('create-pix-payment', {
            body: {
                amount: params.amount,
                booking_id: params.booking_id,
                customer_email: params.customer_email,
                customer_name: params.customer_name,
                customer_tax_id: params.customer_tax_id,
            },
        });

        if (error) {
            logger.error('[stripeService] createPixPayment error:', error);
            throw new Error('Erro ao criar pagamento PIX');
        }

        return data;
    },

    /**
     * Check payment status
     */
    async checkPaymentStatus(paymentIntentId: string): Promise<{
        status: 'succeeded' | 'processing' | 'requires_payment_method' | 'canceled';
        amount: number;
    }> {
        const { data, error } = await supabase.functions.invoke('check-payment-status', {
            body: { paymentIntentId },
        });

        if (error) {
            logger.error('[stripeService] checkPaymentStatus error:', error);
            throw new Error('Erro ao verificar status do pagamento');
        }

        return data;
    },

    /**
     * Save card for future use
     */
    async createSetupIntent(customerId?: string): Promise<{
        clientSecret: string;
        setupIntentId: string;
    }> {
        const { data, error } = await supabase.functions.invoke('create-setup-intent', {
            body: { customerId },
        });

        if (error) {
            logger.error('[stripeService] createSetupIntent error:', error);
            throw new Error('Erro ao configurar salvamento de cartão');
        }

        return data;
    },

    /**
     * Get saved payment methods for customer
     */
    async getPaymentMethods(customerId: string): Promise<{
        paymentMethods: {
            id: string;
            brand: string;
            last4: string;
            expMonth: number;
            expYear: number;
        }[];
    }> {
        const { data, error } = await supabase.functions.invoke('get-payment-methods', {
            body: { customerId },
        });

        if (error) {
            logger.error('[stripeService] getPaymentMethods error:', error);
            throw new Error('Erro ao buscar métodos de pagamento');
        }

        return data;
    },

    /**
     * Delete a saved payment method
     */
    async deletePaymentMethod(paymentMethodId: string): Promise<void> {
        const { error } = await supabase.functions.invoke('delete-payment-method', {
            body: { paymentMethodId },
        });

        if (error) {
            logger.error('[stripeService] deletePaymentMethod error:', error);
            throw new Error('Erro ao remover método de pagamento');
        }
    },

    /**
     * Create or get Stripe customer
     */
    async getOrCreateCustomer(params: {
        email: string;
        name?: string;
    }): Promise<{
        customerId: string;
    }> {
        const { data, error } = await supabase.functions.invoke('get-or-create-customer', {
            body: params,
        });

        if (error) {
            logger.error('[stripeService] getOrCreateCustomer error:', error);
            throw new Error('Erro ao configurar cliente');
        }

        return data;
    },
};

export default stripeService;
