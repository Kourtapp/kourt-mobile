import { create } from 'zustand';
import { Database } from '../types/database.types';

type Court = Database['public']['Tables']['courts']['Row'];

interface CourtStore {
    court: Court | null;
    loading: boolean;
    setCourt: (court: Court | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useCourtStore = create<CourtStore>((set) => ({
    court: null,
    loading: false,
    setCourt: (court) => set({ court }),
    setLoading: (loading) => set({ loading }),
}));
