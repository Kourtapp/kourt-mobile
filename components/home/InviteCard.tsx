import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface Invite {
    id: string;
    senderName: string;
    senderAvatar?: string;
    message: string;
    venue: string;
    dateTime: string;
    participants: { id: string; avatar?: string }[];
    maxParticipants: number;
    likes: number;
    comments: number;
}

interface InviteCardProps {
    invite: Invite;
    onJoin?: () => void;
    onLike?: () => void;
    onComment?: () => void;
}

// Icons
const LocationIcon = ({ size = 14, color = '#6B7280' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={color} strokeWidth="2" />
        <Circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="2" />
    </Svg>
);

const CalendarIcon = ({ size = 14, color = '#6B7280' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

const HeartIcon = ({ size = 18, color = '#6B7280' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const CommentIcon = ({ size = 18, color = '#6B7280' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const SearchIcon = ({ size = 16, color = '#fff' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
        <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

const PersonIcon = ({ size = 20, color = '#6B7280' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
        <Path d="M20 21a8 8 0 10-16 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

export function InviteCard({ invite, onJoin, onLike, onComment }: InviteCardProps) {
    const emptySlots = invite.maxParticipants - invite.participants.length;

    return (
        <View
            accessible={true}
            accessibilityRole="none"
            accessibilityLabel={`Convite de ${invite.senderName}. ${invite.message}. Local: ${invite.venue}. Data: ${invite.dateTime}. ${invite.participants.length} participantes, ${emptySlots} vagas disponíveis`}
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#E5E7EB',
            }}
        >
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                {/* Avatar */}
                <View
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: '#F3F4F6',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                    }}
                >
                    {invite.senderAvatar ? (
                        <Image
                            source={{ uri: invite.senderAvatar }}
                            style={{ width: 44, height: 44, borderRadius: 22 }}
                        />
                    ) : (
                        <PersonIcon size={24} color="#6B7280" />
                    )}
                </View>

                {/* Name + badge */}
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#000' }}>
                            {invite.senderName}
                        </Text>
                        <View
                            style={{
                                backgroundColor: '#1F2937',
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                                borderRadius: 6,
                            }}
                        >
                            <Text style={{ fontSize: 10, fontWeight: '600', color: '#FFFFFF' }}>Convite</Text>
                        </View>
                    </View>
                </View>

                {/* More menu */}
                <Pressable
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Mais opções"
                    accessibilityHint="Toque duas vezes para abrir menu de opções"
                    style={{ minHeight: 44, minWidth: 44, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Text style={{ fontSize: 18, color: '#6B7280' }}>⋮</Text>
                </Pressable>
            </View>

            {/* Message */}
            <Text style={{ fontSize: 15, fontWeight: '500', color: '#000', marginBottom: 12 }}>
                {invite.message}
            </Text>

            {/* Location & Time box */}
            <View
                style={{
                    backgroundColor: '#F9FAFB',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 14,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <LocationIcon size={14} />
                    <Text style={{ fontSize: 14, color: '#374151', marginLeft: 8 }}>{invite.venue}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CalendarIcon size={14} />
                    <Text style={{ fontSize: 14, color: '#374151', marginLeft: 8 }}>{invite.dateTime}</Text>
                </View>
            </View>

            {/* Participants */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                {invite.participants.map((p, i) => (
                    <View
                        key={p.id}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: '#E5E7EB',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: i > 0 ? -8 : 0,
                            borderWidth: 2,
                            borderColor: '#FFFFFF',
                        }}
                    >
                        {p.avatar ? (
                            <Image source={{ uri: p.avatar }} style={{ width: 32, height: 32, borderRadius: 16 }} />
                        ) : (
                            <PersonIcon size={18} color="#6B7280" />
                        )}
                    </View>
                ))}
                {emptySlots > 0 && (
                    <View
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            borderWidth: 2,
                            borderColor: '#D1D5DB',
                            borderStyle: 'dashed',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: -8,
                            backgroundColor: '#FFFFFF',
                        }}
                    >
                        <Text style={{ fontSize: 16, color: '#6B7280' }}>+</Text>
                    </View>
                )}
            </View>

            {/* Footer: likes, comments, join button */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }} accessible={false}>
                {/* Likes */}
                <Pressable
                    onPress={onLike}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`${invite.likes} curtidas`}
                    accessibilityHint="Toque duas vezes para curtir"
                    style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16, minHeight: 44, minWidth: 44, justifyContent: 'center' }}
                >
                    <HeartIcon size={18} />
                    <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 6 }}>{invite.likes}</Text>
                </Pressable>

                {/* Comments */}
                <Pressable
                    onPress={onComment}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`${invite.comments} comentários`}
                    accessibilityHint="Toque duas vezes para ver comentários"
                    style={{ flexDirection: 'row', alignItems: 'center', minHeight: 44, minWidth: 44, justifyContent: 'center' }}
                >
                    <CommentIcon size={18} />
                    <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 6 }}>{invite.comments}</Text>
                </Pressable>

                {/* Join button */}
                <Pressable
                    onPress={onJoin}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Entrar no convite de ${invite.senderName}`}
                    accessibilityHint="Toque duas vezes para aceitar o convite"
                    style={{
                        marginLeft: 'auto',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#1F2937',
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 20,
                        gap: 6,
                        minHeight: 44,
                    }}
                >
                    <SearchIcon size={14} color="#FFFFFF" />
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>Entrar</Text>
                </Pressable>
            </View>
        </View>
    );
}

interface InvitesListProps {
    invites: Invite[];
    onViewAll?: () => void;
    onJoin?: (id: string) => void;
}

export function InvitesList({ invites, onViewAll, onJoin }: InvitesListProps) {
    return (
        <View style={{ marginTop: 24 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E', marginRight: 8 }} />
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#000' }}>
                        Convites para você
                    </Text>
                </View>
                <Pressable onPress={onViewAll}>
                    <Text style={{ fontSize: 14, color: '#6B7280' }}>Ver todos</Text>
                </Pressable>
            </View>

            {/* Cards */}
            <View style={{ paddingHorizontal: 20 }}>
                {invites.map((invite) => (
                    <InviteCard key={invite.id} invite={invite} onJoin={() => onJoin?.(invite.id)} />
                ))}
            </View>
        </View>
    );
}
