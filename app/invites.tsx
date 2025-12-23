import { View, Text, Pressable, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Calendar, Clock, Users, Check, X } from 'lucide-react-native';
import { Colors } from '../constants';
import { IconButton, Avatar } from '../components/ui';
import { EmptyState } from '../components/ui/EmptyState';
import { useInvites } from '../hooks/useInvites';
import { InviteService, MatchInvite } from '../services/inviteService';
import { useState, useEffect, useCallback } from 'react';

export default function InvitesScreen() {
    const router = useRouter();
    const { invites: publicInvites, loading: loadingPublic, refetch: refetchPublic } = useInvites();
    const [directInvites, setDirectInvites] = useState<MatchInvite[]>([]);
    const [loadingDirect, setLoadingDirect] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchDirectInvites = useCallback(async () => {
        setLoadingDirect(true);
        const invites = await InviteService.getMyInvites();
        setDirectInvites(invites);
        setLoadingDirect(false);
    }, []);

    useEffect(() => {
        fetchDirectInvites();
    }, [fetchDirectInvites]);

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([refetchPublic(), fetchDirectInvites()]);
        setRefreshing(false);
    };

    const handleAccept = async (inviteId: string) => {
        setProcessingId(inviteId);
        const result = await InviteService.acceptInvite(inviteId);
        if (result.success) {
            setDirectInvites(prev => prev.filter(i => i.id !== inviteId));
        }
        setProcessingId(null);
    };

    const handleDecline = async (inviteId: string) => {
        setProcessingId(inviteId);
        const result = await InviteService.declineInvite(inviteId);
        if (result.success) {
            setDirectInvites(prev => prev.filter(i => i.id !== inviteId));
        }
        setProcessingId(null);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    };

    const formatTime = (timeString: string) => {
        if (!timeString) return '';
        return timeString.slice(0, 5);
    };

    const loading = loadingPublic || loadingDirect;
    const hasInvites = directInvites.length > 0 || publicInvites.length > 0;

    const renderDirectInvite = ({ item }: { item: MatchInvite }) => {
        const isProcessing = processingId === item.id;
        const match = (item as any).match;
        const sender = (item as any).sender;

        return (
            <Pressable
                onPress={() => router.push(`/match/${item.match_id}`)}
                className="bg-white mx-4 mb-3 p-4 rounded-2xl border border-neutral-100"
                accessible={true}
                accessibilityLabel={`Convite de ${sender?.name || 'usuário'} para ${match?.sport || 'partida'}`}
                accessibilityHint="Toque para ver detalhes da partida"
            >
                {/* Sender info */}
                <View className="flex-row items-center mb-3">
                    <Avatar
                        fallback={sender?.name || 'U'}
                        size="sm"
                    />
                    <View className="ml-3 flex-1">
                        <Text className="font-semibold text-black">
                            {sender?.name || 'Usuário'} te convidou
                        </Text>
                        <Text className="text-xs text-neutral-500">
                            {new Date(item.created_at).toLocaleDateString('pt-BR')}
                        </Text>
                    </View>
                </View>

                {/* Match info */}
                <View className="bg-neutral-50 rounded-xl p-3 mb-3">
                    <Text className="font-bold text-black text-base mb-2">
                        {match?.title || match?.sport || 'Partida'}
                    </Text>

                    <View className="flex-row items-center mb-1">
                        <Calendar size={14} color={Colors.neutral[500]} />
                        <Text className="text-sm text-neutral-600 ml-2">
                            {match?.date ? formatDate(match.date) : 'Data não definida'}
                        </Text>
                        {match?.start_time && (
                            <>
                                <Clock size={14} color={Colors.neutral[500]} className="ml-3" />
                                <Text className="text-sm text-neutral-600 ml-2">
                                    {formatTime(match.start_time)}
                                </Text>
                            </>
                        )}
                    </View>

                    {match?.court?.name && (
                        <View className="flex-row items-center">
                            <MapPin size={14} color={Colors.neutral[500]} />
                            <Text className="text-sm text-neutral-600 ml-2" numberOfLines={1}>
                                {match.court.name}
                            </Text>
                        </View>
                    )}
                </View>

                {(item as any).message && (
                    <Text className="text-sm text-neutral-600 italic mb-3">
                        &quot;{(item as any).message}&quot;
                    </Text>
                )}

                {/* Action buttons */}
                <View className="flex-row gap-3">
                    <Pressable
                        onPress={() => handleDecline(item.id)}
                        disabled={isProcessing}
                        className="flex-1 flex-row items-center justify-center py-3 bg-neutral-100 rounded-xl"
                        accessible={true}
                        accessibilityLabel="Recusar convite"
                        accessibilityRole="button"
                    >
                        {isProcessing ? (
                            <ActivityIndicator size="small" color={Colors.neutral[700]} />
                        ) : (
                            <>
                                <X size={18} color={Colors.neutral[700]} />
                                <Text className="font-semibold text-neutral-700 ml-2">Recusar</Text>
                            </>
                        )}
                    </Pressable>

                    <Pressable
                        onPress={() => handleAccept(item.id)}
                        disabled={isProcessing}
                        className="flex-1 flex-row items-center justify-center py-3 bg-primary rounded-xl"
                        accessible={true}
                        accessibilityLabel="Aceitar convite"
                        accessibilityRole="button"
                    >
                        {isProcessing ? (
                            <ActivityIndicator size="small" color={Colors.textInverse} />
                        ) : (
                            <>
                                <Check size={18} color={Colors.textInverse} />
                                <Text className="font-semibold text-white ml-2">Aceitar</Text>
                            </>
                        )}
                    </Pressable>
                </View>
            </Pressable>
        );
    };

    const renderPublicMatch = ({ item }: { item: any }) => {
        const playersCount = item.players?.length || 0;
        const maxPlayers = item.max_players || 4;

        return (
            <Pressable
                onPress={() => router.push(`/match/${item.id}`)}
                className="bg-white mx-4 mb-3 p-4 rounded-2xl border border-neutral-100"
                accessible={true}
                accessibilityLabel={`Partida pública de ${item.sport}`}
                accessibilityHint="Toque para ver detalhes e participar"
            >
                <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                        <Text className="font-bold text-black text-base">
                            {item.sport}
                        </Text>
                        <Text className="text-xs text-neutral-500 mt-1">
                            Partida pública
                        </Text>
                    </View>
                    <View className="bg-green-100 px-3 py-1 rounded-full">
                        <Text className="text-green-700 text-xs font-medium">Aberta</Text>
                    </View>
                </View>

                <View className="flex-row items-center mb-2">
                    <Calendar size={14} color={Colors.neutral[500]} />
                    <Text className="text-sm text-neutral-600 ml-2">
                        {item.start_time ? formatDate(item.start_time) : 'Data não definida'}
                    </Text>
                </View>

                {item.court?.name && (
                    <View className="flex-row items-center mb-2">
                        <MapPin size={14} color={Colors.neutral[500]} />
                        <Text className="text-sm text-neutral-600 ml-2" numberOfLines={1}>
                            {item.court.name}
                        </Text>
                    </View>
                )}

                <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                        <Users size={14} color={Colors.neutral[500]} />
                        <Text className="text-sm text-neutral-600 ml-2">
                            {playersCount}/{maxPlayers} jogadores
                        </Text>
                    </View>

                    {/* Player avatars */}
                    <View className="flex-row -space-x-2">
                        {item.players?.slice(0, 3).map((player: any, index: number) => (
                            <View key={player.user_id || index} className={index > 0 ? '-ml-2' : ''}>
                                <Avatar
                                    fallback={player.profile?.name || 'U'}
                                    size="xs"
                                />
                            </View>
                        ))}
                        {playersCount > 3 && (
                            <View className="w-6 h-6 bg-neutral-200 rounded-full items-center justify-center -ml-2">
                                <Text className="text-xs text-neutral-600">+{playersCount - 3}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Pressable>
        );
    };

    const renderContent = () => {
        if (loading && !refreshing) {
            return (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text className="text-neutral-500 mt-4">Carregando convites...</Text>
                </View>
            );
        }

        if (!hasInvites) {
            return (
                <EmptyState
                    type="noInvites"
                    title="Nenhum convite pendente"
                    description="Quando alguém te convidar para uma partida, você verá aqui. Você também pode encontrar partidas públicas para participar."
                    actionLabel="Explorar partidas"
                    onAction={() => router.push('/(tabs)/map')}
                />
            );
        }

        return (
            <FlatList
                data={[]}
                renderItem={null}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListHeaderComponent={
                    <>
                        {/* Direct invites section */}
                        {directInvites.length > 0 && (
                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-neutral-500 uppercase tracking-wide px-4 mb-3">
                                    Convites Diretos ({directInvites.length})
                                </Text>
                                {directInvites.map(invite => (
                                    <View key={invite.id}>
                                        {renderDirectInvite({ item: invite })}
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Public matches section */}
                        {publicInvites.length > 0 && (
                            <View>
                                <Text className="text-sm font-semibold text-neutral-500 uppercase tracking-wide px-4 mb-3">
                                    Partidas Públicas ({publicInvites.length})
                                </Text>
                                {publicInvites.map(match => (
                                    <View key={match.id}>
                                        {renderPublicMatch({ item: match })}
                                    </View>
                                ))}
                            </View>
                        )}
                    </>
                }
                contentContainerStyle={{ paddingVertical: 16, flexGrow: 1 }}
            />
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center px-5 py-4 border-b border-neutral-100">
                <IconButton
                    icon={ChevronLeft}
                    onPress={() => router.back()}
                    variant="default"
                    iconColor={Colors.primary}
                    accessibilityLabel="Voltar"
                />
                <Text className="flex-1 text-xl font-bold text-black text-center mr-10">
                    Convites
                </Text>
            </View>

            {renderContent()}
        </SafeAreaView>
    );
}
