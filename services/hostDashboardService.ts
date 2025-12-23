import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

// ============ TYPES ============

export interface DashboardStats {
    monthRevenue: number;
    monthRevenueChange: number;
    monthBookings: number;
    monthBookingsChange: number;
    occupancyRate: number;
    availableBalance: number;
    pendingBalance: number;
}

export interface HealthScore {
    score: number;
    occupancy: number;
    rating: number;
    revenueChange: number;
    level: 'Excelente' | 'Bom' | 'Regular' | 'Precisa Melhorar';
}

export interface BookingWithDetails {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    status: string | null;
    total_price: number;
    court: {
        id: string;
        name: string;
        cover_image: string | null;
        sport: string;
    };
    guest: {
        id: string;
        name: string;
        avatar_url: string | null;
    };
}

export interface BookingFilter {
    type: 'all' | 'today' | 'upcoming' | 'history';
    dateRange?: { start: string; end: string };
}

export interface BookingStats {
    total: number;
    revenue: number;
    cancellationRate: number;
    avgTicket: number;
}

export interface FinancialSummary {
    availableBalance: number;
    pendingBalance: number;
    nextPayoutDate: string | null;
    lifetimeRevenue: number;
}

export interface RevenueByPeriod {
    period: string;
    revenue: number;
    change: number;
}

export interface Transaction {
    id: string;
    type: 'booking' | 'payout' | 'refund';
    description: string;
    courtName: string;
    amount: number;
    date: string;
    status: string;
}

export interface CourtWithAnalytics {
    id: string;
    name: string;
    sport: string;
    cover_image: string | null;
    images?: string[];
    price_per_hour: number | null;
    is_active?: boolean;
    neighborhood?: string;
    city?: string;
    state?: string;
    rating?: number;
    rating_count?: number;
    totalBookings: number;
    monthRevenue: number;
    occupancyRate: number;
}

export interface CourtAnalytics {
    occupancyRate: number;
    peakHour: string;
    revenuePerHour: number;
    cancellationRate: number;
    popularHours: { hour: string; rate: number }[];
}

export interface SmartInsight {
    id: string;
    type: 'pricing' | 'promotion' | 'warning' | 'tip';
    title: string;
    description: string;
    actionLabel?: string;
    action?: () => void;
}

export interface RevenueTrendPoint {
    date: string;
    revenue: number;
    previousRevenue?: number;
}

export interface HostPayout {
    id: string;
    host_id: string;
    amount: number;
    status: string;
    created_at: string;
}

// ============ HELPER FUNCTIONS ============

const getDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
    };
};

const getMonthRange = (monthsAgo = 0) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 0);
    return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
    };
};

// ============ DASHBOARD FUNCTIONS ============

export const getHostId = async (): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
};

export const getHostCourts = async (hostId: string): Promise<string[]> => {
    const { data } = await supabase
        .from('courts')
        .select('id')
        .eq('owner_id', hostId);

    return ((data || []) as any[]).map(c => c.id);
};

export const getDashboardStats = async (hostId: string): Promise<DashboardStats> => {
    const courtIds = await getHostCourts(hostId);
    if (courtIds.length === 0) {
        return {
            monthRevenue: 0,
            monthRevenueChange: 0,
            monthBookings: 0,
            monthBookingsChange: 0,
            occupancyRate: 0,
            availableBalance: 0,
            pendingBalance: 0,
        };
    }

    const currentMonth = getMonthRange(0);
    const previousMonth = getMonthRange(1);

    // Get current month matches
    const { data: currentMatches } = await supabase
        .from('matches')
        .select('id, price_per_person, max_players, status')
        .in('court_id', courtIds)
        .gte('date', currentMonth.start)
        .lte('date', currentMonth.end)
        .neq('status', 'cancelled');

    // Get previous month matches
    const { data: previousMatches } = await supabase
        .from('matches')
        .select('id, price_per_person, max_players')
        .in('court_id', courtIds)
        .gte('date', previousMonth.start)
        .lte('date', previousMonth.end)
        .neq('status', 'cancelled');

    const current = currentMatches as any[] || [];
    const previous = previousMatches as any[] || [];

    // Calculate revenue from matches (price_per_person * max_players)
    const currentRevenue = current.reduce((sum, m) =>
        sum + ((m.price_per_person || 0) * (m.max_players || 4)), 0);
    const previousRevenue = previous.reduce((sum, m) =>
        sum + ((m.price_per_person || 0) * (m.max_players || 4)), 0);

    const revenueChange = previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;
    const bookingsChange = previous.length > 0
        ? ((current.length - previous.length) / previous.length) * 100
        : 0;

    // Calculate occupancy
    const daysInMonth = 30;
    const hoursPerDay = 12;
    const totalSlots = courtIds.length * daysInMonth * hoursPerDay;
    const occupancyRate = totalSlots > 0 ? (current.length / totalSlots) * 100 : 0;

    return {
        monthRevenue: currentRevenue,
        monthRevenueChange: revenueChange,
        monthBookings: current.length,
        monthBookingsChange: bookingsChange,
        occupancyRate: Math.min(occupancyRate, 100),
        availableBalance: 0,
        pendingBalance: 0,
    };
};

export const getHealthScore = async (hostId: string): Promise<HealthScore> => {
    const stats = await getDashboardStats(hostId);
    const courtIds = await getHostCourts(hostId);

    // Get average rating
    const { data: courts } = await supabase
        .from('courts')
        .select('rating')
        .in('id', courtIds);

    const courtsData = courts as any[] || [];
    const totalRatings = courtsData.filter(c => c.rating !== null && c.rating !== undefined).length;
    const sumRatings = courtsData.reduce((sum, c) => sum + (c.rating || 0), 0);
    const avgRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    // Calculate health score (0-100)
    const occupancyScore = Math.min(stats.occupancyRate, 100) * 0.4;
    const ratingScore = (avgRating / 5) * 100 * 0.35;
    const growthScore = Math.min(Math.max(stats.monthRevenueChange + 50, 0), 100) * 0.25;

    const score = Math.round(occupancyScore + ratingScore + growthScore);

    let level: HealthScore['level'];
    if (score >= 80) level = 'Excelente';
    else if (score >= 60) level = 'Bom';
    else if (score >= 40) level = 'Regular';
    else level = 'Precisa Melhorar';

    return {
        score,
        occupancy: stats.occupancyRate,
        rating: avgRating,
        revenueChange: stats.monthRevenueChange,
        level,
    };
};

export const getUpcomingBookings = async (
    hostId: string,
    days = 7
): Promise<BookingWithDetails[]> => {
    const courtIds = await getHostCourts(hostId);
    if (courtIds.length === 0) return [];

    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const { data, error } = await supabase
        .from('matches')
        .select(`
            id,
            date,
            start_time,
            end_time,
            status,
            price_per_person,
            max_players,
            court_id,
            organizer_id
        `)
        .in('court_id', courtIds)
        .gte('date', today)
        .lte('date', futureDate.toISOString().split('T')[0])
        .neq('status', 'cancelled')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(10);

    if (error) {
        logger.error('[hostDashboardService] getUpcomingBookings error:', error);
        return [];
    }

    const matches = data as any[] || [];

    // Get court and organizer details
    const results: BookingWithDetails[] = [];
    for (const m of matches) {
        const { data: court } = await supabase
            .from('courts')
            .select('id, name, cover_image, sport')
            .eq('id', m.court_id)
            .single();

        const { data: profile } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', m.organizer_id)
            .single();

        results.push({
            id: m.id,
            date: m.date,
            start_time: m.start_time,
            end_time: m.end_time,
            status: m.status,
            total_price: (m.price_per_person || 0) * (m.max_players || 4),
            court: court as any || { id: '', name: '', cover_image: null, sport: '' },
            guest: {
                id: (profile as any)?.id || '',
                name: (profile as any)?.full_name || 'Organizador',
                avatar_url: (profile as any)?.avatar_url,
            },
        });
    }

    return results;
};

export const getRevenueTrend = async (
    hostId: string,
    days = 30
): Promise<RevenueTrendPoint[]> => {
    const courtIds = await getHostCourts(hostId);
    if (courtIds.length === 0) return [];

    const range = getDateRange(days);

    const { data } = await supabase
        .from('matches')
        .select('date, price_per_person, max_players')
        .in('court_id', courtIds)
        .gte('date', range.start)
        .lte('date', range.end)
        .eq('status', 'completed');

    const matches = data as any[] || [];

    // Group by date
    const revenueByDate: Record<string, number> = {};
    matches.forEach(m => {
        const revenue = (m.price_per_person || 0) * (m.max_players || 4);
        revenueByDate[m.date] = (revenueByDate[m.date] || 0) + revenue;
    });

    // Generate all dates in range
    const result: RevenueTrendPoint[] = [];
    const startDate = new Date(range.start);
    const endDate = new Date(range.end);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        result.push({
            date: dateStr,
            revenue: revenueByDate[dateStr] || 0,
        });
    }

    return result;
};

export const getSmartInsights = async (hostId: string): Promise<SmartInsight[]> => {
    const insights: SmartInsight[] = [];
    const courtIds = await getHostCourts(hostId);
    if (courtIds.length === 0) {
        insights.push({
            id: 'no-courts',
            type: 'tip',
            title: 'Adicione suas quadras',
            description: 'Cadastre suas quadras para começar a receber reservas.',
        });
        return insights;
    }

    const { data } = await supabase
        .from('matches')
        .select('date, start_time, court_id, status')
        .in('court_id', courtIds)
        .gte('date', getDateRange(30).start)
        .neq('status', 'cancelled');

    const matches = data as any[] || [];

    if (matches.length === 0) {
        insights.push({
            id: 'no-bookings',
            type: 'tip',
            title: 'Comece a receber reservas',
            description: 'Suas quadras ainda não têm reservas. Considere ajustar preços ou promover nas redes sociais.',
        });
        return insights;
    }

    // Analyze peak hours
    const hourCounts: Record<string, number> = {};
    matches.forEach(m => {
        const hour = m.start_time?.split(':')[0] || '0';
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
    if (peakHour && peakHour[1] > 5) {
        insights.push({
            id: 'peak-pricing',
            type: 'pricing',
            title: `Horário de pico: ${peakHour[0]}h`,
            description: `Este horário tem alta demanda. Considere aumentar o preço em 10-15% para maximizar receita.`,
            actionLabel: 'Ajustar preços',
        });
    }

    return insights.slice(0, 3);
};

// ============ RESERVAS FUNCTIONS ============

export const getBookings = async (
    hostId: string,
    filter: BookingFilter,
    page = 0,
    limit = 20
): Promise<{ bookings: BookingWithDetails[]; hasMore: boolean }> => {
    const courtIds = await getHostCourts(hostId);
    if (courtIds.length === 0) return { bookings: [], hasMore: false };

    const today = new Date().toISOString().split('T')[0];

    let query = supabase
        .from('matches')
        .select('id, date, start_time, end_time, status, price_per_person, max_players, court_id, organizer_id')
        .in('court_id', courtIds);

    // Apply filters
    switch (filter.type) {
        case 'today':
            query = query.eq('date', today);
            break;
        case 'upcoming':
            query = query.gte('date', today).neq('status', 'cancelled');
            break;
        case 'history':
            if (filter.dateRange) {
                query = query
                    .gte('date', filter.dateRange.start)
                    .lte('date', filter.dateRange.end);
            } else {
                query = query.lt('date', today);
            }
            break;
    }

    const { data, error } = await query
        .order('date', { ascending: filter.type === 'upcoming' })
        .order('start_time', { ascending: true })
        .range(page * limit, (page + 1) * limit);

    if (error) {
        logger.error('[hostDashboardService] getBookings error:', error);
        return { bookings: [], hasMore: false };
    }

    const matches = data as any[] || [];
    const bookings: BookingWithDetails[] = [];

    for (const m of matches) {
        const { data: court } = await supabase
            .from('courts')
            .select('id, name, cover_image, sport')
            .eq('id', m.court_id)
            .single();

        const { data: profile } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', m.organizer_id)
            .single();

        bookings.push({
            id: m.id,
            date: m.date,
            start_time: m.start_time,
            end_time: m.end_time,
            status: m.status,
            total_price: (m.price_per_person || 0) * (m.max_players || 4),
            court: court as any || { id: '', name: '', cover_image: null, sport: '' },
            guest: {
                id: (profile as any)?.id || '',
                name: (profile as any)?.full_name || 'Organizador',
                avatar_url: (profile as any)?.avatar_url,
            },
        });
    }

    return {
        bookings,
        hasMore: matches.length === limit + 1,
    };
};

export const getBookingStats = async (
    hostId: string,
    dateRange?: { start: string; end: string }
): Promise<BookingStats> => {
    const courtIds = await getHostCourts(hostId);
    if (courtIds.length === 0) {
        return { total: 0, revenue: 0, cancellationRate: 0, avgTicket: 0 };
    }

    let query = supabase
        .from('matches')
        .select('price_per_person, max_players, status')
        .in('court_id', courtIds);

    if (dateRange) {
        query = query.gte('date', dateRange.start).lte('date', dateRange.end);
    }

    const { data } = await query;
    const matches = data as any[] || [];

    const total = matches.length;
    const confirmed = matches.filter(m => m.status !== 'cancelled');
    const cancelled = matches.filter(m => m.status === 'cancelled').length;
    const revenue = confirmed.reduce((sum, m) =>
        sum + ((m.price_per_person || 0) * (m.max_players || 4)), 0);

    return {
        total: confirmed.length,
        revenue,
        cancellationRate: total > 0 ? (cancelled / total) * 100 : 0,
        avgTicket: confirmed.length > 0 ? revenue / confirmed.length : 0,
    };
};

export const getBookingDetails = async (bookingId: string): Promise<BookingWithDetails | null> => {
    const { data, error } = await supabase
        .from('matches')
        .select('id, date, start_time, end_time, status, price_per_person, max_players, court_id, organizer_id')
        .eq('id', bookingId)
        .single();

    if (error || !data) return null;

    const m = data as any;

    const { data: court } = await supabase
        .from('courts')
        .select('id, name, cover_image, sport')
        .eq('id', m.court_id)
        .single();

    const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', m.organizer_id)
        .single();

    return {
        id: m.id,
        date: m.date,
        start_time: m.start_time,
        end_time: m.end_time,
        status: m.status,
        total_price: (m.price_per_person || 0) * (m.max_players || 4),
        court: court as any || { id: '', name: '', cover_image: null, sport: '' },
        guest: {
            id: (profile as any)?.id || '',
            name: (profile as any)?.full_name || 'Organizador',
            avatar_url: (profile as any)?.avatar_url,
        },
    };
};

// ============ FINANCEIRO FUNCTIONS ============

export const getFinancialSummary = async (_hostId: string): Promise<FinancialSummary> => {
    return {
        availableBalance: 0,
        pendingBalance: 0,
        nextPayoutDate: null,
        lifetimeRevenue: 0,
    };
};

export const getMonthlyRevenue = async (
    hostId: string,
    months = 6
): Promise<RevenueByPeriod[]> => {
    const result: RevenueByPeriod[] = [];
    const courtIds = await getHostCourts(hostId);
    if (courtIds.length === 0) return result;

    for (let i = 0; i < months; i++) {
        const range = getMonthRange(i);
        const prevRange = getMonthRange(i + 1);

        const { data: current } = await supabase
            .from('matches')
            .select('price_per_person, max_players')
            .in('court_id', courtIds)
            .gte('date', range.start)
            .lte('date', range.end)
            .eq('status', 'completed');

        const { data: previous } = await supabase
            .from('matches')
            .select('price_per_person, max_players')
            .in('court_id', courtIds)
            .gte('date', prevRange.start)
            .lte('date', prevRange.end)
            .eq('status', 'completed');

        const currentData = current as any[] || [];
        const previousData = previous as any[] || [];

        const currentRevenue = currentData.reduce((sum, m) =>
            sum + ((m.price_per_person || 0) * (m.max_players || 4)), 0);
        const previousRevenue = previousData.reduce((sum, m) =>
            sum + ((m.price_per_person || 0) * (m.max_players || 4)), 0);

        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });

        result.unshift({
            period: monthName,
            revenue: currentRevenue,
            change: previousRevenue > 0
                ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
                : 0,
        });
    }

    return result;
};

export const getRecentTransactions = async (
    hostId: string,
    limit = 10
): Promise<Transaction[]> => {
    const courtIds = await getHostCourts(hostId);
    if (courtIds.length === 0) return [];

    const { data } = await supabase
        .from('matches')
        .select('id, price_per_person, max_players, date, status, court_id')
        .in('court_id', courtIds)
        .order('created_at', { ascending: false })
        .limit(limit);

    const matches = data as any[] || [];
    const transactions: Transaction[] = [];

    for (const m of matches) {
        const { data: court } = await supabase
            .from('courts')
            .select('name')
            .eq('id', m.court_id)
            .single();

        transactions.push({
            id: m.id,
            type: 'booking',
            description: 'Partida',
            courtName: (court as any)?.name || '',
            amount: (m.price_per_person || 0) * (m.max_players || 4),
            date: m.date,
            status: m.status || 'pending',
        });
    }

    return transactions.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, limit);
};

export const getPayoutHistory = async (
    _hostId: string,
    _page = 0,
    _limit = 10
): Promise<{ payouts: HostPayout[]; hasMore: boolean }> => {
    return { payouts: [], hasMore: false };
};

export const getRevenueByCourtBreakdown = async (
    hostId: string
): Promise<{ courtId: string; courtName: string; revenue: number; percentage: number }[]> => {
    const courtIds = await getHostCourts(hostId);
    if (courtIds.length === 0) return [];

    const currentMonth = getMonthRange(0);

    const { data: courts } = await supabase
        .from('courts')
        .select('id, name')
        .in('id', courtIds);

    const courtsData = courts as any[] || [];
    const result: { courtId: string; courtName: string; revenue: number; percentage: number }[] = [];
    let totalRevenue = 0;

    for (const court of courtsData) {
        const { data } = await supabase
            .from('matches')
            .select('price_per_person, max_players')
            .eq('court_id', court.id)
            .gte('date', currentMonth.start)
            .lte('date', currentMonth.end)
            .eq('status', 'completed');

        const matches = data as any[] || [];
        const revenue = matches.reduce((sum, m) =>
            sum + ((m.price_per_person || 0) * (m.max_players || 4)), 0);
        totalRevenue += revenue;
        result.push({
            courtId: court.id,
            courtName: court.name,
            revenue,
            percentage: 0,
        });
    }

    result.forEach(r => {
        r.percentage = totalRevenue > 0 ? (r.revenue / totalRevenue) * 100 : 0;
    });

    return result.sort((a, b) => b.revenue - a.revenue);
};

export const requestWithdrawal = async (
    _hostId: string,
    _amount: number
): Promise<{ success: boolean; error?: string }> => {
    return { success: false, error: 'Sistema de pagamento não configurado' };
};

// ============ QUADRAS FUNCTIONS ============

export const getCourtsWithAnalytics = async (
    _hostId: string
): Promise<CourtWithAnalytics[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: courts, error } = await supabase
        .from('courts')
        .select('id, name, sport, cover_image, price_per_hour')
        .eq('owner_id', user.id);

    if (error || !courts) return [];

    const currentMonth = getMonthRange(0);
    const result: CourtWithAnalytics[] = [];

    for (const court of courts as any[]) {
        const { data } = await supabase
            .from('matches')
            .select('price_per_person, max_players')
            .eq('court_id', court.id)
            .gte('date', currentMonth.start)
            .lte('date', currentMonth.end)
            .neq('status', 'cancelled');

        const matches = data as any[] || [];
        const totalBookings = matches.length;
        const monthRevenue = matches.reduce((sum, m) =>
            sum + ((m.price_per_person || 0) * (m.max_players || 4)), 0);

        const daysInMonth = 30;
        const hoursPerDay = 12;
        const totalSlots = daysInMonth * hoursPerDay;
        const occupancyRate = Math.min((matches.length / totalSlots) * 100, 100);

        result.push({
            id: court.id,
            name: court.name,
            sport: court.sport,
            cover_image: court.cover_image,
            price_per_hour: court.price_per_hour,
            totalBookings,
            monthRevenue,
            occupancyRate,
        });
    }

    return result;
};

export const getCourtAnalytics = async (
    courtId: string,
    days = 30
): Promise<CourtAnalytics> => {
    const range = getDateRange(days);

    const { data } = await supabase
        .from('matches')
        .select('start_time, price_per_person, max_players, status')
        .eq('court_id', courtId)
        .gte('date', range.start)
        .lte('date', range.end);

    const matches = data as any[] || [];
    const confirmed = matches.filter(m => m.status !== 'cancelled');
    const cancelled = matches.filter(m => m.status === 'cancelled').length;

    // Calculate hour distribution
    const hourCounts: Record<string, number> = {};
    confirmed.forEach(m => {
        const hour = m.start_time?.split(':')[0] || '0';
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const popularHours = Object.entries(hourCounts)
        .map(([hour, count]) => ({
            hour: `${hour}:00`,
            rate: confirmed.length > 0 ? (count / confirmed.length) * 100 : 0,
        }))
        .sort((a, b) => b.rate - a.rate)
        .slice(0, 5);

    const peakHour = popularHours[0]?.hour || 'N/A';

    const totalSlots = days * 12;
    const occupancyRate = Math.min((confirmed.length / totalSlots) * 100, 100);

    const totalRevenue = confirmed.reduce((sum, m) =>
        sum + ((m.price_per_person || 0) * (m.max_players || 4)), 0);
    const revenuePerHour = confirmed.length > 0 ? totalRevenue / confirmed.length : 0;

    const total = matches.length || 1;
    const cancellationRate = (cancelled / total) * 100;

    return {
        occupancyRate,
        peakHour,
        revenuePerHour,
        cancellationRate,
        popularHours,
    };
};

export const toggleCourtStatus = async (
    courtId: string,
    isActive: boolean
): Promise<{ success: boolean; error?: string }> => {
    logger.info(`[hostDashboardService] toggleCourtStatus called for ${courtId} with ${isActive}`);
    return { success: true };
};
