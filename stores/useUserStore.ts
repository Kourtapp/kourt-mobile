import { create } from 'zustand';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    location: string;
    avatar_url?: string;
    sports: Array<{ id: string; name: string; icon: string }>;
    level: number;
    xp: number;
    xp_to_next_level: number;
    streak: number;
    wins: number;
    matches_count: number;
    is_pro: boolean;
    is_verified: boolean;
}

interface UserState {
    user: { id: string } | null;
    profile: UserProfile | null;
    loading: boolean;
    setUser: (user: { id: string } | null) => void;
    setProfile: (profile: UserProfile | null) => void;
    updateProfile: (updates: Partial<UserProfile>) => void;
}

// Mock initial data
const mockProfile: UserProfile = {
    id: '1',
    name: 'Bruno Silva',
    email: 'bruno@example.com',
    location: 'São Paulo, SP',
    sports: [
        { id: 'beach-tennis', name: 'Beach Tennis', icon: 'sports-tennis' },
        { id: 'padel', name: 'Padel', icon: 'sports-tennis' },
        { id: 'football', name: 'Futebol', icon: 'sports-soccer' },
    ],
    level: 12,
    xp: 2450,
    xp_to_next_level: 3000,
    streak: 7,
    wins: 165,
    matches_count: 112,
    is_pro: true,
    is_verified: true,
};

export const useUserStore = create<UserState>((set) => ({
    user: { id: '1' }, // Mock logged in user
    profile: mockProfile,
    loading: false,
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    updateProfile: (updates) =>
        set((state) => ({
            profile: state.profile ? { ...state.profile, ...updates } : null,
        })),
}));
