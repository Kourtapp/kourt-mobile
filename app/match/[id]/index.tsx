import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image as RNImage, ActivityIndicator, Alert, Share, Linking, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Share2, MoreVertical, MapPin, Clock, Calendar, Users, MessageCircle, UserPlus, Star, Trophy, Check, Zap, ChevronRight, Navigation, DollarSign, Target, Globe, Lock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Svg, { Path, Circle } from 'react-native-svg';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

import { useMatch } from '@/hooks/useMatch';
import { useUserStore } from '@/stores/useUserStore';
import { MatchService } from '@/services/matchService';
import { SportIcon } from '@/components/SportIcon';
import { BottomSheet } from '@/components/ui/BottomSheet';

// Sport-specific colors for Kourt branding
const SPORT_COLORS: Record<string, { primary: string; secondary: string; gradient: [string, string] }> = {
    'beach-tennis': { primary: '#F59E0B', secondary: '#FCD34D', gradient: ['#F59E0B', '#D97706'] },
    'padel': { primary: '#3B82F6', secondary: '#60A5FA', gradient: ['#3B82F6', '#1D4ED8'] },
    'tennis': { primary: '#22C55E', secondary: '#4ADE80', gradient: ['#22C55E', '#16A34A'] },
    'beach-volley': { primary: '#F97316', secondary: '#FB923C', gradient: ['#F97316', '#EA580C'] },
    'futevolei': { primary: '#8B5CF6', secondary: '#A78BFA', gradient: ['#8B5CF6', '#7C3AED'] },
    'pickleball': { primary: '#EC4899', secondary: '#F472B6', gradient: ['#EC4899', '#DB2777'] },
    'default': { primary: '#0EA5E9', secondary: '#38BDF8', gradient: ['#0EA5E9', '#0284C7'] },
};

// Gender icons
const GenderIcon = ({ gender, size = 16 }: { gender: string; size?: number }) => {
    if (gender === 'male') {
        return (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <Circle cx="10" cy="14" r="5" stroke="#3B82F6" strokeWidth="2" />
                <Path d="M14 10l6-6M20 4v4M20 4h-4" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            </Svg>
        );
    }
    if (gender === 'female') {
        return (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="8" r="5" stroke="#EC4899" strokeWidth="2" />
                <Path d="M12 13v8M9 18h6" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
            </Svg>
        );
    }
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="8" cy="15" r="4" stroke="#8B5CF6" strokeWidth="2" />
            <Circle cx="16" cy="9" r="4" stroke="#8B5CF6" strokeWidth="2" />
        </Svg>
    );
};

// Demo matches data
const DEMO_MATCHES: Record<string, any> = {
    'demo-1': {
        id: 'demo-1',
        title: 'Beach Tennis Casual',
        sport: 'beach-tennis',
        date: new Date().toISOString().split('T')[0],
        start_time: '18:00:00',
        end_time: '20:00:00',
        max_players: 4,
        type: 'Amistoso',
        court_type: 'public',
        price_per_player: null,
        court_booked: false,
        gender_preference: 'mixed',
        level_min: 1.0,
        level_max: 3.5,
        is_competitive: false,
        is_public: true,
        court: {
            name: 'Praça do Pôr do Sol',
            location: 'Rua Desembargador Ferreira, Pinheiros',
            type: 'Quadra pública',
            images: ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800']
        },
        players: [
            { user_id: 'demo-user-1', status: 'confirmed', team: 'A', profile: { full_name: 'Carlos Silva', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', level: 2.5 } },
            { user_id: 'demo-user-2', status: 'confirmed', team: 'A', profile: { full_name: 'Ana Santos', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', level: 1.8 } }
        ],
    },
    'demo-2': {
        id: 'demo-2',
        title: 'Padel Duplas',
        sport: 'padel',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        start_time: '19:00:00',
        end_time: '21:00:00',
        max_players: 4,
        type: 'Amistoso',
        court_type: 'private',
        price_per_player: 40,
        court_booked: true,
        gender_preference: 'mixed',
        level_min: 0,
        level_max: 2.0,
        is_competitive: false,
        is_public: false,
        court: {
            name: 'Padel Club Ibirapuera',
            location: 'Av. República do Líbano, 1234',
            type: 'Coberta, Parede, Dupla',
            images: ['https://images.unsplash.com/photo-1612534847738-b3af9bc31f0c?w=800']
        },
        players: [
            { user_id: 'demo-user-3', status: 'confirmed', team: 'A', payment_status: 'paid', profile: { full_name: 'Pedro Lima', avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100', level: 1.2 } }
        ],
    },
    'demo-3': {
        id: 'demo-3',
        title: 'Beach Tennis Pro',
        sport: 'beach-tennis',
        date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        start_time: '08:00:00',
        end_time: '09:00:00',
        max_players: 4,
        type: 'Competitivo',
        court_type: 'private',
        price_per_player: 30,
        court_booked: true,
        gender_preference: 'mixed',
        level_min: 3.0,
        level_max: 5.0,
        is_competitive: true,
        is_public: true,
        court: {
            name: 'Arena Beach Tennis',
            location: 'Av. Paulista, 1000',
            type: 'Arena profissional',
            images: ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800']
        },
        players: [
            { user_id: 'demo-user-4', status: 'confirmed', team: 'A', payment_status: 'paid', profile: { full_name: 'João Mendes', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', level: 4.2 } }
        ],
    },
    'demo-4': {
        id: 'demo-4',
        title: 'Vôlei de Praia',
        sport: 'beach-volley',
        date: new Date().toISOString().split('T')[0],
        start_time: '16:00:00',
        end_time: '18:00:00',
        max_players: 4,
        type: 'Amistoso',
        court_type: 'public',
        price_per_player: null,
        court_booked: false,
        gender_preference: 'mixed',
        level_min: 0,
        level_max: 7.0,
        is_competitive: false,
        is_public: true,
        court: {
            name: 'Praia de Ipanema - Posto 9',
            location: 'Av. Vieira Souto, Ipanema',
            type: 'Praia',
            images: ['https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800']
        },
        players: [
            { user_id: 'demo-user-5', status: 'confirmed', team: 'A', profile: { full_name: 'Mariana Costa', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', level: 3.0 } }
        ],
    }
};

export default function MatchDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const { profile: user } = useUserStore();
    const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
    const [showPlayerSheet, setShowPlayerSheet] = useState(false);

    // Check if this is a demo match
    const isDemo = typeof id === 'string' && id.startsWith('demo-');
    const demoMatch = isDemo ? DEMO_MATCHES[id as string] : null;

    // Only fetch from DB if not a demo match
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { match: dbMatch, loading, error, refetch } = useMatch(isDemo ? '' : (id as string));

    // Use demo data or real data
    const match = isDemo ? demoMatch : dbMatch;

    const handlePlayerPress = (player: any) => {
        if (player.user_id.startsWith('demo')) {
            setSelectedPlayer(player);
            setShowPlayerSheet(true);
        } else {
            router.push(`/user/${player.user_id}`);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Bora jogar ${match?.sport || 'uma partida'} no Kourt? 🎾\nJunte-se a mim: kourt://match/${id}`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleJoin = async () => {
        if (isDemo) {
            Alert.alert(
                "Partida de Demonstração",
                "Esta é uma partida de exemplo para você conhecer o app. Crie uma partida real para jogar!",
                [
                    { text: "Criar Jogo", onPress: () => router.push('/match/create' as any) },
                    { text: "OK", style: "cancel" }
                ]
            );
            return;
        }
        if (!user) return Alert.alert("Ops", "Faça login para entrar na partida.");
        const res = await MatchService.joinMatch(id as string);
        if (res.success) {
            Alert.alert("Sucesso!", "Você entrou na partida.");
            refetch();
        } else {
            Alert.alert("Erro", res.error || "Não foi possível entrar.");
        }
    };

    const handleOpenMaps = () => {
        const address = encodeURIComponent(match?.court?.location || '');
        Linking.openURL(`https://maps.google.com/?q=${address}`);
    };

    // Show loading only for real matches
    if (!isDemo && loading) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if (!match) {
        return (
            <View className="flex-1 bg-white items-center justify-center px-6">
                <Text className="text-slate-500 text-center mb-6 text-lg">Partida não encontrada</Text>
                <Pressable onPress={() => router.back()} className="bg-slate-100 px-6 py-3 rounded-xl">
                    <Text className="text-slate-900 font-bold">Voltar</Text>
                </Pressable>
            </View>
        );
    }

    const isParticipant = match.players?.some((p: any) => p.user_id === user?.id);
    const dateStr = match.date || new Date().toISOString().split('T')[0];
    const timeStr = match.start_time || '00:00:00';
    const endTimeStr = match.end_time || '00:00:00';
    const date = new Date(`${dateStr}T${timeStr}`);
    const hasPrice = match.price_per_player && match.price_per_player > 0;
    const genderLabel = match.gender_preference === 'male' ? 'Masculino' :
                        match.gender_preference === 'female' ? 'Feminino' : 'Misto';

    // Split players into teams
    const teamA = match.players?.filter((p: any) => p.team === 'A' || !p.team) || [];
    const teamB = match.players?.filter((p: any) => p.team === 'B') || [];
    const slotsPerTeam = match.max_players / 2;
    const totalPlayers = (teamA.length || 0) + (teamB.length || 0);

    // Sport-specific theming
    const sportKey = match.sport || 'default';
    const sportColors = SPORT_COLORS[sportKey] || SPORT_COLORS.default;
    const sportName = (match.sport || 'Beach Tennis').replace(/-/g, ' ').replace(/_/g, ' ');

    return (
        <View className="flex-1 bg-[#FAFAFA]">
            {/* Header Image */}
            <View className="h-56 w-full">
                {match.court?.images?.[0] ? (
                    <ImageBackground
                        source={{ uri: match.court.images[0] }}
                        className="w-full h-full"
                        resizeMode="cover"
                    >
                        <ExpoLinearGradient
                            colors={['rgba(0,0,0,0.4)', 'transparent']}
                            locations={[0, 0.5]}
                            className="absolute inset-0"
                        />
                    </ImageBackground>
                ) : (
                    <View className="w-full h-full bg-neutral-200 items-center justify-center">
                        <SportIcon sport={match.sport || 'beach-tennis'} size={64} showBackground={false} />
                    </View>
                )}

                {/* Navigation */}
                <View style={{ paddingTop: insets.top }} className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 py-2">
                    <Pressable onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
                        <ArrowLeft size={20} color="#171717" />
                    </Pressable>
                    <View className="flex-row gap-2">
                        <Pressable onPress={handleShare} className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
                            <Share2 size={18} color="#171717" />
                        </Pressable>
                        <Pressable className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
                            <MoreVertical size={18} color="#171717" />
                        </Pressable>
                    </View>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Main Info Card */}
                <View className="px-4 pt-4">
                    <View className="bg-white rounded-2xl p-5 shadow-sm">
                        {/* Sport Badge */}
                        <View className="flex-row items-center gap-2 mb-3">
                            <SportIcon sport={match.sport || 'beach-tennis'} size={20} showBackground={false} />
                            <Text className="text-neutral-900 font-bold text-sm uppercase">{sportName}</Text>
                        </View>

                        {/* Date & Time */}
                        <Text className="text-neutral-500 text-sm capitalize">
                            {format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}
                        </Text>
                        <Text className="text-neutral-900 text-2xl font-bold mt-1">
                            {format(date, 'HH:mm')} - {endTimeStr.slice(0, 5)}
                        </Text>

                        {/* Tags */}
                        <View className="flex-row flex-wrap gap-2 mt-4">
                            {/* Public/Private */}
                            {match.is_public !== undefined && (
                                match.is_public ? (
                                    <View className="bg-blue-50 px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
                                        <Globe size={14} color="#2563EB" />
                                        <Text className="text-blue-700 text-sm font-semibold">Pública</Text>
                                    </View>
                                ) : (
                                    <View className="bg-neutral-100 px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
                                        <Lock size={14} color="#525252" />
                                        <Text className="text-neutral-700 text-sm font-semibold">Privada</Text>
                                    </View>
                                )
                            )}
                            <View className="bg-neutral-100 px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
                                <Users size={14} color="#525252" />
                                <Text className="text-neutral-700 text-sm font-medium">{totalPlayers}/{match.max_players}</Text>
                            </View>
                            {match.is_competitive ? (
                                <View className="bg-amber-50 px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
                                    <Trophy size={14} color="#D97706" />
                                    <Text className="text-amber-700 text-sm font-semibold">Competitivo</Text>
                                </View>
                            ) : (
                                <View className="bg-green-50 px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
                                    <Zap size={14} color="#16A34A" />
                                    <Text className="text-green-700 text-sm font-semibold">Amistoso</Text>
                                </View>
                            )}
                            {match.court_booked && (
                                <View className="bg-green-50 px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
                                    <Check size={14} color="#16A34A" />
                                    <Text className="text-green-700 text-sm font-semibold">Quadra reservada</Text>
                                </View>
                            )}
                        </View>

                        {/* Stats Row */}
                        <View className="flex-row mt-5 pt-5 border-t border-neutral-100">
                            <View className="flex-1 items-center">
                                <View className="flex-row items-center gap-1 mb-1">
                                    <GenderIcon gender={match.gender_preference || 'mixed'} size={14} />
                                    <Text className="text-neutral-400 text-xs uppercase">Gênero</Text>
                                </View>
                                <Text className="text-neutral-900 font-bold">{genderLabel}</Text>
                            </View>
                            <View className="w-px bg-neutral-100" />
                            <View className="flex-1 items-center">
                                <View className="flex-row items-center gap-1 mb-1">
                                    <Target size={12} color="#A3A3A3" />
                                    <Text className="text-neutral-400 text-xs uppercase">Nível</Text>
                                </View>
                                <Text className="text-neutral-900 font-bold">
                                    {match.level_min?.toFixed(1) || '0'} - {match.level_max?.toFixed(1) || '7.0'}
                                </Text>
                            </View>
                            <View className="w-px bg-neutral-100" />
                            <View className="flex-1 items-center">
                                <View className="flex-row items-center gap-1 mb-1">
                                    <DollarSign size={12} color={hasPrice ? '#525252' : '#16A34A'} />
                                    <Text className="text-neutral-400 text-xs uppercase">{hasPrice ? 'Por pessoa' : 'Entrada'}</Text>
                                </View>
                                <Text className={`font-bold ${hasPrice ? 'text-neutral-900' : 'text-green-600'}`}>
                                    {hasPrice ? `R$ ${match.price_per_player?.toFixed(0)}` : 'Grátis'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Open Match / Court Booked - Playtomic Style */}
                <View className="px-4 mt-3">
                    <View className="bg-white rounded-2xl border-2 border-amber-300 px-5 py-3.5 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                            <Lock size={18} color="#171717" />
                            <Text className="text-neutral-900 font-semibold">
                                {match.is_public ? 'Open Match' : 'Private Match'}
                            </Text>
                        </View>
                        {match.court_booked && (
                            <View className="flex-row items-center gap-2">
                                <Check size={18} color="#16A34A" />
                                <Text className="text-green-600 font-semibold">Court booked</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Players Section - Playtomic Style */}
                <View className="px-4 mt-4">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-neutral-900 text-lg font-bold">Jogadores</Text>
                        <Text className="text-neutral-500 text-sm">{totalPlayers}/{match.max_players} confirmados</Text>
                    </View>

                    <View className="rounded-2xl overflow-hidden shadow-sm">
                        <ExpoLinearGradient
                            colors={['#1E293B', '#0F172A']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="p-5"
                        >
                            <View className="flex-row">
                                {/* Team A */}
                                <View className="flex-1">
                                    <View className="flex-row items-center justify-center mb-5">
                                        <View style={{ backgroundColor: sportColors.primary }} className="w-8 h-8 rounded-full items-center justify-center mr-2">
                                            <Text className="text-white font-black text-sm">A</Text>
                                        </View>
                                        <Text className="text-white font-bold text-base">Time A</Text>
                                    </View>

                                    {Array.from({ length: slotsPerTeam }).map((_, i) => {
                                        const player = teamA[i];
                                        return (
                                            <Pressable
                                                key={`a-${i}`}
                                                className="items-center mb-5"
                                                onPress={() => player && handlePlayerPress(player)}
                                            >
                                                {player ? (
                                                    <View className="items-center">
                                                        <View className="relative mb-2">
                                                            <View style={{ backgroundColor: sportColors.primary }} className="w-16 h-16 rounded-full p-0.5">
                                                                <RNImage
                                                                    source={{ uri: player.profile?.avatar_url || 'https://github.com/shadcn.png' }}
                                                                    className="w-full h-full rounded-full bg-slate-600"
                                                                />
                                                            </View>
                                                            <View style={{ backgroundColor: sportColors.primary }} className="absolute -bottom-1 left-1/2 -ml-4 px-2 py-0.5 rounded-full">
                                                                <Text className="text-white text-xs font-bold">{player.profile?.level?.toFixed(1) || '1.0'}</Text>
                                                            </View>
                                                        </View>
                                                        <Text className="text-white font-semibold text-sm">{player.profile?.full_name?.split(' ')[0]}</Text>
                                                        {player.payment_status === 'paid' && (
                                                            <View className="flex-row items-center mt-1">
                                                                <Check size={10} color="#4ADE80" />
                                                                <Text className="text-green-400 text-xs ml-0.5">Pago</Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                ) : (
                                                    <Pressable onPress={handleJoin} className="items-center">
                                                        <View style={{ borderColor: sportColors.primary }} className="w-16 h-16 rounded-full border-2 border-dashed items-center justify-center bg-slate-800/50 mb-2">
                                                            <Text style={{ color: sportColors.primary }} className="text-2xl">+</Text>
                                                        </View>
                                                        <Text style={{ color: sportColors.primary }} className="text-sm font-medium">Entrar</Text>
                                                    </Pressable>
                                                )}
                                            </Pressable>
                                        );
                                    })}
                                </View>

                                {/* VS Divider */}
                                <View className="items-center justify-center px-3">
                                    <View className="w-px h-full bg-slate-700 absolute" />
                                    <View className="bg-slate-700 rounded-full w-10 h-10 items-center justify-center">
                                        <Text className="text-slate-400 font-black text-xs">vs</Text>
                                    </View>
                                </View>

                                {/* Team B */}
                                <View className="flex-1">
                                    <View className="flex-row items-center justify-center mb-5">
                                        <View className="w-8 h-8 rounded-full items-center justify-center mr-2 bg-slate-500">
                                            <Text className="text-white font-black text-sm">B</Text>
                                        </View>
                                        <Text className="text-white font-bold text-base">Time B</Text>
                                    </View>

                                    {Array.from({ length: slotsPerTeam }).map((_, i) => {
                                        const player = teamB[i];
                                        return (
                                            <Pressable
                                                key={`b-${i}`}
                                                className="items-center mb-5"
                                                onPress={() => player && handlePlayerPress(player)}
                                            >
                                                {player ? (
                                                    <View className="items-center">
                                                        <View className="relative mb-2">
                                                            <View className="w-16 h-16 rounded-full p-0.5 bg-slate-500">
                                                                <RNImage
                                                                    source={{ uri: player.profile?.avatar_url || 'https://github.com/shadcn.png' }}
                                                                    className="w-full h-full rounded-full bg-slate-600"
                                                                />
                                                            </View>
                                                            <View className="absolute -bottom-1 left-1/2 -ml-4 bg-slate-500 px-2 py-0.5 rounded-full">
                                                                <Text className="text-white text-xs font-bold">{player.profile?.level?.toFixed(1) || '1.0'}</Text>
                                                            </View>
                                                        </View>
                                                        <Text className="text-white font-semibold text-sm">{player.profile?.full_name?.split(' ')[0]}</Text>
                                                        {player.payment_status === 'paid' && (
                                                            <View className="flex-row items-center mt-1">
                                                                <Check size={10} color="#4ADE80" />
                                                                <Text className="text-green-400 text-xs ml-0.5">Pago</Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                ) : (
                                                    <Pressable onPress={handleJoin} className="items-center">
                                                        <View className="w-16 h-16 rounded-full border-2 border-dashed border-slate-500 items-center justify-center bg-slate-800/50 mb-2">
                                                            <Text className="text-slate-400 text-2xl">+</Text>
                                                        </View>
                                                        <Text className="text-slate-400 text-sm font-medium">Vaga aberta</Text>
                                                    </Pressable>
                                                )}
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>
                        </ExpoLinearGradient>
                    </View>
                </View>

                {/* Chat Button */}
                <View className="px-4 mt-4">
                    <Pressable className="bg-white rounded-2xl py-4 flex-row items-center justify-center gap-2 shadow-sm border border-neutral-100">
                        <MessageCircle size={20} color="#525252" />
                        <Text className="text-neutral-700 font-semibold">Chat da Partida</Text>
                        <View className="bg-red-500 w-2 h-2 rounded-full ml-1" />
                    </Pressable>
                </View>

                {/* Location Card */}
                <View className="px-4 mt-4">
                    <Text className="text-neutral-900 text-lg font-bold mb-3">Local</Text>
                    <Pressable
                        onPress={handleOpenMaps}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm"
                    >
                        <View className="h-24">
                            {match.court?.images?.[0] && (
                                <RNImage
                                    source={{ uri: match.court.images[0] }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            )}
                        </View>
                        <View className="p-4">
                            <View className="flex-row items-start justify-between">
                                <View className="flex-1 mr-3">
                                    <Text className="text-neutral-900 font-bold text-base">{match.court?.name || 'Local'}</Text>
                                    <View className="flex-row items-center mt-1">
                                        <MapPin size={14} color="#737373" />
                                        <Text className="text-neutral-500 text-sm ml-1" numberOfLines={1}>{match.court?.location}</Text>
                                    </View>
                                    {match.court?.type && (
                                        <View className="bg-neutral-100 self-start px-2 py-1 rounded-md mt-2">
                                            <Text className="text-neutral-600 text-xs">{match.court.type}</Text>
                                        </View>
                                    )}
                                </View>
                                <View className="w-11 h-11 rounded-full items-center justify-center bg-green-500">
                                    <Navigation size={18} color="#FFF" />
                                </View>
                            </View>
                        </View>
                    </Pressable>
                </View>

                {/* Match Info */}
                <View className="px-4 mt-4">
                    <Text className="text-neutral-900 text-lg font-bold mb-3">Sobre a partida</Text>
                    <View className="bg-white rounded-2xl p-4 shadow-sm">
                        {/* Match Type */}
                        <View className="flex-row items-center pb-4 border-b border-neutral-100">
                            <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${match.is_competitive ? 'bg-amber-50' : 'bg-green-50'}`}>
                                {match.is_competitive ? (
                                    <Trophy size={20} color="#D97706" />
                                ) : (
                                    <Zap size={20} color="#16A34A" />
                                )}
                            </View>
                            <View className="flex-1">
                                <Text className="text-neutral-900 font-bold">{match.is_competitive ? 'Partida Competitiva' : 'Partida Amistosa'}</Text>
                                <Text className="text-neutral-500 text-sm">
                                    {match.is_competitive
                                        ? 'Resultado conta para o ranking'
                                        : 'Sem impacto no seu nível'}
                                </Text>
                            </View>
                        </View>

                        {/* Duration */}
                        <View className="flex-row items-center py-4 border-b border-neutral-100">
                            <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-neutral-100">
                                <Clock size={20} color="#737373" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-neutral-900 font-bold">Duração</Text>
                                <Text className="text-neutral-500 text-sm">
                                    {(() => {
                                        if (match.duration) {
                                            const hours = Math.floor(match.duration);
                                            const mins = Math.round((match.duration % 1) * 60);
                                            if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
                                            if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
                                            return `${mins} minutos`;
                                        }
                                        // Fallback: calculate from start/end time
                                        const start = new Date(`2000-01-01T${timeStr}`);
                                        const end = new Date(`2000-01-01T${endTimeStr}`);
                                        let diff = (end.getTime() - start.getTime()) / (1000 * 60);
                                        if (diff <= 0) diff = 90; // Default 90 min
                                        const hours = Math.floor(diff / 60);
                                        const mins = Math.round(diff % 60);
                                        if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
                                        if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
                                        return `${mins} minutos`;
                                    })()}
                                </Text>
                            </View>
                        </View>

                        {/* Registration deadline */}
                        <View className="flex-row items-center pt-4">
                            <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-neutral-100">
                                <Calendar size={20} color="#737373" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-neutral-900 font-bold">Inscrições até</Text>
                                <Text className="text-neutral-500 text-sm">
                                    {format(date, "EEEE, d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View
                className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-4 pt-3"
                style={{ paddingBottom: insets.bottom + 12 }}
            >
                {isParticipant ? (
                    <Pressable
                        onPress={() => router.push(`/match/${id}/checkin`)}
                        className="bg-neutral-100 w-full h-14 rounded-full items-center justify-center flex-row gap-2"
                    >
                        <Check size={20} color="#171717" />
                        <Text className="text-neutral-900 font-bold text-base">Você está confirmado</Text>
                    </Pressable>
                ) : (
                    <Pressable
                        onPress={handleJoin}
                        className="bg-green-500 w-full h-14 rounded-full items-center justify-center flex-row gap-2"
                    >
                        <Text className="text-white font-bold text-base">
                            {hasPrice ? `Entrar na Partida • R$ ${match.price_per_player?.toFixed(0)}` : 'Entrar na Partida'}
                        </Text>
                        <ChevronRight size={20} color="#FFF" />
                    </Pressable>
                )}
            </View>

            {/* Player Profile Bottom Sheet */}
            <BottomSheet
                visible={showPlayerSheet}
                onClose={() => setShowPlayerSheet(false)}
                snapPoints={['50%']}
                showCloseButton={true}
                title="Perfil do Jogador"
            >
                {selectedPlayer && (
                    <View className="px-5 py-4">
                        <View className="items-center mb-6">
                            <RNImage
                                source={{ uri: selectedPlayer.profile?.avatar_url }}
                                className="w-24 h-24 rounded-full bg-slate-200 mb-3"
                            />
                            <Text className="text-xl font-bold text-slate-900">{selectedPlayer.profile?.full_name}</Text>
                            <View className="flex-row items-center mt-1">
                                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                                <Text className="text-slate-500 ml-1">Nível {selectedPlayer.profile?.level?.toFixed(1) || '1.0'}</Text>
                            </View>
                        </View>

                        <View className="gap-3">
                            <Pressable className="flex-row items-center justify-center bg-blue-500 py-4 rounded-2xl gap-2">
                                <UserPlus size={20} color="#FFF" />
                                <Text className="text-white font-bold">Adicionar Amigo</Text>
                            </Pressable>
                            <Pressable className="flex-row items-center justify-center bg-slate-100 py-4 rounded-2xl gap-2">
                                <MessageCircle size={20} color="#0F172A" />
                                <Text className="text-slate-900 font-bold">Enviar Mensagem</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </BottomSheet>
        </View>
    );
}
