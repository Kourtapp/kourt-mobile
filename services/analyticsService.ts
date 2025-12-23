import { supabase } from './supabase';
import { logger } from '../utils/logger';

type EventName =
    // --- USER LIFECYCLE ---
    | 'app_open'
    | 'sign_up'
    | 'sign_in'
    | 'sign_out'
    | 'auth_failure'
    | 'onboarding_start'
    | 'onboarding_step_complete'
    | 'onboarding_finish'
    | 'profile_edit'

    // --- MATCH & PLAY ---
    | 'match_create_start'
    | 'match_create_success'
    | 'match_view'
    | 'match_join'
    | 'match_leave'
    | 'match_checkin'
    | 'match_finish'
    | 'match_share'
    | 'match_status_update'


    // --- COURTS & DISCOVERY ---
    | 'court_view'
    | 'court_search'
    | 'court_filter_used'
    | 'court_map_view'
    | 'court_direction_click'
    | 'court_favorite'

    // --- FINANCIAL & BOOKING ---
    | 'booking_start'
    | 'booking_select_slot'
    | 'booking_checkout_view'
    | 'booking_success'
    | 'booking_fail'
    | 'wallet_deposit'
    | 'subscription_view'
    | 'subscription_subscribe'

    // --- REVIEWS & SOCIAL ---
    | 'review_submit'
    | 'friend_invite'
    | 'profile_view_other';

interface EventProperties {
    [key: string]: any;
}

class AnalyticsService {
    private queue: { event: EventName; properties?: EventProperties; timestamp: string }[] = [];
    private isProcessing = false;
    private BATCH_SIZE = 10;
    private FLUSH_INTERVAL = 30000; // 30 seconds

    constructor() {
        // Auto-flush periodically
        setInterval(() => this.flush(), this.FLUSH_INTERVAL);
    }

    /**
     * Log an event securely to Supabase.
     * Uses a queue to avoid spamming network requests.
     */
    public async log(event: EventName, properties?: EventProperties) {
        const payload = {
            event,
            properties,
            timestamp: new Date().toISOString(),
        };

        this.queue.push(payload);
        logger.log(`[Analytics] ${event}`, properties);

        if (this.queue.length >= this.BATCH_SIZE) {
            this.flush();
        }
    }

    /**
     * Send queued events to the database in batch
     */
    private async flush() {
        if (this.queue.length === 0 || this.isProcessing) return;

        this.isProcessing = true;
        const batch = [...this.queue];
        this.queue = [];

        try {
            const { error } = await supabase.from('analytics_events').insert(
                batch.map(item => ({
                    event_name: item.event,
                    properties: item.properties,
                    created_at: item.timestamp
                })) as any
            );

            if (error) throw error;
            logger.log(`[Analytics] Flushed ${batch.length} events`);
        } catch (error) {
            logger.error('[Analytics] Failed to flush events', error);
            // Re-queue failed events (optional strategy: limit retries)
            this.queue = [...batch, ...this.queue];
        } finally {
            this.isProcessing = false;
        }
    }
}

export const Analytics = new AnalyticsService();
