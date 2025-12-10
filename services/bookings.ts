import { supabase } from './supabase';
import { Database } from '../types/database.types';

type BookingInsert = Database['public']['Tables']['bookings']['Insert'];

export const createBooking = async (bookingData: BookingInsert) => {
    const { data, error } = await (supabase
        .from('bookings') as any)
        .insert(bookingData)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const processPayment = async ({ booking_id, amount, payment_method_id }: {
    booking_id: string;
    amount: number;
    payment_method_id: string;
}) => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock success response
    return {
        status: 'succeeded',
        transaction_id: `tx_${Math.random().toString(36).substr(2, 9)}`,
    };
};
