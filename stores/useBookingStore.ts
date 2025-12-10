import { create } from 'zustand';
import { Database } from '../types/database.types';

type Court = Database['public']['Tables']['courts']['Row'];

interface BookingStore {
    court: Court | null;
    date: Date;
    time: string | null;
    duration: number;

    setBookingCourt: (court: Court) => void;
    setBookingDate: (date: Date) => void;
    setBookingTime: (time: string) => void;
    setDuration: (duration: number) => void;
    resetBooking: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
    court: null,
    date: new Date(),
    time: null,
    duration: 1,

    setBookingCourt: (court) => set({ court }),
    setBookingDate: (date) => set({ date }),
    setBookingTime: (time) => set({ time }),
    setDuration: (duration) => set({ duration }),
    resetBooking: () => set({ court: null, date: new Date(), time: null, duration: 1 }),
}));
