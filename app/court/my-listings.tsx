import { View, Text, StyleSheet, Pressable, ScrollView, Image, Switch } from 'react-native';
import { router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ChevronLeft,
    Plus,
    Calendar,
    DollarSign,
    Star,
    MoreHorizontal,
    Clock,
    Users,
    TrendingUp,
    Settings,
    Home,
    LayoutGrid,
    MessageSquare,
    Menu,
    User,
    CreditCard,
    Shield,
    Zap,
    HeartHandshake,
    ArrowRight,
    Bell,
    HelpCircle,
    LogOut,
    ChevronRight,
    Edit3,
    Eye,
    EyeOff,
    MapPin,
    Wallet,
    FileText,
    Lock,
    Globe,
    CircleDollarSign,
    BadgePercent,
    Trophy,
    Target,
    Shuffle,
    Play,
    Share2,
    Copy,
    Award,
} from 'lucide-react-native';
import { useState } from 'react';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { useProfile, UserProfile } from '../../hooks/useProfile';

// Mock - em produção viria do banco
const USER_HAS_LISTINGS = true; // Mudar para false para ver onboarding

const MOCK_LISTINGS = [
    {
        id: '1',
        name: 'Quadra Beach Tennis Premium',
        image: 'https://images.unsplash.com/photo-1610419846569-450cb05cae1a?q=80&w=800',
        status: 'active',
        rating: 4.9,
        reviews: 28,
        bookingsThisMonth: 45,
        revenue: 5400,
        nextBooking: 'Hoje, 18:00',
        pricePerHour: 120,
        location: 'São Paulo, SP',
    },
    {
        id: '2',
        name: 'Quadra de Tênis Coberta',
        image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800',
        status: 'active',
        rating: 4.7,
        reviews: 15,
        bookingsThisMonth: 32,
        revenue: 3200,
        nextBooking: 'Amanhã, 09:00',
        pricePerHour: 100,
        location: 'São Paulo, SP',
    },
];

const MOCK_BOOKINGS_TODAY = [
    { id: '1', time: '08:00', duration: '1h', guest: 'Maria Santos', court: 'Beach Tennis', price: 120, status: 'confirmed', avatar: 'https://i.pravatar.cc/100?img=1' },
    { id: '2', time: '10:00', duration: '2h', guest: 'Pedro Oliveira', court: 'Beach Tennis', price: 240, status: 'confirmed', avatar: 'https://i.pravatar.cc/100?img=2' },
    { id: '3', time: '14:00', duration: '1h', guest: 'Ana Costa', court: 'Tênis Coberta', price: 100, status: 'pending', avatar: 'https://i.pravatar.cc/100?img=3' },
    { id: '4', time: '18:00', duration: '1h', guest: 'João Silva', court: 'Beach Tennis', price: 120, status: 'confirmed', avatar: 'https://i.pravatar.cc/100?img=4' },
];

const MOCK_CONVERSATIONS = [
    { id: '1', name: 'Maria Santos', lastMessage: 'Obrigada! Chego às 8h em ponto.', time: '10:30', unread: 0, avatar: 'https://i.pravatar.cc/100?img=1' },
    { id: '2', name: 'Pedro Oliveira', lastMessage: 'Posso levar um amigo?', time: '09:15', unread: 2, avatar: 'https://i.pravatar.cc/100?img=2' },
    { id: '3', name: 'Ana Costa', lastMessage: 'Qual o endereço exato?', time: 'Ontem', unread: 1, avatar: 'https://i.pravatar.cc/100?img=3' },
    { id: '4', name: 'Carlos Lima', lastMessage: 'Reserva confirmada!', time: 'Ontem', unread: 0, avatar: 'https://i.pravatar.cc/100?img=5' },
];

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Mock Torneios
const MOCK_TOURNAMENTS = [
    {
        id: '1',
        name: 'Copa Beach Pinheiros 2024',
        sport: 'Beach Tennis',
        format: 'Eliminatória Simples',
        status: 'inscricoes_abertas',
        date: '21 Dez 2024',
        time: '08:00',
        location: 'Arena Beach Pinheiros',
        maxTeams: 16,
        registeredTeams: 12,
        pricePerTeam: 100,
        totalRevenue: 1200,
        category: 'Masculino',
        level: 'Intermediário',
        banner: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800',
    },
    {
        id: '2',
        name: 'Torneio Relâmpago Padel',
        sport: 'Padel',
        format: 'Round Robin',
        status: 'em_andamento',
        date: '14 Dez 2024',
        time: '09:00',
        location: 'Arena Beach Pinheiros',
        maxTeams: 8,
        registeredTeams: 8,
        pricePerTeam: 80,
        totalRevenue: 640,
        category: 'Misto',
        level: 'Todos',
        banner: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800',
        matchesPlayed: 6,
        matchesTotal: 12,
    },
    {
        id: '3',
        name: 'Liga Mensal Beach Tennis',
        sport: 'Beach Tennis',
        format: 'Fase de Grupos + Mata-Mata',
        status: 'finalizado',
        date: '07 Dez 2024',
        time: '08:00',
        location: 'Arena Beach Pinheiros',
        maxTeams: 32,
        registeredTeams: 32,
        pricePerTeam: 120,
        totalRevenue: 3840,
        category: 'Feminino',
        level: 'Avançado',
        banner: 'https://images.unsplash.com/photo-1610419846569-450cb05cae1a?q=80&w=800',
        winner: 'Maria/Ana',
    },
];

const TOURNAMENT_STATS = [
    { id: 'active', label: 'Em Andamento', value: '1', icon: Play, color: '#22C55E' },
    { id: 'upcoming', label: 'Próximos', value: '2', icon: Calendar, color: '#3B82F6' },
    { id: 'participants', label: 'Participantes', value: '156', icon: Users, color: '#F59E0B' },
    { id: 'revenue', label: 'Receita Total', value: 'R$ 5.6k', icon: DollarSign, color: '#8B5CF6' },
];

const HOW_IT_WORKS = [
    { step: 1, title: 'Cadastre sua quadra', description: 'Adicione fotos, horários disponíveis e valores' },
    { step: 2, title: 'Receba reservas', description: 'Jogadores encontram e reservam sua quadra pelo app' },
    { step: 3, title: 'Receba pagamentos', description: 'Pagamento seguro direto na sua conta' },
];

const BENEFITS = [
    { icon: DollarSign, title: 'Renda extra', description: 'Ganhe dinheiro com sua quadra parada' },
    { icon: Shield, title: 'Seguro', description: 'Proteção contra danos e cancelamentos' },
    { icon: Zap, title: 'Automático', description: 'Reservas e pagamentos automáticos' },
    { icon: HeartHandshake, title: 'Suporte', description: 'Ajuda sempre que precisar' },
];

const QUICK_STATS = [
    { id: 'bookings', label: 'Reservas', value: '45', subValue: 'este mês', icon: Calendar, color: '#22C55E' },
    { id: 'revenue', label: 'Receita', value: 'R$ 5.4k', subValue: '+12% vs mês anterior', icon: DollarSign, color: '#22C55E' },
    { id: 'rating', label: 'Avaliação', value: '4.9', subValue: '28 avaliações', icon: Star, color: '#F59E0B' },
    { id: 'occupancy', label: 'Ocupação', value: '78%', subValue: 'média semanal', icon: TrendingUp, color: '#3B82F6' },
];

// ============================================
// TAB: HOJE (Dashboard)
// ============================================
function HojeTab() {
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                {QUICK_STATS.map((stat) => (
                    <Pressable key={stat.id} style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <stat.icon size={20} color={stat.color} />
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statSubValue}>{stat.subValue}</Text>
                    </Pressable>
                ))}
            </View>

            {/* Reservas de Hoje */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitleNoMargin}>Reservas de hoje</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{MOCK_BOOKINGS_TODAY.length}</Text>
                    </View>
                </View>

                {MOCK_BOOKINGS_TODAY.map((booking) => (
                    <Pressable key={booking.id} style={styles.bookingCard}>
                        <View style={styles.bookingTime}>
                            <Text style={styles.bookingTimeText}>{booking.time}</Text>
                            <Text style={styles.bookingDuration}>{booking.duration}</Text>
                        </View>
                        <Image source={{ uri: booking.avatar }} style={styles.bookingAvatar} />
                        <View style={styles.bookingInfo}>
                            <Text style={styles.bookingName}>{booking.guest}</Text>
                            <Text style={styles.bookingCourt}>{booking.court}</Text>
                        </View>
                        <View style={[styles.bookingStatus, booking.status === 'pending' && styles.bookingStatusPending]}>
                            <Text style={[styles.bookingStatusText, booking.status === 'pending' && styles.bookingStatusTextPending]}>
                                {booking.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                            </Text>
                        </View>
                    </Pressable>
                ))}
            </View>

            {/* Minhas Quadras */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitleNoMargin}>Minhas quadras</Text>
                    <Pressable onPress={() => router.push('/court/new/private/type')} style={styles.addButton}>
                        <Plus size={20} color="#22C55E" />
                    </Pressable>
                </View>
                {MOCK_LISTINGS.map((listing) => (
                    <Pressable key={listing.id} style={styles.listingCard}>
                        <Image source={{ uri: listing.image }} style={styles.listingImage} />
                        <View style={styles.listingContent}>
                            <Text style={styles.listingName}>{listing.name}</Text>
                            <View style={styles.listingStats}>
                                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                                <Text style={styles.listingStatText}>{listing.rating}</Text>
                                <Text style={styles.listingStatDivider}>•</Text>
                                <Text style={styles.listingStatText}>{listing.bookingsThisMonth} reservas</Text>
                            </View>
                            <View style={styles.listingStatus}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>Ativo</Text>
                            </View>
                        </View>
                        <MoreHorizontal size={20} color="#9CA3AF" />
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );
}

// AgendaTab component - Reserved for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AgendaTab() {
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const today = new Date();
    const currentMonth = today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const bookingsByDay: Record<number, number> = { 14: 3, 15: 2, 16: 4, 17: 1, 18: 2, 20: 3, 21: 1 };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={styles.calendarContainer}>
                <Text style={styles.calendarMonth}>{currentMonth}</Text>
                <View style={styles.weekDaysRow}>
                    {WEEK_DAYS.map((day) => (
                        <Text key={day} style={styles.weekDayText}>{day}</Text>
                    ))}
                </View>
                <View style={styles.daysGrid}>
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <View key={`empty-${i}`} style={styles.dayCell} />
                    ))}
                    {days.map((day) => {
                        const isSelected = day === selectedDate;
                        const isToday = day === today.getDate();
                        const hasBookings = bookingsByDay[day];
                        return (
                            <Pressable
                                key={day}
                                style={[styles.dayCell, isSelected && styles.dayCellSelected, isToday && !isSelected && styles.dayCellToday]}
                                onPress={() => setSelectedDate(day)}
                            >
                                <Text style={[styles.dayText, isSelected && styles.dayTextSelected, isToday && !isSelected && styles.dayTextToday]}>{day}</Text>
                                {hasBookings && <View style={[styles.bookingDot, isSelected && styles.bookingDotSelected]} />}
                            </Pressable>
                        );
                    })}
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reservas do dia {selectedDate}</Text>
                {MOCK_BOOKINGS_TODAY.slice(0, bookingsByDay[selectedDate] || 0).map((booking) => (
                    <Pressable key={booking.id} style={styles.bookingCard}>
                        <View style={styles.bookingTime}>
                            <Text style={styles.bookingTimeText}>{booking.time}</Text>
                            <Text style={styles.bookingDuration}>{booking.duration}</Text>
                        </View>
                        <Image source={{ uri: booking.avatar }} style={styles.bookingAvatar} />
                        <View style={styles.bookingInfo}>
                            <Text style={styles.bookingName}>{booking.guest}</Text>
                            <Text style={styles.bookingCourt}>{booking.court}</Text>
                        </View>
                        <View style={styles.bookingPrice}>
                            <Text style={styles.bookingPriceText}>R$ {booking.price}</Text>
                        </View>
                    </Pressable>
                ))}
                {!bookingsByDay[selectedDate] && (
                    <View style={styles.emptyState}>
                        <Calendar size={48} color="#D1D5DB" />
                        <Text style={styles.emptyStateText}>Nenhuma reserva neste dia</Text>
                    </View>
                )}
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gerenciar disponibilidade</Text>
                <Pressable style={styles.actionCard}>
                    <View style={styles.actionIcon}><Clock size={24} color="#22C55E" /></View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Horários disponíveis</Text>
                        <Text style={styles.actionDescription}>Configure os horários de funcionamento</Text>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                </Pressable>
                <Pressable style={styles.actionCard}>
                    <View style={styles.actionIcon}><EyeOff size={24} color="#F59E0B" /></View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Bloquear datas</Text>
                        <Text style={styles.actionDescription}>Marque dias indisponíveis</Text>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                </Pressable>
            </View>
        </ScrollView>
    );
}

// ============================================
// TAB: GESTÃO (Quadras)
// ============================================
function GestaoTab() {
    const [selectedCourt, setSelectedCourt] = useState<string | null>(null);

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Header com ações */}
            <View style={styles.gestaoHeader}>
                <Pressable
                    style={styles.addCourtButton}
                    onPress={() => router.push('/court/new/private/type')}
                >
                    <Plus size={20} color="#FFF" />
                    <Text style={styles.addCourtButtonText}>Nova Quadra</Text>
                </Pressable>
            </View>

            {/* Lista de Quadras */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Minhas quadras ({MOCK_LISTINGS.length})</Text>

                {MOCK_LISTINGS.map((court) => (
                    <Animated.View key={court.id} entering={FadeInUp}>
                        <Pressable
                            style={[styles.courtCard, selectedCourt === court.id && styles.courtCardSelected]}
                            onPress={() => setSelectedCourt(selectedCourt === court.id ? null : court.id)}
                        >
                            <Image source={{ uri: court.image }} style={styles.courtImage} />
                            <View style={styles.courtContent}>
                                <View style={styles.courtHeader}>
                                    <Text style={styles.courtName}>{court.name}</Text>
                                    <View style={[styles.courtStatusBadge, court.status === 'active' ? styles.statusActive : styles.statusInactive]}>
                                        <Text style={styles.courtStatusText}>
                                            {court.status === 'active' ? 'Ativo' : 'Pausado'}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.courtMeta}>
                                    <MapPin size={14} color="#6B7280" />
                                    <Text style={styles.courtMetaText}>{court.location}</Text>
                                </View>

                                <View style={styles.courtStats}>
                                    <View style={styles.courtStatItem}>
                                        <Star size={14} color="#F59E0B" fill="#F59E0B" />
                                        <Text style={styles.courtStatValue}>{court.rating}</Text>
                                        <Text style={styles.courtStatLabel}>({court.reviews})</Text>
                                    </View>
                                    <View style={styles.courtStatItem}>
                                        <DollarSign size={14} color="#22C55E" />
                                        <Text style={styles.courtStatValue}>R$ {court.pricePerHour}</Text>
                                        <Text style={styles.courtStatLabel}>/hora</Text>
                                    </View>
                                </View>
                            </View>
                        </Pressable>

                        {selectedCourt === court.id && (
                            <Animated.View entering={FadeIn} style={styles.courtActions}>
                                <Pressable style={styles.courtActionButton}>
                                    <Edit3 size={18} color="#3B82F6" />
                                    <Text style={styles.courtActionText}>Editar</Text>
                                </Pressable>
                                <Pressable style={styles.courtActionButton}>
                                    <CircleDollarSign size={18} color="#22C55E" />
                                    <Text style={styles.courtActionText}>Preços</Text>
                                </Pressable>
                                <Pressable style={styles.courtActionButton}>
                                    <Clock size={18} color="#F59E0B" />
                                    <Text style={styles.courtActionText}>Horários</Text>
                                </Pressable>
                                <Pressable style={styles.courtActionButton}>
                                    <Eye size={18} color="#6B7280" />
                                    <Text style={styles.courtActionText}>Pausar</Text>
                                </Pressable>
                            </Animated.View>
                        )}
                    </Animated.View>
                ))}
            </View>

            {/* Configurações Gerais */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Configurações</Text>

                <Pressable style={styles.settingItem}>
                    <View style={[styles.settingIcon, { backgroundColor: '#DCFCE7' }]}>
                        <BadgePercent size={20} color="#22C55E" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Descontos e promoções</Text>
                        <Text style={styles.settingDescription}>Configure ofertas especiais</Text>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                </Pressable>

                <Pressable style={styles.settingItem}>
                    <View style={[styles.settingIcon, { backgroundColor: '#FEF3C7' }]}>
                        <Bell size={20} color="#F59E0B" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Notificações</Text>
                        <Text style={styles.settingDescription}>Alertas de reservas e mensagens</Text>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                </Pressable>

                <Pressable style={styles.settingItem}>
                    <View style={[styles.settingIcon, { backgroundColor: '#DBEAFE' }]}>
                        <FileText size={20} color="#3B82F6" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Políticas de cancelamento</Text>
                        <Text style={styles.settingDescription}>Regras e reembolsos</Text>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                </Pressable>
            </View>
        </ScrollView>
    );
}

// ============================================
// TAB: MENSAGENS
// ============================================
function MensagensTab() {
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitleNoMargin}>Conversas</Text>
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>3</Text>
                    </View>
                </View>

                {MOCK_CONVERSATIONS.map((conversation) => (
                    <Pressable key={conversation.id} style={styles.conversationCard}>
                        <View style={styles.conversationAvatarContainer}>
                            <Image source={{ uri: conversation.avatar }} style={styles.conversationAvatar} />
                            {conversation.unread > 0 && (
                                <View style={styles.conversationUnreadDot} />
                            )}
                        </View>
                        <View style={styles.conversationContent}>
                            <View style={styles.conversationHeader}>
                                <Text style={[styles.conversationName, conversation.unread > 0 && styles.conversationNameUnread]}>
                                    {conversation.name}
                                </Text>
                                <Text style={styles.conversationTime}>{conversation.time}</Text>
                            </View>
                            <Text
                                style={[styles.conversationMessage, conversation.unread > 0 && styles.conversationMessageUnread]}
                                numberOfLines={1}
                            >
                                {conversation.lastMessage}
                            </Text>
                        </View>
                        {conversation.unread > 0 && (
                            <View style={styles.conversationUnreadBadge}>
                                <Text style={styles.conversationUnreadText}>{conversation.unread}</Text>
                            </View>
                        )}
                    </Pressable>
                ))}
            </View>

            {/* Respostas rápidas */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Respostas rápidas</Text>
                <View style={styles.quickRepliesGrid}>
                    {['Olá! Como posso ajudar?', 'Reserva confirmada!', 'Qual o horário?', 'Endereço enviado'].map((reply, i) => (
                        <Pressable key={i} style={styles.quickReplyChip}>
                            <Text style={styles.quickReplyText}>{reply}</Text>
                        </Pressable>
                    ))}
                </View>
                <Pressable style={styles.manageRepliesButton}>
                    <Settings size={16} color="#22C55E" />
                    <Text style={styles.manageRepliesText}>Gerenciar respostas</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

// ============================================
// TAB: MENU (Configurações)
// ============================================
function MenuTab({ profile }: { profile: UserProfile | null }) {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // Get year from created_at or current year
    const hostSinceYear = profile?.created_at
        ? new Date(profile.created_at).getFullYear()
        : new Date().getFullYear();

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Perfil do Host */}
            <View style={styles.profileSection}>
                <Image
                    source={{ uri: profile?.avatar_url || 'https://i.pravatar.cc/200?img=12' }}
                    style={styles.profileAvatar}
                />
                <Text style={styles.profileName}>{profile?.name || 'Carregando...'}</Text>
                <Text style={styles.profileRole}>Host desde {hostSinceYear}</Text>
                <View style={styles.profileStats}>
                    <View style={styles.profileStatItem}>
                        <Text style={styles.profileStatValue}>{(profile as any)?.host_rating?.toFixed(1) || '4.9'}</Text>
                        <Text style={styles.profileStatLabel}>Avaliação</Text>
                    </View>
                    <View style={styles.profileStatDivider} />
                    <View style={styles.profileStatItem}>
                        <Text style={styles.profileStatValue}>{(profile as any)?.total_bookings || 0}</Text>
                        <Text style={styles.profileStatLabel}>Reservas</Text>
                    </View>
                    <View style={styles.profileStatDivider} />
                    <View style={styles.profileStatItem}>
                        <Text style={styles.profileStatValue}>{profile?.total_courts || 0}</Text>
                        <Text style={styles.profileStatLabel}>Quadras</Text>
                    </View>
                </View>
            </View>

            {/* Conta */}
            <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>Conta</Text>

                <Pressable style={styles.menuItem} onPress={() => router.push('/profile/edit')}>
                    <View style={[styles.menuIcon, { backgroundColor: '#DBEAFE' }]}>
                        <User size={20} color="#3B82F6" />
                    </View>
                    <Text style={styles.menuItemText}>Editar perfil</Text>
                    <ChevronRight size={20} color="#9CA3AF" />
                </Pressable>

                <Pressable style={styles.menuItem} onPress={() => router.push('/host/bank-details')}>
                    <View style={[styles.menuIcon, { backgroundColor: '#DCFCE7' }]}>
                        <Wallet size={20} color="#22C55E" />
                    </View>
                    <Text style={styles.menuItemText}>Dados bancários</Text>
                    <ChevronRight size={20} color="#9CA3AF" />
                </Pressable>

                <Pressable style={styles.menuItem} onPress={() => router.push('/host/payments')}>
                    <View style={[styles.menuIcon, { backgroundColor: '#FEF3C7' }]}>
                        <CreditCard size={20} color="#F59E0B" />
                    </View>
                    <Text style={styles.menuItemText}>Histórico de pagamentos</Text>
                    <ChevronRight size={20} color="#9CA3AF" />
                </Pressable>

                <Pressable style={styles.menuItem} onPress={() => router.push('/host/documents')}>
                    <View style={[styles.menuIcon, { backgroundColor: '#FCE7F3' }]}>
                        <FileText size={20} color="#EC4899" />
                    </View>
                    <Text style={styles.menuItemText}>Documentos fiscais</Text>
                    <ChevronRight size={20} color="#9CA3AF" />
                </Pressable>
            </View>

            {/* Preferências */}
            <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>Preferências</Text>

                <View style={styles.menuItem}>
                    <View style={[styles.menuIcon, { backgroundColor: '#FEF3C7' }]}>
                        <Bell size={20} color="#F59E0B" />
                    </View>
                    <Text style={styles.menuItemText}>Notificações</Text>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                        thumbColor={notificationsEnabled ? '#22C55E' : '#9CA3AF'}
                    />
                </View>

                <Pressable style={styles.menuItem} onPress={() => router.push('/settings')}>
                    <View style={[styles.menuIcon, { backgroundColor: '#E0E7FF' }]}>
                        <Globe size={20} color="#6366F1" />
                    </View>
                    <Text style={styles.menuItemText}>Idioma</Text>
                    <View style={styles.menuItemValue}>
                        <Text style={styles.menuItemValueText}>Português</Text>
                        <ChevronRight size={20} color="#9CA3AF" />
                    </View>
                </Pressable>

                <Pressable style={styles.menuItem} onPress={() => router.push('/settings')}>
                    <View style={[styles.menuIcon, { backgroundColor: '#F3E8FF' }]}>
                        <Lock size={20} color="#A855F7" />
                    </View>
                    <Text style={styles.menuItemText}>Privacidade</Text>
                    <ChevronRight size={20} color="#9CA3AF" />
                </Pressable>
            </View>

            {/* Suporte */}
            <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>Suporte</Text>

                <Pressable style={styles.menuItem} onPress={() => router.push('/settings')}>
                    <View style={[styles.menuIcon, { backgroundColor: '#DBEAFE' }]}>
                        <HelpCircle size={20} color="#3B82F6" />
                    </View>
                    <Text style={styles.menuItemText}>Central de ajuda</Text>
                    <ChevronRight size={20} color="#9CA3AF" />
                </Pressable>

                <Pressable style={styles.menuItem} onPress={() => router.push('/settings')}>
                    <View style={[styles.menuIcon, { backgroundColor: '#DCFCE7' }]}>
                        <MessageSquare size={20} color="#22C55E" />
                    </View>
                    <Text style={styles.menuItemText}>Falar com suporte</Text>
                    <ChevronRight size={20} color="#9CA3AF" />
                </Pressable>
            </View>

            {/* Logout */}
            <Pressable style={styles.logoutButton} onPress={() => router.back()}>
                <LogOut size={20} color="#EF4444" />
                <Text style={styles.logoutText}>Sair do modo anfitrião</Text>
            </Pressable>
        </ScrollView>
    );
}

// ============================================
// TAB: TORNEIOS
// ============================================
function TorneiosTab() {
    const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'finished'>('all');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'inscricoes_abertas':
                return { label: 'Inscrições Abertas', color: '#22C55E', bg: '#DCFCE7' };
            case 'em_andamento':
                return { label: 'Em Andamento', color: '#F59E0B', bg: '#FEF3C7' };
            case 'finalizado':
                return { label: 'Finalizado', color: '#6B7280', bg: '#F3F4F6' };
            default:
                return { label: 'Rascunho', color: '#9CA3AF', bg: '#F9FAFB' };
        }
    };

    const filteredTournaments = MOCK_TOURNAMENTS.filter((t) => {
        if (filter === 'all') return true;
        if (filter === 'active') return t.status === 'em_andamento';
        if (filter === 'upcoming') return t.status === 'inscricoes_abertas';
        if (filter === 'finished') return t.status === 'finalizado';
        return true;
    });

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Header com botão criar */}
            <View style={styles.tournamentHeader}>
                <Pressable
                    style={styles.createTournamentButton}
                    onPress={() => router.push('/tournament/create')}
                >
                    <Trophy size={20} color="#FFF" />
                    <Text style={styles.createTournamentButtonText}>Criar Torneio</Text>
                </Pressable>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                {TOURNAMENT_STATS.map((stat) => (
                    <Pressable key={stat.id} style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <stat.icon size={20} color={stat.color} />
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                        <Text style={styles.statValue}>{stat.value}</Text>
                    </Pressable>
                ))}
            </View>

            {/* Filtros */}
            <View style={styles.filterRow}>
                {[
                    { id: 'all', label: 'Todos' },
                    { id: 'active', label: 'Ativos' },
                    { id: 'upcoming', label: 'Próximos' },
                    { id: 'finished', label: 'Finalizados' },
                ].map((f) => (
                    <Pressable
                        key={f.id}
                        style={[styles.filterChip, filter === f.id && styles.filterChipActive]}
                        onPress={() => setFilter(f.id as any)}
                    >
                        <Text style={[styles.filterChipText, filter === f.id && styles.filterChipTextActive]}>
                            {f.label}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {/* Lista de Torneios */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Meus Torneios ({filteredTournaments.length})</Text>

                {filteredTournaments.map((tournament) => {
                    const statusBadge = getStatusBadge(tournament.status);
                    return (
                        <Animated.View key={tournament.id} entering={FadeInUp}>
                            <Pressable style={styles.tournamentCard}>
                                {/* Banner */}
                                <Image source={{ uri: tournament.banner }} style={styles.tournamentBanner} />

                                {/* Status Badge */}
                                <View style={[styles.tournamentStatusBadge, { backgroundColor: statusBadge.bg }]}>
                                    <Text style={[styles.tournamentStatusText, { color: statusBadge.color }]}>
                                        {statusBadge.label}
                                    </Text>
                                </View>

                                {/* Content */}
                                <View style={styles.tournamentContent}>
                                    <View style={styles.tournamentMeta}>
                                        <View style={styles.tournamentSportBadge}>
                                            <Text style={styles.tournamentSportText}>{tournament.sport}</Text>
                                        </View>
                                        <Text style={styles.tournamentFormat}>{tournament.format}</Text>
                                    </View>

                                    <Text style={styles.tournamentName}>{tournament.name}</Text>

                                    <View style={styles.tournamentInfo}>
                                        <View style={styles.tournamentInfoItem}>
                                            <Calendar size={14} color="#6B7280" />
                                            <Text style={styles.tournamentInfoText}>{tournament.date}</Text>
                                        </View>
                                        <View style={styles.tournamentInfoItem}>
                                            <MapPin size={14} color="#6B7280" />
                                            <Text style={styles.tournamentInfoText}>{tournament.location}</Text>
                                        </View>
                                    </View>

                                    {/* Progress or Results */}
                                    {tournament.status === 'inscricoes_abertas' && (
                                        <View style={styles.tournamentProgress}>
                                            <View style={styles.progressBar}>
                                                <View
                                                    style={[
                                                        styles.progressFill,
                                                        { width: `${(tournament.registeredTeams / tournament.maxTeams) * 100}%` },
                                                    ]}
                                                />
                                            </View>
                                            <Text style={styles.progressText}>
                                                {tournament.registeredTeams}/{tournament.maxTeams} duplas inscritas
                                            </Text>
                                        </View>
                                    )}

                                    {tournament.status === 'em_andamento' && (
                                        <View style={styles.tournamentLive}>
                                            <View style={styles.liveDot} />
                                            <Text style={styles.liveText}>
                                                {tournament.matchesPlayed}/{tournament.matchesTotal} partidas
                                            </Text>
                                        </View>
                                    )}

                                    {tournament.status === 'finalizado' && tournament.winner && (
                                        <View style={styles.tournamentWinner}>
                                            <Trophy size={16} color="#F59E0B" />
                                            <Text style={styles.winnerText}>Campeão: {tournament.winner}</Text>
                                        </View>
                                    )}

                                    {/* Stats Row */}
                                    <View style={styles.tournamentStats}>
                                        <View style={styles.tournamentStatItem}>
                                            <Users size={14} color="#6B7280" />
                                            <Text style={styles.tournamentStatText}>{tournament.registeredTeams}</Text>
                                        </View>
                                        <View style={styles.tournamentStatItem}>
                                            <DollarSign size={14} color="#22C55E" />
                                            <Text style={styles.tournamentStatText}>R$ {tournament.totalRevenue}</Text>
                                        </View>
                                        <View style={styles.tournamentStatItem}>
                                            <Target size={14} color="#6B7280" />
                                            <Text style={styles.tournamentStatText}>{tournament.category}</Text>
                                        </View>
                                    </View>

                                    {/* Actions */}
                                    <View style={styles.tournamentActions}>
                                        {tournament.status === 'inscricoes_abertas' && (
                                            <>
                                                <Pressable style={styles.tournamentActionBtn}>
                                                    <Users size={16} color="#3B82F6" />
                                                    <Text style={styles.actionBtnText}>Inscritos</Text>
                                                </Pressable>
                                                <Pressable style={styles.tournamentActionBtn}>
                                                    <Share2 size={16} color="#6B7280" />
                                                    <Text style={styles.actionBtnText}>Divulgar</Text>
                                                </Pressable>
                                                <Pressable style={styles.tournamentActionBtn}>
                                                    <Shuffle size={16} color="#F59E0B" />
                                                    <Text style={styles.actionBtnText}>Sortear</Text>
                                                </Pressable>
                                            </>
                                        )}
                                        {tournament.status === 'em_andamento' && (
                                            <>
                                                <Pressable style={[styles.tournamentActionBtn, styles.actionBtnPrimary]}>
                                                    <Play size={16} color="#FFF" />
                                                    <Text style={styles.actionBtnTextPrimary}>Gerenciar</Text>
                                                </Pressable>
                                                <Pressable style={styles.tournamentActionBtn}>
                                                    <Target size={16} color="#6B7280" />
                                                    <Text style={styles.actionBtnText}>Bracket</Text>
                                                </Pressable>
                                            </>
                                        )}
                                        {tournament.status === 'finalizado' && (
                                            <>
                                                <Pressable style={styles.tournamentActionBtn}>
                                                    <Award size={16} color="#F59E0B" />
                                                    <Text style={styles.actionBtnText}>Resultados</Text>
                                                </Pressable>
                                                <Pressable style={styles.tournamentActionBtn}>
                                                    <Copy size={16} color="#6B7280" />
                                                    <Text style={styles.actionBtnText}>Duplicar</Text>
                                                </Pressable>
                                            </>
                                        )}
                                    </View>
                                </View>
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </View>

            {/* Formatos de Torneio */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Formatos Disponíveis</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.formatsRow}>
                        {[
                            { icon: Trophy, label: 'Eliminatória', desc: 'Mata-mata' },
                            { icon: Shuffle, label: 'Round Robin', desc: 'Todos x Todos' },
                            { icon: Target, label: 'Grupos + Mata', desc: 'Copa do Mundo' },
                            { icon: Users, label: 'Americano', desc: 'Rotação duplas' },
                        ].map((format, i) => (
                            <View key={i} style={styles.formatCard}>
                                <format.icon size={24} color="#22C55E" />
                                <Text style={styles.formatLabel}>{format.label}</Text>
                                <Text style={styles.formatDesc}>{format.desc}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* Dica PRO */}
            <View style={styles.section}>
                <View style={styles.proTipCard}>
                    <View style={styles.proTipHeader}>
                        <View style={styles.proBadge}>
                            <Text style={styles.proBadgeText}>PRO</Text>
                        </View>
                        <Text style={styles.proTipTitle}>Desbloqueie mais recursos</Text>
                    </View>
                    <Text style={styles.proTipText}>
                        Com o plano PRO você pode criar torneios ilimitados, até 64 duplas,
                        cobrar inscrições online e personalizar com sua marca.
                    </Text>
                    <Pressable style={styles.proTipButton}>
                        <Text style={styles.proTipButtonText}>Conhecer plano PRO</Text>
                        <ArrowRight size={16} color="#F59E0B" />
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

// ============================================
// TAB BAR
// ============================================
function HostTabBar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
    const tabs = [
        { id: 'hoje', label: 'Hoje', icon: Home },
        { id: 'torneios', label: 'Torneios', icon: Trophy },
        { id: 'gestao', label: 'Gestão', icon: LayoutGrid },
        { id: 'mensagens', label: 'Mensagens', icon: MessageSquare, badge: 3 },
        { id: 'menu', label: 'Menu', icon: Menu },
    ];

    return (
        <View style={styles.tabBar}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <Pressable
                        key={tab.id}
                        style={styles.tabItem}
                        onPress={() => onTabChange(tab.id)}
                    >
                        <View>
                            <tab.icon size={24} color={isActive ? '#22C55E' : '#9CA3AF'} />
                            {tab.badge && (
                                <View style={styles.tabBadge}>
                                    <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                            {tab.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

// ============================================
// ONBOARDING VIEW
// ============================================
function OnboardingView({ onStart }: { onStart: () => void }) {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.onboardingContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.heroBanner}>
                    <View style={styles.heroIconContainer}>
                        <Home size={48} color="#FFF" />
                    </View>
                    <Text style={styles.heroTitle}>Ganhe dinheiro com sua quadra</Text>
                    <Text style={styles.heroSubtitle}>
                        Cadastre sua quadra no Kourt e comece a receber reservas
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.section}>
                    <Text style={styles.sectionTitle}>Como funciona</Text>
                    <View style={styles.stepsCard}>
                        {HOW_IT_WORKS.map((item) => (
                            <View key={item.step} style={styles.stepItem}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>{item.step}</Text>
                                </View>
                                <View style={styles.stepContent}>
                                    <Text style={styles.stepTitle}>{item.title}</Text>
                                    <Text style={styles.stepDescription}>{item.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.section}>
                    <Text style={styles.sectionTitle}>Benefícios</Text>
                    <View style={styles.benefitsGrid}>
                        {BENEFITS.map((benefit, index) => (
                            <View key={index} style={styles.benefitCard}>
                                <View style={styles.benefitIcon}>
                                    <benefit.icon size={24} color="#22C55E" />
                                </View>
                                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                                <Text style={styles.benefitDescription}>{benefit.description}</Text>
                            </View>
                        ))}
                    </View>
                </Animated.View>
            </ScrollView>

            <View style={[styles.ctaContainer, { paddingBottom: insets.bottom + 80 }]}>
                <Pressable style={styles.ctaButton} onPress={onStart}>
                    <Text style={styles.ctaButtonText}>Começar agora</Text>
                    <ArrowRight size={20} color="#FFF" />
                </Pressable>
            </View>
        </View>
    );
}

// ============================================
// MAIN SCREEN
// ============================================
export default function MyListingsScreen() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState('hoje');
    const [hasListings] = useState(USER_HAS_LISTINGS);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { profile, loading: profileLoading } = useProfile();

    const handleStartOnboarding = () => {
        router.push('/court/new/private/type');
    };

    const renderTabContent = () => {
        if (!hasListings) {
            return <OnboardingView onStart={handleStartOnboarding} />;
        }

        switch (activeTab) {
            case 'hoje':
                return <HojeTab />;
            case 'torneios':
                return <TorneiosTab />;
            case 'gestao':
                return <GestaoTab />;
            case 'mensagens':
                return <MensagensTab />;
            case 'menu':
                return <MenuTab profile={profile} />;
            default:
                return <HojeTab />;
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color="#000" />
                    </Pressable>
                    <View style={styles.modeIndicator}>
                        <LayoutGrid size={16} color="#22C55E" />
                        <Text style={styles.modeText}>Modo Anfitrião</Text>
                    </View>
                </View>
                <Pressable style={styles.switchModeButton} onPress={() => router.back()}>
                    <User size={16} color="#3B82F6" />
                    <Text style={styles.switchModeText}>Modo Jogador</Text>
                </Pressable>
            </View>

            {/* Content */}
            {renderTabContent()}

            {/* Tab Bar */}
            {hasListings && (
                <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
                    <HostTabBar activeTab={activeTab} onTabChange={setActiveTab} />
                </View>
            )}
        </View>
    );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backButton: {
        padding: 4,
    },
    modeIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    modeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    switchModeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    switchModeText: {
        color: '#1F2937',
        fontSize: 12,
        fontWeight: '600',
    },
    // Stats
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 12,
    },
    statCard: {
        width: '47%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
    },
    statSubValue: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    // Section
    section: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    sectionTitleNoMargin: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    badge: {
        backgroundColor: '#22C55E',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    addButton: {
        padding: 8,
        backgroundColor: '#F0FDF4',
        borderRadius: 20,
    },
    // Booking Card
    bookingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 12,
    },
    bookingTime: {
        alignItems: 'center',
        marginRight: 12,
        paddingRight: 12,
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
    },
    bookingTimeText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    bookingDuration: {
        fontSize: 11,
        color: '#6B7280',
    },
    bookingAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    bookingInfo: {
        flex: 1,
    },
    bookingName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    bookingCourt: {
        fontSize: 12,
        color: '#6B7280',
    },
    bookingPrice: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    bookingPriceText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#22C55E',
    },
    bookingStatus: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    bookingStatusPending: {
        backgroundColor: '#FEF3C7',
    },
    bookingStatusText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#22C55E',
    },
    bookingStatusTextPending: {
        color: '#D97706',
    },
    // Listing Card
    listingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 12,
    },
    listingImage: {
        width: 64,
        height: 64,
        borderRadius: 12,
        marginRight: 12,
    },
    listingContent: {
        flex: 1,
    },
    listingName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    listingStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    listingStatText: {
        fontSize: 12,
        color: '#6B7280',
    },
    listingStatDivider: {
        color: '#D1D5DB',
    },
    listingStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#22C55E',
    },
    statusText: {
        fontSize: 11,
        color: '#22C55E',
        fontWeight: '600',
    },
    // Calendar
    calendarContainer: {
        padding: 20,
        backgroundColor: '#FFF',
    },
    calendarMonth: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
        textTransform: 'capitalize',
    },
    weekDaysRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    weekDayText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayCellSelected: {
        backgroundColor: '#22C55E',
        borderRadius: 20,
    },
    dayCellToday: {
        backgroundColor: '#F0FDF4',
        borderRadius: 20,
    },
    dayText: {
        fontSize: 14,
        color: '#000',
    },
    dayTextSelected: {
        color: '#FFF',
        fontWeight: '700',
    },
    dayTextToday: {
        color: '#22C55E',
        fontWeight: '700',
    },
    bookingDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#22C55E',
        marginTop: 2,
    },
    bookingDotSelected: {
        backgroundColor: '#FFF',
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
    },
    emptyStateText: {
        marginTop: 12,
        fontSize: 14,
        color: '#9CA3AF',
    },
    // Action Card
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 12,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F0FDF4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    actionDescription: {
        fontSize: 12,
        color: '#6B7280',
    },
    // Gestão
    gestaoHeader: {
        padding: 20,
        paddingBottom: 0,
    },
    addCourtButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#22C55E',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    addCourtButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    courtCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 12,
        overflow: 'hidden',
    },
    courtCardSelected: {
        borderColor: '#22C55E',
    },
    courtImage: {
        width: '100%',
        height: 160,
    },
    courtContent: {
        padding: 16,
    },
    courtHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    courtName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        flex: 1,
    },
    courtStatusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusActive: {
        backgroundColor: '#DCFCE7',
    },
    statusInactive: {
        backgroundColor: '#FEE2E2',
    },
    courtStatusText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#22C55E',
    },
    courtMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 12,
    },
    courtMetaText: {
        fontSize: 13,
        color: '#6B7280',
    },
    courtStats: {
        flexDirection: 'row',
        gap: 20,
    },
    courtStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    courtStatValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    courtStatLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    courtActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F9FAFB',
        padding: 12,
        marginTop: -12,
        marginBottom: 12,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#E5E7EB',
    },
    courtActionButton: {
        alignItems: 'center',
        gap: 4,
    },
    courtActionText: {
        fontSize: 11,
        color: '#6B7280',
    },
    // Settings
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 12,
    },
    settingIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    settingDescription: {
        fontSize: 12,
        color: '#6B7280',
    },
    // Conversations
    unreadBadge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    unreadBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    conversationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 12,
    },
    conversationAvatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    conversationAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    conversationUnreadDot: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#22C55E',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    conversationContent: {
        flex: 1,
    },
    conversationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    conversationName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
    },
    conversationNameUnread: {
        fontWeight: '700',
    },
    conversationTime: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    conversationMessage: {
        fontSize: 13,
        color: '#6B7280',
    },
    conversationMessageUnread: {
        color: '#000',
    },
    conversationUnreadBadge: {
        backgroundColor: '#22C55E',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        marginLeft: 8,
    },
    conversationUnreadText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
    },
    quickRepliesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    quickReplyChip: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
    },
    quickReplyText: {
        fontSize: 13,
        color: '#374151',
    },
    manageRepliesButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    manageRepliesText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#22C55E',
    },
    // Menu/Profile
    profileSection: {
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    profileAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    profileRole: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    profileStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileStatItem: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    profileStatValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    profileStatLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    profileStatDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#E5E7EB',
    },
    menuSection: {
        padding: 20,
        paddingBottom: 0,
    },
    menuSectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 14,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuItemText: {
        flex: 1,
        fontSize: 15,
        color: '#000',
    },
    menuItemValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    menuItemValueText: {
        fontSize: 14,
        color: '#6B7280',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        margin: 20,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FEE2E2',
        backgroundColor: '#FEF2F2',
    },
    logoutText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#EF4444',
    },
    // Onboarding
    onboardingContainer: {
        flex: 1,
    },
    heroBanner: {
        backgroundColor: '#22C55E',
        padding: 32,
        alignItems: 'center',
    },
    heroIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
    },
    stepsCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 20,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
    },
    stepNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#DCFCE7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumberText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#22C55E',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    stepDescription: {
        fontSize: 14,
        color: '#6B7280',
    },
    benefitsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    benefitCard: {
        width: '48%',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    benefitIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#DCFCE7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    benefitTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    benefitDescription: {
        fontSize: 12,
        color: '#6B7280',
    },
    ctaContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    ctaButton: {
        backgroundColor: '#000',
        height: 56,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    ctaButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    // Tab Bar
    tabBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    tabBar: {
        flexDirection: 'row',
        paddingTop: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    tabLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 4,
        fontWeight: '500',
    },
    tabLabelActive: {
        color: '#22C55E',
        fontWeight: '600',
    },
    tabBadge: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: '#EF4444',
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    // Torneios
    tournamentHeader: {
        padding: 20,
        paddingBottom: 0,
    },
    createTournamentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8B5CF6',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    createTournamentButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
    },
    filterChipActive: {
        backgroundColor: '#8B5CF6',
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    filterChipTextActive: {
        color: '#FFF',
    },
    tournamentCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 16,
        overflow: 'hidden',
    },
    tournamentBanner: {
        width: '100%',
        height: 140,
    },
    tournamentStatusBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    tournamentStatusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    tournamentContent: {
        padding: 16,
    },
    tournamentMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    tournamentSportBadge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tournamentSportText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#3B82F6',
    },
    tournamentFormat: {
        fontSize: 12,
        color: '#6B7280',
    },
    tournamentName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    tournamentInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 12,
    },
    tournamentInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    tournamentInfoText: {
        fontSize: 13,
        color: '#6B7280',
    },
    tournamentProgress: {
        marginBottom: 12,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        marginBottom: 6,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#22C55E',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        color: '#6B7280',
    },
    tournamentLive: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },
    liveText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#EF4444',
    },
    tournamentWinner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 12,
        alignSelf: 'flex-start',
    },
    winnerText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#D97706',
    },
    tournamentStats: {
        flexDirection: 'row',
        gap: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginBottom: 12,
    },
    tournamentStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    tournamentStatText: {
        fontSize: 13,
        color: '#6B7280',
    },
    tournamentActions: {
        flexDirection: 'row',
        gap: 8,
    },
    tournamentActionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingVertical: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    actionBtnPrimary: {
        backgroundColor: '#22C55E',
    },
    actionBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    actionBtnTextPrimary: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFF',
    },
    formatsRow: {
        flexDirection: 'row',
        gap: 12,
        paddingRight: 20,
    },
    formatCard: {
        width: 120,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    formatLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#000',
        marginTop: 8,
    },
    formatDesc: {
        fontSize: 11,
        color: '#6B7280',
        marginTop: 2,
    },
    proTipCard: {
        backgroundColor: '#1F2937',
        borderRadius: 16,
        padding: 20,
    },
    proTipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    proBadge: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    proBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#000',
    },
    proTipTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
    proTipText: {
        fontSize: 14,
        color: '#9CA3AF',
        lineHeight: 20,
        marginBottom: 16,
    },
    proTipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    proTipButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F59E0B',
    },
});
