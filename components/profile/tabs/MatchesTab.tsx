import { View } from 'react-native';
import { FeedPost } from '../../social/FeedPost';

// Mock data strictly for the profile view
const RECENT_MATCHES = [
    {
        id: 'm1',
        type: 'match_result',
        user: { name: 'Bruno Silva', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&auto=format&fit=crop', verified: true },
        time: '2h',
        sport: 'Beach Tennis',
        content: 'Vitória suada hoje contra essa dupla fera! 🎾🔥',
        data: {
            result: 'win',
            score: ['6-3', '6-4'],
            duration: '1h 15min',
            location: 'Arena 7 Beach Club',
            team1: {
                player1: { name: 'Bruno Silva', level: 'PRO', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&auto=format&fit=crop' }
            },
            team2: {
                player1: { name: 'Pedro F.', level: 'Avançado', image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' }
            }
        },
        stats: { likes: 24, comments: 5 }
    },
    {
        id: 'm2',
        type: 'match_result',
        user: { name: 'Bruno Silva', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&auto=format&fit=crop', verified: true },
        time: 'Ontem',
        sport: 'Padel',
        content: 'Treino de Padel para soltar o braço! 💪',
        data: {
            result: 'win',
            score: ['6-2', '6-0'],
            duration: '45min',
            location: 'Padel House',
            team1: {
                player1: { name: 'Bruno Silva', level: 'PRO', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&auto=format&fit=crop' }
            },
            team2: {
                player1: { name: 'Marcos S.', level: 'Iniciante', image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }
            }
        },
        stats: { likes: 42, comments: 12 }
    }
];

export function MatchesTab() {
    return (
        <View className="pb-10">
            {RECENT_MATCHES.map((post) => (
                <FeedPost key={post.id} post={post} />
            ))}
        </View>
    );
}
