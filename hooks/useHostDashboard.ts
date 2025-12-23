import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import * as hostService from '../services/hostDashboardService';
import { logger } from '../utils/logger';

export type TabType = 'dashboard' | 'reservas' | 'financeiro' | 'quadras' | 'mais';
export type BookingFilterType = 'all' | 'today' | 'upcoming' | 'history';

export function useHostDashboard() {
    const { user } = useAuthStore();
    const hostId = user?.id || '';

    // State
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Dashboard data
    const [dashboardStats, setDashboardStats] = useState<hostService.DashboardStats | null>(null);
    const [healthScore, setHealthScore] = useState<hostService.HealthScore | null>(null);
    const [upcomingBookings, setUpcomingBookings] = useState<hostService.BookingWithDetails[]>([]);
    const [revenueTrend, setRevenueTrend] = useState<hostService.RevenueTrendPoint[]>([]);
    const [smartInsights, setSmartInsights] = useState<hostService.SmartInsight[]>([]);

    // Reservas data
    const [bookingFilter, setBookingFilter] = useState<BookingFilterType>('upcoming');
    const [bookings, setBookings] = useState<hostService.BookingWithDetails[]>([]);
    const [bookingStats, setBookingStats] = useState<hostService.BookingStats | null>(null);
    const [bookingsPage, setBookingsPage] = useState(0);
    const [hasMoreBookings, setHasMoreBookings] = useState(false);
    const [dateRange, setDateRange] = useState<{ start: string; end: string } | undefined>();

    // Financeiro data
    const [financialSummary, setFinancialSummary] = useState<hostService.FinancialSummary | null>(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState<hostService.RevenueByPeriod[]>([]);
    const [transactions, setTransactions] = useState<hostService.Transaction[]>([]);
    const [payouts, setPayouts] = useState<hostService.HostPayout[]>([]);
    const [revenueBreakdown, setRevenueBreakdown] = useState<{ courtId: string; courtName: string; revenue: number; percentage: number }[]>([]);

    // Quadras data
    const [courts, setCourts] = useState<hostService.CourtWithAnalytics[]>([]);
    const [selectedCourtAnalytics, setSelectedCourtAnalytics] = useState<hostService.CourtAnalytics | null>(null);
    const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);

    // ============ DASHBOARD FUNCTIONS ============

    const loadDashboard = useCallback(async () => {
        if (!hostId) return;

        try {
            const [stats, score, upcoming, trend, insights] = await Promise.all([
                hostService.getDashboardStats(hostId),
                hostService.getHealthScore(hostId),
                hostService.getUpcomingBookings(hostId, 7),
                hostService.getRevenueTrend(hostId, 30),
                hostService.getSmartInsights(hostId),
            ]);

            setDashboardStats(stats);
            setHealthScore(score);
            setUpcomingBookings(upcoming);
            setRevenueTrend(trend);
            setSmartInsights(insights);
        } catch (error) {
            logger.error('[useHostDashboard] loadDashboard error:', error);
        }
    }, [hostId]);

    // ============ RESERVAS FUNCTIONS ============

    const loadBookings = useCallback(async (reset = false) => {
        if (!hostId) return;

        const page = reset ? 0 : bookingsPage;
        if (reset) setBookingsPage(0);

        try {
            const filter: hostService.BookingFilter = {
                type: bookingFilter,
                dateRange: bookingFilter === 'history' ? dateRange : undefined,
            };

            const [result, stats] = await Promise.all([
                hostService.getBookings(hostId, filter, page),
                hostService.getBookingStats(hostId, dateRange),
            ]);

            if (reset) {
                setBookings(result.bookings);
            } else {
                setBookings(prev => [...prev, ...result.bookings]);
            }
            setHasMoreBookings(result.hasMore);
            setBookingStats(stats);
        } catch (error) {
            logger.error('[useHostDashboard] loadBookings error:', error);
        }
    }, [hostId, bookingFilter, bookingsPage, dateRange]);

    const loadMoreBookings = useCallback(() => {
        if (hasMoreBookings) {
            setBookingsPage(prev => prev + 1);
        }
    }, [hasMoreBookings]);

    // ============ FINANCEIRO FUNCTIONS ============

    const loadFinanceiro = useCallback(async () => {
        if (!hostId) return;

        try {
            const [summary, monthly, trans, breakdown] = await Promise.all([
                hostService.getFinancialSummary(hostId),
                hostService.getMonthlyRevenue(hostId, 6),
                hostService.getRecentTransactions(hostId, 15),
                hostService.getRevenueByCourtBreakdown(hostId),
            ]);

            setFinancialSummary(summary);
            setMonthlyRevenue(monthly);
            setTransactions(trans);
            setRevenueBreakdown(breakdown);
        } catch (error) {
            logger.error('[useHostDashboard] loadFinanceiro error:', error);
        }
    }, [hostId]);

    const loadPayoutHistory = useCallback(async () => {
        if (!hostId) return;

        try {
            const result = await hostService.getPayoutHistory(hostId);
            setPayouts(result.payouts);
        } catch (error) {
            logger.error('[useHostDashboard] loadPayoutHistory error:', error);
        }
    }, [hostId]);

    const requestWithdrawal = useCallback(async (amount: number) => {
        if (!hostId) return { success: false, error: 'Não autenticado' };

        const result = await hostService.requestWithdrawal(hostId, amount);
        if (result.success) {
            await loadFinanceiro();
        }
        return result;
    }, [hostId, loadFinanceiro]);

    // ============ QUADRAS FUNCTIONS ============

    const loadCourts = useCallback(async () => {
        if (!hostId) return;

        try {
            const courtsData = await hostService.getCourtsWithAnalytics(hostId);
            setCourts(courtsData);
        } catch (error) {
            logger.error('[useHostDashboard] loadCourts error:', error);
        }
    }, [hostId]);

    const loadCourtAnalytics = useCallback(async (courtId: string) => {
        try {
            setSelectedCourtId(courtId);
            const analytics = await hostService.getCourtAnalytics(courtId);
            setSelectedCourtAnalytics(analytics);
        } catch (error) {
            logger.error('[useHostDashboard] loadCourtAnalytics error:', error);
        }
    }, []);

    const toggleCourtStatus = useCallback(async (courtId: string, isActive: boolean) => {
        const result = await hostService.toggleCourtStatus(courtId, isActive);
        if (result.success) {
            await loadCourts();
        }
        return result;
    }, [loadCourts]);

    // ============ TAB CHANGE HANDLER ============

    const handleTabChange = useCallback(async (tab: TabType) => {
        setActiveTab(tab);
        setLoading(true);

        try {
            switch (tab) {
                case 'dashboard':
                    await loadDashboard();
                    break;
                case 'reservas':
                    await loadBookings(true);
                    break;
                case 'financeiro':
                    await loadFinanceiro();
                    break;
                case 'quadras':
                    await loadCourts();
                    break;
            }
        } finally {
            setLoading(false);
        }
    }, [loadDashboard, loadBookings, loadFinanceiro, loadCourts]);

    // ============ REFRESH HANDLER ============

    const refresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await handleTabChange(activeTab);
        } finally {
            setRefreshing(false);
        }
    }, [activeTab, handleTabChange]);

    // ============ EFFECTS ============

    // Initial load
    useEffect(() => {
        if (hostId) {
            handleTabChange('dashboard');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hostId]);

    // Reload bookings when filter changes
    useEffect(() => {
        if (activeTab === 'reservas') {
            loadBookings(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingFilter, dateRange]);

    // Load more bookings when page changes
    useEffect(() => {
        if (bookingsPage > 0) {
            loadBookings(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingsPage]);

    return {
        // State
        hostId,
        activeTab,
        loading,
        refreshing,

        // Dashboard
        dashboardStats,
        healthScore,
        upcomingBookings,
        revenueTrend,
        smartInsights,

        // Reservas
        bookingFilter,
        setBookingFilter,
        bookings,
        bookingStats,
        hasMoreBookings,
        dateRange,
        setDateRange,
        loadMoreBookings,

        // Financeiro
        financialSummary,
        monthlyRevenue,
        transactions,
        payouts,
        revenueBreakdown,
        loadPayoutHistory,
        requestWithdrawal,

        // Quadras
        courts,
        selectedCourtId,
        selectedCourtAnalytics,
        loadCourtAnalytics,
        toggleCourtStatus,

        // Actions
        setActiveTab: handleTabChange,
        refresh,
    };
}
