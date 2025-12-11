import { create } from 'zustand';
import { Database } from '../types/database.types';

type Court = Database['public']['Tables']['courts']['Row'];

interface Player {
    id: string;
    name: string;
    avatar?: string;
}

interface MatchStore {
    // Step 1: Sport & Type
    matchType: 'casual' | 'ranked';
    selectedSport: string;

    // Step 2: Location & Time
    selectedCourt: Court | null;
    selectedDate: Date;
    selectedTime: string;
    duration: number; // in minutes

    // Step 3: Players
    isPublic: boolean;
    maxPlayers: number;
    skillLevel: string;
    invitedPlayers: Player[];

    // Step 4: Details
    title: string;
    description: string;

    // Actions
    setMatchType: (type: 'casual' | 'ranked') => void;
    setSport: (sport: string) => void;
    setCourt: (court: Court | null) => void;
    setDate: (date: Date) => void;
    setTime: (time: string) => void;
    setDuration: (duration: number) => void;
    setIsPublic: (isPublic: boolean) => void;
    setMaxPlayers: (max: number) => void;
    setSkillLevel: (level: string) => void;
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    addInvitedPlayer: (player: Player) => void;
    removeInvitedPlayer: (playerId: string) => void;
    resetMatch: () => void;
}

const initialState = {
    matchType: 'casual' as const,
    selectedSport: '',
    selectedCourt: null,
    selectedDate: new Date(),
    selectedTime: '',
    duration: 60,
    isPublic: true,
    maxPlayers: 4,
    skillLevel: 'all',
    invitedPlayers: [],
    title: '',
    description: '',
};

export const useMatchStore = create<MatchStore>((set) => ({
    ...initialState,

    setMatchType: (type) => set({ matchType: type }),
    setSport: (sport) => set({ selectedSport: sport }),
    setCourt: (court) => set({ selectedCourt: court }),
    setDate: (date) => set({ selectedDate: date }),
    setTime: (time) => set({ selectedTime: time }),
    setDuration: (duration) => set({ duration }),
    setIsPublic: (isPublic) => set({ isPublic }),
    setMaxPlayers: (max) => set({ maxPlayers: max }),
    setSkillLevel: (level) => set({ skillLevel: level }),
    setTitle: (title) => set({ title }),
    setDescription: (description) => set({ description }),
    addInvitedPlayer: (player) => set((state) => ({
        invitedPlayers: [...state.invitedPlayers, player]
    })),
    removeInvitedPlayer: (playerId) => set((state) => ({
        invitedPlayers: state.invitedPlayers.filter(p => p.id !== playerId)
    })),
    resetMatch: () => set(initialState),
}));
