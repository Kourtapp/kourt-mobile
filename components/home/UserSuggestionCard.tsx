import React, { useState } from 'react';
import { View, Text, Pressable, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { User, X, MapPin, Trophy, MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface UserSuggestion {
    id: string;
    name: string;
    avatar?: string;
    sport: string;
    reason: string; // "Nível similar", "Por perto", "Contato"
    distance?: string; // "2km de você"
    isOnline?: boolean;
    isDemo?: boolean; // Demo user (not real)
}

interface UserSuggestionCardProps {
    user: UserSuggestion;
    onFollow?: () => void;
    onPress?: () => void;
}

export function UserSuggestionCard({ user, onFollow, onPress }: UserSuggestionCardProps) {
    const reasonText = user.reason?.includes('Nível')
        ? user.reason.replace('Nível ', 'Nvl ')
        : user.reason || '';

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Ver perfil de ${user.name}, ${user.sport}, ${user.reason}${user.isOnline ? ', online agora' : ''}`}
            accessibilityHint="Toque duas vezes para abrir o perfil completo"
            style={{
                width: 160,
                height: 220,
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 14,
                borderWidth: 1,
                borderColor: '#F3F4F6',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
            }}
        >
            {/* Top Content */}
            <View style={{ alignItems: 'center', flex: 1 }} accessible={false}>
                {/* Avatar */}
                <View style={{ position: 'relative', marginBottom: 10 }} accessibilityElementsHidden={true}>
                    <View
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: '#F3F4F6',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        {user.avatar ? (
                            <Image source={{ uri: user.avatar }} style={{ width: 60, height: 60, borderRadius: 30 }} accessible={false} />
                        ) : (
                            <User size={28} color="#6B7280" />
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
                <Text numberOfLines={1} style={{ fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 4 }} accessibilityElementsHidden={true}>
                    {user.name}
                </Text>

                {/* Sport & Level */}
                <Text numberOfLines={2} style={{ fontSize: 11, color: '#6B7280', textAlign: 'center', lineHeight: 14 }} accessibilityElementsHidden={true}>
                    {user.sport} • {reasonText}
                </Text>
            </View>

            {/* Follow button - Always at bottom */}
            <TouchableOpacity
                onPress={(e) => {
                    e.stopPropagation();
                    onFollow?.();
                }}
                activeOpacity={0.7}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Seguir ${user.name}`}
                accessibilityHint="Toque duas vezes para seguir este usuário"
                style={{
                    backgroundColor: '#22C55E',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 20,
                    alignItems: 'center',
                    marginTop: 12,
                    minHeight: 44,
                }}
            >
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#FFFFFF' }}>
                    Seguir
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

interface UserSuggestionsListProps {
    users: UserSuggestion[];
    onViewAll?: () => void;
    onFollow?: (userId: string) => void;
    onUserPress?: (userId: string) => void;
}

// Profile Preview Modal Component
function ProfilePreviewModal({
    visible,
    user,
    onClose,
    onFollow
}: {
    visible: boolean;
    user: UserSuggestion | null;
    onClose: () => void;
    onFollow: () => void;
}) {
    if (!user) return null;

    // Generate demo stats based on level
    const isAdvanced = user.reason.includes('avançado');
    const isIntermediate = user.reason.includes('intermediário');
    const stats = {
        following: isAdvanced ? 234 : isIntermediate ? 156 : 45,
        followers: isAdvanced ? 1892 : isIntermediate ? 523 : 89,
        partidas: isAdvanced ? 186 : isIntermediate ? 78 : 21,
        winRate: isAdvanced ? 72 : isIntermediate ? 58 : 45,
        tempo: isAdvanced ? '4h 20m' : isIntermediate ? '2h 45m' : '1h 10m',
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                {/* Backdrop - tap to close */}
                <Pressable style={{ flex: 1 }} onPress={onClose} />

                <View style={{
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    height: '80%',
                }}>
                    {/* Header with gradient background */}
                    <View style={{ backgroundColor: '#F3F4F6', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
                        {/* Handle bar */}
                        <Pressable onPress={onClose} style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
                            <View style={{ width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2 }} />
                        </Pressable>

                        {/* Close button */}
                        <TouchableOpacity
                            onPress={onClose}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel="Fechar perfil"
                            accessibilityHint="Toque duas vezes para fechar o modal"
                            style={{ position: 'absolute', top: 12, right: 16, padding: 8, minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <X size={24} color="#6B7280" />
                        </TouchableOpacity>

                        {/* Profile Header */}
                        <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 20 }}>
                            {/* Avatar */}
                            <View style={{
                                width: 90,
                                height: 90,
                                borderRadius: 16,
                                backgroundColor: '#fff',
                                overflow: 'hidden',
                                borderWidth: 3,
                                borderColor: '#fff',
                            }}>
                                {user.avatar ? (
                                    <Image source={{ uri: user.avatar }} style={{ width: '100%', height: '100%' }} />
                                ) : (
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E5E7EB' }}>
                                        <User size={36} color="#9CA3AF" />
                                    </View>
                                )}
                            </View>

                            {/* Info */}
                            <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
                                {/* PRO badge + Name */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                    {isAdvanced && (
                                        <View style={{ backgroundColor: '#000', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                                            <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>PRO</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>{user.name}</Text>
                                <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>São Paulo, SP · Brasil</Text>
                            </View>
                        </View>
                    </View>

                    {/* Content */}
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                            {/* Username */}
                            <Text style={{ fontSize: 15, color: '#6B7280', marginBottom: 16 }}>
                                @{user.name.toLowerCase().replace(' ', '_')}
                            </Text>

                            {/* Following / Followers */}
                            <View style={{ flexDirection: 'row', gap: 24, marginBottom: 20 }}>
                                <View>
                                    <Text style={{ fontSize: 13, color: '#6B7280' }}>Seguindo</Text>
                                    <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>{stats.following}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: 13, color: '#6B7280' }}>Seguidores</Text>
                                    <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>{stats.followers.toLocaleString()}</Text>
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                                <TouchableOpacity
                                    onPress={() => { onFollow(); onClose(); }}
                                    accessible={true}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Seguir ${user.name}`}
                                    accessibilityHint="Toque duas vezes para seguir este usuário"
                                    style={{
                                        flex: 1,
                                        backgroundColor: '#000',
                                        paddingVertical: 14,
                                        borderRadius: 12,
                                        alignItems: 'center',
                                        minHeight: 44,
                                    }}
                                >
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>Seguir</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={onClose}
                                    accessible={true}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Enviar mensagem para ${user.name}`}
                                    accessibilityHint="Toque duas vezes para iniciar uma conversa"
                                    style={{
                                        width: 52,
                                        height: 52,
                                        backgroundColor: '#F3F4F6',
                                        borderRadius: 12,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <MessageCircle size={22} color="#111827" />
                                </TouchableOpacity>
                            </View>

                            {/* Media Gallery */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, marginBottom: 20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <View key={i} style={{ width: 100, height: 130, backgroundColor: '#F3F4F6', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                                        {i === 2 ? (
                                            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ fontSize: 12 }}>▶</Text>
                                            </View>
                                        ) : (
                                            <MapPin size={24} color="#D1D5DB" />
                                        )}
                                    </View>
                                ))}
                            </ScrollView>

                            {/* Sport Tags */}
                            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#000',
                                    paddingHorizontal: 16,
                                    paddingVertical: 10,
                                    borderRadius: 20,
                                    gap: 8,
                                }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>🎾 {user.sport}</Text>
                                </View>
                                <View style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 10,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB',
                                }}>
                                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>Padel</Text>
                                </View>
                            </View>

                            {/* Posts Section */}
                            <View style={{ marginBottom: 24 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>Posts</Text>
                                    <Text style={{ fontSize: 14, color: '#6B7280' }}>24</Text>
                                </View>

                                {/* Post Grid */}
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <View
                                            key={i}
                                            style={{
                                                width: '32%',
                                                aspectRatio: 1,
                                                backgroundColor: '#F3F4F6',
                                                borderRadius: 8,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {i === 1 ? (
                                                <Image
                                                    source={{ uri: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=200' }}
                                                    style={{ width: '100%', height: '100%', borderRadius: 8 }}
                                                />
                                            ) : i === 3 ? (
                                                <View style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                    <View style={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        backgroundColor: 'rgba(0,0,0,0.6)',
                                                        paddingHorizontal: 6,
                                                        paddingVertical: 2,
                                                        borderRadius: 4
                                                    }}>
                                                        <Text style={{ fontSize: 10, color: '#fff' }}>▶ 0:32</Text>
                                                    </View>
                                                    <View style={{ flex: 1, backgroundColor: '#E5E7EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ fontSize: 24 }}>▶</Text>
                                                    </View>
                                                </View>
                                            ) : (
                                                <MapPin size={20} color="#D1D5DB" />
                                            )}
                                        </View>
                                    ))}
                                </View>

                                {/* View All Posts */}
                                <Pressable style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, backgroundColor: '#F3F4F6', borderRadius: 12 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>Ver todos os posts</Text>
                                </Pressable>
                            </View>

                            {/* This Week Stats */}
                            <View style={{ backgroundColor: '#FAFAFA', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                                <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16 }}>Esta semana</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>Partidas</Text>
                                        <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>5</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>Tempo</Text>
                                        <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{stats.tempo}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>Win Rate</Text>
                                        <Text style={{ fontSize: 24, fontWeight: '700', color: '#F97316' }}>{stats.winRate}%</Text>
                                    </View>
                                </View>
                                {/* Activity Graph */}
                                <View style={{ height: 60, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8 }}>
                                    {[30, 60, 45, 70, 55, 65, 40, 75, 50].map((h, i) => (
                                        <View key={i} style={{ width: 8, height: h, backgroundColor: '#F97316', borderRadius: 4, opacity: 0.3 + (h / 100) }} />
                                    ))}
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 11, color: '#9CA3AF' }}>OUT</Text>
                                    <Text style={{ fontSize: 11, color: '#9CA3AF' }}>NOV</Text>
                                    <Text style={{ fontSize: 11, color: '#9CA3AF' }}>DEZ</Text>
                                </View>
                            </View>

                            {/* Menu Items */}
                            <View style={{ backgroundColor: '#FAFAFA', borderRadius: 16, marginBottom: 16, overflow: 'hidden' }}>
                                {[
                                    { icon: '📅', title: 'Atividades', subtitle: 'Hoje' },
                                    { icon: '📊', title: 'Estatísticas', subtitle: `Este ano: ${stats.partidas} partidas` },
                                    { icon: '📍', title: 'Quadras Favoritas', subtitle: '15 quadras' },
                                    { icon: '🎾', title: 'Equipamento', subtitle: 'Head Radical Pro' },
                                ].map((item, index) => (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: index < 3 ? 1 : 0, borderBottomColor: '#E5E7EB' }}>
                                        <Text style={{ fontSize: 20, marginRight: 12 }}>{item.icon}</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>{item.title}</Text>
                                            <Text style={{ fontSize: 13, color: '#6B7280' }}>{item.subtitle}</Text>
                                        </View>
                                        <Text style={{ fontSize: 18, color: '#D1D5DB' }}>›</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Trophy Case Preview */}
                            <View style={{ backgroundColor: '#FAFAFA', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>Conquistas</Text>
                                    <Text style={{ fontSize: 14, color: '#6B7280' }}>89</Text>
                                </View>
                                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                                    <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>100</Text>
                                    </View>
                                    <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#22C55E', alignItems: 'center', justifyContent: 'center' }}>
                                        <Trophy size={24} color="#fff" />
                                    </View>
                                    <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={24} color="#fff" />
                                    </View>
                                    <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 20 }}>⭐</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 13, color: '#6B7280' }}>100 Partidas</Text>
                                    <Text style={{ fontSize: 13, color: '#6B7280' }}>10 Win Streak</Text>
                                    <Text style={{ fontSize: 13, color: '#6B7280' }}>Social</Text>
                                    <Text style={{ fontSize: 13, color: '#6B7280' }}>5 Star</Text>
                                </View>
                                <Pressable style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>Todas as conquistas</Text>
                                    <Text style={{ fontSize: 18, color: '#D1D5DB' }}>›</Text>
                                </Pressable>
                            </View>

                            {/* Clubs */}
                            <View style={{ backgroundColor: '#FAFAFA', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>Clubes</Text>
                                    <Text style={{ fontSize: 14, color: '#6B7280' }}>12</Text>
                                </View>
                                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#F59E0B', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>BT</Text>
                                        </View>
                                        <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 6 }}>BeachTen...</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>PD</Text>
                                        </View>
                                        <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 6 }}>Padel Club</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#22C55E', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>IB</Text>
                                        </View>
                                        <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 6 }}>Ibirapuera</Text>
                                    </View>
                                </View>
                                <Pressable style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>Todos os clubes</Text>
                                    <Text style={{ fontSize: 18, color: '#D1D5DB' }}>›</Text>
                                </Pressable>
                            </View>

                            {/* Demo Badge */}
                            {user.isDemo && (
                                <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Perfil de demonstração</Text>
                                </View>
                            )}

                            {/* Bottom padding */}
                            <View style={{ height: 40 }} />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

export function UserSuggestionsList({ users, onViewAll, onFollow, onUserPress }: UserSuggestionsListProps) {
    const router = useRouter();
    const [selectedUser, setSelectedUser] = useState<UserSuggestion | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleUserPress = (user: UserSuggestion) => {
        if (onUserPress) {
            onUserPress(user.id);
        } else if (user.isDemo) {
            setSelectedUser(user);
            setShowPreview(true);
        } else {
            router.push(`/user/${user.id}` as any);
        }
    };

    return (
        <View style={{ marginTop: 24 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }} accessibilityRole="header">Sugestões para você</Text>
                <Pressable
                    onPress={onViewAll}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Ver todas as sugestões"
                    accessibilityHint="Toque duas vezes para ver a lista completa de sugestões"
                    style={{ minHeight: 44, minWidth: 44, justifyContent: 'center' }}
                >
                    <Text style={{ fontSize: 13, fontWeight: '500', color: '#2563EB' }}>Ver todos</Text>
                </Pressable>
            </View>

            {/* Horizontal scroll */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 8 }}
            >
                {users.map((user) => (
                    <UserSuggestionCard
                        key={user.id}
                        user={user}
                        onPress={() => handleUserPress(user)}
                        onFollow={() => onFollow?.(user.id)}
                    />
                ))}
            </ScrollView>

            {/* Profile Preview Modal */}
            <ProfilePreviewModal
                visible={showPreview}
                user={selectedUser}
                onClose={() => setShowPreview(false)}
                onFollow={() => selectedUser && onFollow?.(selectedUser.id)}
            />
        </View>
    );
}
