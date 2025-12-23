import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';
import { stripeService } from './stripeService';
import { logger } from '../utils/logger';
import { sanitizeString } from '../utils/inputValidator';

type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type Booking = Database['public']['Tables']['bookings']['Row'];

export interface CreateBookingParams {
    court_id: string;
    date: string; // YYYY-MM-DD
    start_time: string; // HH:mm
    end_time: string; // HH:mm
    duration_hours: number;
    total_price: number;
    subtotal?: number;
    service_fee?: number;
    discount_amount?: number;
    coupon_code?: string;
    payment_method?: string;
}

export const createBooking = async (params: CreateBookingParams): Promise<Booking> => {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('Você precisa estar logado para fazer uma reserva');
    }

    // Sanitize string inputs
    const sanitizedCouponCode = params.coupon_code ? sanitizeString(params.coupon_code) : undefined;
    const sanitizedPaymentMethod = params.payment_method ? sanitizeString(params.payment_method) : undefined;

    const bookingData: BookingInsert = {
        court_id: params.court_id,
        user_id: user.id,
        date: params.date,
        start_time: params.start_time,
        end_time: params.end_time,
        duration_hours: params.duration_hours,
        total_price: params.total_price,
        subtotal: params.subtotal,
        service_fee: params.service_fee,
        discount_amount: params.discount_amount,
        coupon_code: sanitizedCouponCode,
        payment_method: sanitizedPaymentMethod,
        payment_status: 'pending',
        status: 'pending',
    } as any;

    const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData as any)
        .select()
        .single();

    if (error) {
        logger.error('[createBooking] Error:', error);
        throw new Error('Erro ao criar reserva. Tente novamente.');
    }

    return data as any;
};

export const updateBookingPayment = async (
    bookingId: string,
    paymentData: {
        payment_status: 'succeeded' | 'failed' | 'pending';
        payment_id?: string;
        stripe_payment_intent_id?: string;
        stripe_charge_id?: string;
    }
): Promise<Booking> => {
    const { data, error } = await (supabase
        .from('bookings') as any)
        .update({
            payment_status: paymentData.payment_status,
            payment_id: paymentData.payment_id,
            stripe_payment_intent_id: paymentData.stripe_payment_intent_id,
            stripe_charge_id: paymentData.stripe_charge_id,
            status: paymentData.payment_status === 'succeeded' ? 'confirmed' : 'pending',
        })
        .eq('id', bookingId)
        .select()
        .single();

    if (error) {
        logger.error('[updateBookingPayment] Error:', error);
        throw error;
    }

    return data as any;
};

export const getBooking = async (bookingId: string): Promise<Booking & { court: any }> => {
    const { data, error } = await supabase
        .from('bookings')
        .select(`
            *,
            court:courts (
                id,
                name,
                address,
                images,
                sport
            )
        `)
        .eq('id', bookingId)
        .single();

    if (error) throw error;
    return data as any;
};

export const getUserBookings = async (): Promise<(Booking & { court: any })[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('bookings')
        .select(`
            *,
            court:courts (
                id,
                name,
                address,
                images,
                sport
            )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

    if (error) throw error;
    return (data as any) || [];
};

export const cancelBooking = async (bookingId: string, reason?: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autenticado');

    const { error } = await (supabase
        .from('bookings') as any)
        .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            cancelled_by: user.id,
            cancellation_reason: reason,
        })
        .eq('id', bookingId)
        .eq('user_id', user.id); // Ensure user owns booking

    if (error) throw error;
};

/**
 * Process payment with Stripe
 * Returns clientSecret for frontend to confirm payment
 */
export const createPaymentForBooking = async ({
    booking_id,
    amount,
    customer_email,
}: {
    booking_id: string;
    amount: number;
    customer_email?: string;
}): Promise<{ clientSecret: string; paymentIntentId: string }> => {
    // Amount should be in cents for Stripe
    const amountInCents = Math.round(amount * 100);

    const result = await stripeService.createPaymentIntent({
        amount: amountInCents,
        currency: 'brl',
        booking_id,
        customer_email,
    });

    // Update booking with payment intent ID (status still pending)
    await updateBookingPayment(booking_id, {
        payment_status: 'pending',
        stripe_payment_intent_id: result.paymentIntentId,
    });

    return result;
};

/**
 * Create PIX payment for booking
 */
export const createPixPaymentForBooking = async ({
    booking_id,
    amount,
    customer_email,
    customer_name,
    customer_tax_id,
}: {
    booking_id: string;
    amount: number;
    customer_email?: string;
    customer_name?: string;
    customer_tax_id?: string;
}): Promise<{
    paymentIntentId: string;
    pixQrCode: string;
    pixQrCodeBase64: string;
    expiresAt: string;
}> => {
    const amountInCents = Math.round(amount * 100);

    const result = await stripeService.createPixPayment({
        amount: amountInCents,
        booking_id,
        customer_email,
        customer_name,
        customer_tax_id,
    });

    // Update booking with payment intent ID
    await updateBookingPayment(booking_id, {
        payment_status: 'pending',
        stripe_payment_intent_id: result.paymentIntentId,
    });

    return result;
};

/**
 * Confirm payment was successful (called after Stripe confirms)
 */
export const confirmBookingPayment = async (
    bookingId: string,
    paymentIntentId: string
): Promise<void> => {
    await updateBookingPayment(bookingId, {
        payment_status: 'succeeded',
        stripe_payment_intent_id: paymentIntentId,
    });
};

// Legacy mock function - keeping for backwards compatibility but marked deprecated
/** @deprecated Use createPaymentForBooking instead */
export const processPayment = async ({
    booking_id,
    amount,
    payment_method_id
}: {
    booking_id: string;
    amount: number;
    payment_method_id: string;
}): Promise<{ status: 'succeeded' | 'failed'; transaction_id: string }> => {
    logger.warn('[DEPRECATED] processPayment is deprecated. Use createPaymentForBooking with Stripe instead.');

    // For backwards compatibility, create real payment
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const result = await createPaymentForBooking({
            booking_id,
            amount,
            customer_email: user?.email || undefined,
        });

        return {
            status: 'succeeded',
            transaction_id: result.paymentIntentId,
        };
    } catch (error) {
        logger.error('[processPayment] Error:', error);
        return {
            status: 'failed',
            transaction_id: '',
        };
    }
};

// Check court availability for a specific date/time
export const checkAvailability = async (
    courtId: string,
    date: string,
    startTime: string,
    endTime: string
): Promise<boolean> => {
    const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('court_id', courtId)
        .eq('date', date)
        .neq('status', 'cancelled')
        .or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`);

    if (error) {
        logger.error('[checkAvailability] Error:', error);
        return false;
    }

    // If no conflicting bookings found, the slot is available
    return (data as any).length === 0;
};
