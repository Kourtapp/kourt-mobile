import { useState, useEffect } from 'react';
import { courtService } from '../services/courtService';

export interface Court {
    id: string;
    name: string;
    type: 'public' | 'private';
    sport: string;
    distance: string;
    rating: number;
    price: number | null;
    currentPlayers?: number;
    image?: string;
    latitude: number;
    longitude: number;
    available_now: boolean;
}

const MOCK_COURTS: Court[] = [
    {
        id: '1',
        name: 'Arena Beach Tennis',
        type: 'private',
        sport: 'Beach Tennis',
        distance: '2.5km',
        rating: 4.8,
        price: 80,
        currentPlayers: 4,
        latitude: -23.5505,
        longitude: -46.6333,
        available_now: true,
        image: 'https://images.unsplash.com/photo-1617693322135-1383c4e72320?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: '2',
        name: 'Padel Club SP',
        type: 'private',
        sport: 'Padel',
        distance: '3.2km',
        rating: 4.6,
        price: 120,
        latitude: -23.5555,
        longitude: -46.6444,
        available_now: false,
        image: 'https://images.unsplash.com/photo-1554068865-2484cd13263b?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: '3',
        name: 'Parque Ibirapuera',
        type: 'public',
        sport: 'Futebol',
        distance: '1.5km',
        rating: 4.5,
        price: null,
        currentPlayers: 12,
        latitude: -23.5874,
        longitude: -46.6576,
        available_now: true,
        image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: '4',
        name: 'Quadra Municipal',
        type: 'public',
        sport: 'Basquete',
        distance: '0.8km',
        rating: 4.2,
        price: null,
        latitude: -23.5615,
        longitude: -46.6559,
        available_now: true,
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop',
    },
];

export function useCourts() {
    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCourts = async () => {
        setLoading(true);
        try {
            // Try to fetch from Supabase
            // const data = await courtService.getNearbyCourts(-23.5505, -46.6333);
            // if (data && data.length > 0) {
            //   setCourts(data.map(c => ({ ...c, type: c.type as any })));
            // } else {
            //   throw new Error('No data');
            // }

            // For now, stick with mock data until backend is fully populated
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setCourts(MOCK_COURTS);
        } catch (error) {
            console.log('Error fetching courts, using mock:', error);
            setCourts(MOCK_COURTS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourts();
    }, []);

    return {
        courts,
        nearbyCourts: courts, // For now, same list
        featuredCourts: courts.filter(c => c.rating > 4.5),
        loading,
        refetch: fetchCourts,
    };
}
