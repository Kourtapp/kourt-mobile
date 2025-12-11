import { useState, useEffect } from 'react';


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
    images?: string[];
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
        images: [
            'https://images.unsplash.com/photo-1617693322135-1383c4e72320?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop'
        ]
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
        images: [
            'https://images.unsplash.com/photo-1554068865-2484cd13263b?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1622345579974-95844439c2c5?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop'
        ]
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
        images: [
            'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800&auto=format&fit=crop'
        ]
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
        images: [
            'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1505666287802-931dc83948e9?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1519861531473-920026393112?q=80&w=800&auto=format&fit=crop'
        ]
    },
    {
        id: '5',
        name: 'Vôlei Posto 9',
        type: 'public',
        sport: 'Vôlei de Praia',
        distance: '5.2km',
        rating: 4.7,
        price: null,
        latitude: -23.5700,
        longitude: -46.6800,
        available_now: true,
        image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1599582298687-d86b85642674?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=800&auto=format&fit=crop'
        ]
    },
    {
        id: '6',
        name: 'Tennis Pro Academy',
        type: 'private',
        sport: 'Tênis',
        distance: '4.0km',
        rating: 4.9,
        price: 150,
        latitude: -23.5400,
        longitude: -46.6200,
        available_now: false,
        image: 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?q=80&w=800&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1589146522306-69ee6d400787?q=80&w=800&auto=format&fit=crop'
        ]
    },
    {
        id: '7',
        name: 'Arena Futevôlei SP',
        type: 'private',
        sport: 'Futevôlei',
        distance: '6.5km',
        rating: 4.5,
        price: 90,
        latitude: -23.5900,
        longitude: -46.7000,
        available_now: true,
        image: 'https://images.unsplash.com/photo-1563299796-b729d0af54a5?q=80&w=800&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1563299796-b729d0af54a5?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1627845065448-b3d90ee69354?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1517466787929-bc90951d0528?q=80&w=800&auto=format&fit=crop'
        ]
    },
    {
        id: '8',
        name: 'Complexo Esportivo da Lapa',
        type: 'public',
        sport: 'Poliesportiva',
        distance: '8.0km',
        rating: 4.1,
        price: null,
        latitude: -23.5200,
        longitude: -46.7100,
        available_now: true,
        image: 'https://images.unsplash.com/photo-1588667823528-98e986e7d69e?q=80&w=800&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1588667823528-98e986e7d69e?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop'
        ]
    }
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
