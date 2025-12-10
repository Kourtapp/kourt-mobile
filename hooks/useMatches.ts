import { useState, useEffect } from 'react';

export interface Match {
    id: string;
    sport: string;
    time: string;
    location: string;
    spotsLeft: number;
    max_players: number;
    players: any[];
}

const MOCK_MATCHES: Match[] = [
    {
        id: '1',
        sport: 'beach-tennis',
        time: 'Hoje, 19:00',
        location: 'Arena Beach Tennis',
        spotsLeft: 1,
        max_players: 4,
        players: [],
    },
    {
        id: '2',
        sport: 'football',
        time: 'Amanhã, 20:00',
        location: 'Playball Pompeia',
        spotsLeft: 3,
        max_players: 12,
        players: [],
    },
    {
        id: '3',
        sport: 'padel',
        time: 'Hoje, 18:30',
        location: 'Padel Club',
        spotsLeft: 2,
        max_players: 4,
        players: [],
    },
];

export function useMatches() {
    const [openMatches, setOpenMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMatches = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setOpenMatches(MOCK_MATCHES);
        setLoading(false);
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    return {
        openMatches,
        loading,
        refetch: fetchMatches,
    };
}
