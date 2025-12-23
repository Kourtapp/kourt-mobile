import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { MessageSquare, Bell } from 'lucide-react-native';

interface HomeHeaderProps {
    location: string;
    unreadNotifications: number;
    onLocationPress?: () => void;
    searchQuery?: string;
    onSearchChange?: (text: string) => void;
    onSearchPress?: () => void;
    selectedCategories?: string[];
    onCategoryToggle?: (category: string) => void;
    onFilterPress?: () => void;
}

// Custom Icons
const MapPinIcon = ({ size = 16, color = '#22C55E' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </Svg>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BellIcon = ({ size = 24, color = '#000' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChatIcon = ({ size = 24, color = '#000' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const SearchIcon = ({ size = 20, color = '#9CA3AF' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
        <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

const FilterIcon = ({ size = 20, color = '#000' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4 6h16M7 12h10M10 18h4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

const ChevronDownIcon = ({ size = 16, color = '#6B7280' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const GridIcon = ({ size = 18, color = '#fff' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
        <Rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
        <Rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
        <Rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
    </Svg>
);

const PublicIcon = ({ size = 16, color = '#000' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L2 7l10 5 10-5-10-5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M2 17l10 5 10-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M2 12l10 5 10-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PrivateIcon = ({ size = 16, color = '#000' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
        <Rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
        <Rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
        <Rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
    </Svg>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HomeIcon = ({ size = 16, color = '#000' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M9 22V12h6v10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const DollarIcon = ({ size = 16, color = '#000' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
        <Path d="M12 6v12M9 9.5c0-.83.67-1.5 1.5-1.5h3c.83 0 1.5.67 1.5 1.5S14.33 11 13.5 11h-3c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h3c.83 0 1.5.67 1.5 1.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

const RacketIcon = ({ size = 16, color = '#000' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
        <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

const CATEGORIES = [
    { id: 'all', name: 'Todos', icon: GridIcon },
    { id: 'public', name: 'Públicas', icon: PublicIcon },
    { id: 'paid', name: 'Pagas', icon: DollarIcon },
    { id: 'beach-tennis', name: 'Beach Tennis', icon: RacketIcon },
    { id: 'padel', name: 'Padel', icon: RacketIcon },
    { id: 'tennis', name: 'Tênis', icon: RacketIcon },
    { id: 'futevolei', name: 'Futevôlei', icon: RacketIcon },
    { id: 'volleyball', name: 'Vôlei', icon: RacketIcon },
];

// Helper to extract city name from full address
const extractCityName = (location: string): string => {
    // If it contains comma, take first part (city) or last part before state
    if (location.includes(',')) {
        const parts = location.split(',').map(p => p.trim());
        // Return the city part (usually first meaningful part)
        return parts[0];
    }
    return location;
};

export function HomeHeader({
    location,
    unreadNotifications,
    onLocationPress,
    searchQuery = '',
    onSearchChange,
    onSearchPress,
    selectedCategories = [],
    onCategoryToggle,
    onFilterPress,
}: HomeHeaderProps) {
    const cityName = extractCityName(location);

    return (
        <View style={{ backgroundColor: '#FFFFFF', paddingTop: 60, paddingBottom: 12 }}>
            {/* Top Row: Logo, Location, Bell */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                marginBottom: 16,
                gap: 12,
            }}>
                {/* Logo */}
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#000', letterSpacing: 1 }}>
                    KOURT
                </Text>

                {/* Right Side Container */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    {/* Location Badge */}
                    <Pressable
                        onPress={onLocationPress}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel={`Localização atual: ${cityName}`}
                        accessibilityHint="Toque duas vezes para mudar a localização"
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#F3F4F6',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 16,
                            gap: 4,
                        }}
                    >
                        <MapPinIcon size={12} color="#22C55E" />
                        <Text
                            style={{ fontSize: 12, color: '#374151', fontWeight: '500', maxWidth: 100 }}
                            numberOfLines={1}
                        >
                            {cityName}
                        </Text>
                        <ChevronDownIcon size={12} color="#6B7280" />
                    </Pressable>

                    {/* Chat */}
                    <Pressable
                        onPress={() => router.push('/messages')}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="Mensagens"
                        accessibilityHint="Toque duas vezes para ver suas mensagens"
                        style={{
                            width: 40,
                            height: 40,
                            backgroundColor: '#FFFFFF',
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: '#F1F5F9',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 2,
                            elevation: 2,
                        }}
                    >
                        <MessageSquare size={20} color="#1E293B" />
                    </Pressable>

                    {/* Notification Bell */}
                    <Pressable
                        onPress={() => router.push('/notifications')}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel={unreadNotifications > 0
                            ? `Notificações: ${unreadNotifications} não lidas`
                            : "Notificações"
                        }
                        accessibilityHint="Toque duas vezes para ver suas notificações"
                        style={{
                            width: 40,
                            height: 40,
                            backgroundColor: '#FFFFFF',
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: '#F1F5F9',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 2,
                            elevation: 2,
                            position: 'relative'
                        }}
                    >
                        <Bell size={20} color="#1E293B" />
                        {unreadNotifications > 0 && (
                            <View style={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                width: 16,
                                height: 16,
                                borderRadius: 8,
                                backgroundColor: '#EF4444',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 2,
                                borderColor: '#FFFFFF',
                            }}>
                                <Text style={{ fontSize: 9, fontWeight: '700', color: '#FFFFFF' }}>
                                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                </View>
            </View>

            {/* Search Bar */}
            <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
                <Pressable
                    onPress={onSearchPress}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#F9FAFB',
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                        borderRadius: 12,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                    }}
                >
                    <SearchIcon size={20} color="#9CA3AF" />
                    {onSearchPress ? (
                        <Text style={{ flex: 1, fontSize: 16, color: '#9CA3AF', marginLeft: 8 }}>
                            {searchQuery || 'Buscar quadras, jogadores...'}
                        </Text>
                    ) : (
                        <TextInput
                            value={searchQuery}
                            onChangeText={onSearchChange}
                            placeholder="Buscar quadras, jogadores..."
                            placeholderTextColor="#9CA3AF"
                            style={{
                                flex: 1,
                                fontSize: 16,
                                color: '#000',
                                marginLeft: 8,
                            }}
                        />
                    )}

                    {onFilterPress && (
                        <Pressable onPress={onFilterPress} style={{ paddingLeft: 8 }}>
                            <FilterIcon size={20} color="#000" />
                        </Pressable>
                    )}
                </Pressable>
            </View>
            {/* Category Pills - Horizontal Scroll */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    gap: 8,
                }}
            >
                {CATEGORIES.map((category) => {
                    const isSelected = category.id === 'all'
                        ? selectedCategories.length === 0
                        : selectedCategories.includes(category.id);
                    const IconComponent = category.icon;
                    return (
                        <Pressable
                            key={category.id}
                            onPress={() => onCategoryToggle?.(category.id)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderRadius: 20,
                                backgroundColor: isSelected ? '#1F2937' : '#FFFFFF',
                                borderWidth: 1,
                                borderColor: isSelected ? '#1F2937' : '#E5E7EB',
                                gap: 5,
                            }}
                        >
                            <IconComponent size={14} color={isSelected ? '#FFFFFF' : '#000'} />
                            <Text style={{
                                fontSize: 13,
                                fontWeight: '500',
                                color: isSelected ? '#FFFFFF' : '#000',
                            }}>
                                {category.name}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}
