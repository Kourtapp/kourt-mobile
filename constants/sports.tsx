import { Dribbble, Trophy, Target, Grid } from 'lucide-react-native';
import { RacketIcon } from '../components/icons/RacketIcon';

export const SPORTS = [
    { id: 'beachtennis', name: 'Beach Tennis', icon: RacketIcon, color: '#FDBA74' },
    { id: 'tennis', name: 'Tennis', icon: RacketIcon, color: '#A3E635' },
    { id: 'futevolei', name: 'Futevôlei', icon: Dribbble, color: '#9CA3AF' },
    { id: 'padel', name: 'Padel', icon: Grid, color: '#60A5FA' },
    { id: 'pickleball', name: 'Pickleball', icon: Target, color: '#F472B6' },
    { id: 'volei', name: 'Vôlei', icon: Trophy, color: '#FCD34D' },
    { id: 'basketball', name: 'Basquete', icon: Dribbble, color: '#F97316' },
    { id: 'soccer', name: 'Futebol', icon: Dribbble, color: '#10B981' },
];

// Map for quick lookup by sport ID
export const SPORTS_MAP: Record<string, { name: string; emoji: string; color: string }> = {
    'beach-tennis': { name: 'Beach Tennis', emoji: '🏸', color: '#FDBA74' },
    'beachtennis': { name: 'Beach Tennis', emoji: '🏸', color: '#FDBA74' },
    'tennis': { name: 'Tennis', emoji: '🎾', color: '#A3E635' },
    'futevolei': { name: 'Futevôlei', emoji: '⚽', color: '#9CA3AF' },
    'padel': { name: 'Padel', emoji: '🎾', color: '#60A5FA' },
    'pickleball': { name: 'Pickleball', emoji: '🏓', color: '#F472B6' },
    'volei': { name: 'Vôlei', emoji: '🏐', color: '#FCD34D' },
    'volleyball': { name: 'Vôlei', emoji: '🏐', color: '#FCD34D' },
    'basketball': { name: 'Basquete', emoji: '🏀', color: '#F97316' },
    'soccer': { name: 'Futebol', emoji: '⚽', color: '#10B981' },
    'football': { name: 'Futebol', emoji: '⚽', color: '#10B981' },
};
