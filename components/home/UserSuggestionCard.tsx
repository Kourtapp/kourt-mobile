import React from 'react';
import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface UserSuggestion {
    id: string;
    name: string;
    avatar?: string;
    sport: string;
    reason: string; // "Nível similar", "Por perto", "Contato"
    isOnline?: boolean;
}

interface UserSuggestionCardProps {
    user: UserSuggestion;
    onInvite?: () => void;
}

// Icons
const RacketIcon = ({ size = 14, color = '#6B7280' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
        <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

const PersonIcon = ({ size = 32, color = '#9CA3AF' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
        <Path d="M20 21a8 8 0 10-16 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

export function UserSuggestionCard({ user, onInvite }: UserSuggestionCardProps) {
    return (
        <View
            style={{
                width: 150,
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#E5E7EB',
            }}
        >
            {/* Avatar */}
            <View style={{ position: 'relative', marginBottom: 10 }}>
                <View
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        backgroundColor: '#F3F4F6',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {user.avatar ? (
                        <Image source={{ uri: user.avatar }} style={{ width: 64, height: 64, borderRadius: 32 }} />
                    ) : (
                        <PersonIcon size={32} />
                    )}
                </View>
                {/* Online indicator */}
                {user.isOnline && (
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            width: 14,
                            height: 14,
                            borderRadius: 7,
                            backgroundColor: '#22C55E',
                            borderWidth: 2,
                            borderColor: '#FFFFFF',
                        }}
                    />
                )}
            </View>

            {/* Name */}
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#000', marginBottom: 4 }}>
                {user.name}
            </Text>

            {/* Sport */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <RacketIcon size={12} color="#9CA3AF" />
                <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 4 }}>{user.sport}</Text>
            </View>

            {/* Reason */}
            <Text style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 12 }}>
                {user.reason}
            </Text>

            {/* Invite button */}
            <Pressable
                onPress={onInvite}
                style={{
                    backgroundColor: '#1F2937',
                    paddingHorizontal: 24,
                    paddingVertical: 10,
                    borderRadius: 20,
                    width: '100%',
                    alignItems: 'center',
                }}
            >
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>
                    Convidar
                </Text>
            </Pressable>
        </View>
    );
}

interface UserSuggestionsListProps {
    users: UserSuggestion[];
    onViewAll?: () => void;
    onInvite?: (userId: string) => void;
}

export function UserSuggestionsList({ users, onViewAll, onInvite }: UserSuggestionsListProps) {
    return (
        <View style={{ marginTop: 24 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#000' }}>Sugestões</Text>
                <Pressable onPress={onViewAll}>
                    <Text style={{ fontSize: 14, color: '#6B7280' }}>Ver todos</Text>
                </Pressable>
            </View>

            {/* Horizontal scroll */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
            >
                {users.map((user) => (
                    <UserSuggestionCard
                        key={user.id}
                        user={user}
                        onInvite={() => onInvite?.(user.id)}
                    />
                ))}
            </ScrollView>
        </View>
    );
}
