export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    name: string
                    username: string | null
                    email: string
                    phone: string | null
                    avatar_url: string | null
                    bio: string | null
                    location: string | null
                    latitude: number | null
                    longitude: number | null
                    sports: string[] | null
                    sport_levels: Json | null
                    play_frequency: string | null
                    goals: string[] | null
                    onboarding_completed: boolean | null
                    onboarding_completed_at: string | null
                    level: number | null
                    xp: number | null
                    xp_to_next_level: number | null
                    total_matches: number | null
                    wins: number | null
                    losses: number | null
                    streak: number | null
                    best_streak: number | null
                    is_verified: boolean | null
                    phone_verified: boolean | null
                    email_verified: boolean | null
                    is_pro: boolean | null
                    pro_expires_at: string | null
                    notifications_enabled: boolean | null
                    location_enabled: boolean | null
                    profile_public: boolean | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id: string
                    name: string
                    username?: string | null
                    email: string
                    phone?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    location?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    sports?: string[] | null
                    sport_levels?: Json | null
                    play_frequency?: string | null
                    goals?: string[] | null
                    onboarding_completed?: boolean | null
                    onboarding_completed_at?: string | null
                    level?: number | null
                    xp?: number | null
                    xp_to_next_level?: number | null
                    total_matches?: number | null
                    wins?: number | null
                    losses?: number | null
                    streak?: number | null
                    best_streak?: number | null
                    is_verified?: boolean | null
                    phone_verified?: boolean | null
                    email_verified?: boolean | null
                    is_pro?: boolean | null
                    pro_expires_at?: string | null
                    notifications_enabled?: boolean | null
                    location_enabled?: boolean | null
                    profile_public?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    username?: string | null
                    email?: string
                    phone?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    location?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    sports?: string[] | null
                    sport_levels?: Json | null
                    play_frequency?: string | null
                    goals?: string[] | null
                    onboarding_completed?: boolean | null
                    onboarding_completed_at?: string | null
                    level?: number | null
                    xp?: number | null
                    xp_to_next_level?: number | null
                    total_matches?: number | null
                    wins?: number | null
                    losses?: number | null
                    streak?: number | null
                    best_streak?: number | null
                    is_verified?: boolean | null
                    phone_verified?: boolean | null
                    email_verified?: boolean | null
                    is_pro?: boolean | null
                    pro_expires_at?: string | null
                    notifications_enabled?: boolean | null
                    location_enabled?: boolean | null
                    profile_public?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            courts: {
                Row: {
                    id: string
                    owner_id: string | null
                    name: string
                    description: string | null
                    type: 'public' | 'private' | 'club'
                    sport: string
                    address: string
                    city: string
                    state: string | null
                    zip_code: string | null
                    latitude: number
                    longitude: number
                    price_per_hour: number | null
                    is_free: boolean | null
                    capacity: number | null
                    amenities: string[] | null
                    rules: string | null
                    images: string[] | null
                    cover_image: string | null
                    rating: number | null
                    total_reviews: number | null
                    total_bookings: number | null
                    opening_time: string | null
                    closing_time: string | null
                    available_days: number[] | null
                    is_active: boolean | null
                    is_verified: boolean | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    owner_id?: string | null
                    name: string
                    description?: string | null
                    type: 'public' | 'private' | 'club'
                    sport: string
                    address: string
                    city: string
                    state?: string | null
                    zip_code?: string | null
                    latitude: number
                    longitude: number
                    price_per_hour?: number | null
                    is_free?: boolean | null
                    capacity?: number | null
                    amenities?: string[] | null
                    rules?: string | null
                    images?: string[] | null
                    cover_image?: string | null
                    rating?: number | null
                    total_reviews?: number | null
                    total_bookings?: number | null
                    opening_time?: string | null
                    closing_time?: string | null
                    available_days?: number[] | null
                    is_active?: boolean | null
                    is_verified?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    owner_id?: string | null
                    name?: string
                    description?: string | null
                    type?: 'public' | 'private' | 'club'
                    sport?: string
                    address?: string
                    city?: string
                    state?: string | null
                    zip_code?: string | null
                    latitude?: number
                    longitude?: number
                    price_per_hour?: number | null
                    is_free?: boolean | null
                    capacity?: number | null
                    amenities?: string[] | null
                    rules?: string | null
                    images?: string[] | null
                    cover_image?: string | null
                    rating?: number | null
                    total_reviews?: number | null
                    total_bookings?: number | null
                    opening_time?: string | null
                    closing_time?: string | null
                    available_days?: number[] | null
                    is_active?: boolean | null
                    is_verified?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            bookings: {
                Row: {
                    id: string
                    user_id: string
                    court_id: string
                    date: string
                    start_time: string
                    duration_hours: number
                    total_price: number
                    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | null
                    payment_status: 'pending' | 'paid' | 'refunded' | null
                    payment_method: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    court_id: string
                    date: string
                    start_time: string
                    duration_hours: number
                    total_price: number
                    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | null
                    payment_status?: 'pending' | 'paid' | 'refunded' | null
                    payment_method?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    court_id?: string
                    date?: string
                    start_time?: string
                    duration_hours?: number
                    total_price?: number
                    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | null
                    payment_status?: 'pending' | 'paid' | 'refunded' | null
                    payment_method?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            matches: {
                Row: {
                    id: string
                    created_by: string
                    court_id: string | null
                    booking_id: string | null
                    sport: string
                    title: string | null
                    description: string | null
                    date: string
                    start_time: string
                    end_time: string | null
                    duration_minutes: number | null
                    max_players: number | null
                    min_players: number | null
                    current_players: number | null
                    is_public: boolean | null
                    is_competitive: boolean | null
                    skill_level: string | null
                    status: 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled' | null
                    winner_team: number | null
                    score: Json | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    created_by: string
                    court_id?: string | null
                    booking_id?: string | null
                    sport: string
                    title?: string | null
                    description?: string | null
                    date: string
                    start_time: string
                    end_time?: string | null
                    duration_minutes?: number | null
                    max_players?: number | null
                    min_players?: number | null
                    current_players?: number | null
                    is_public?: boolean | null
                    is_competitive?: boolean | null
                    skill_level?: string | null
                    status?: 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled' | null
                    winner_team?: number | null
                    score?: Json | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    created_by?: string
                    court_id?: string | null
                    booking_id?: string | null
                    sport?: string
                    title?: string | null
                    description?: string | null
                    date?: string
                    start_time?: string
                    end_time?: string | null
                    duration_minutes?: number | null
                    max_players?: number | null
                    min_players?: number | null
                    current_players?: number | null
                    is_public?: boolean | null
                    is_competitive?: boolean | null
                    skill_level?: string | null
                    status?: 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled' | null
                    winner_team?: number | null
                    score?: Json | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            match_players: {
                Row: {
                    id: string
                    match_id: string
                    user_id: string
                    team: number | null
                    position: string | null
                    status: 'invited' | 'confirmed' | 'declined' | 'no_show' | null
                    rating_given: Json | null
                    xp_earned: number | null
                    joined_at: string | null
                }
                Insert: {
                    id?: string
                    match_id: string
                    user_id: string
                    team?: number | null
                    position?: string | null
                    status?: 'invited' | 'confirmed' | 'declined' | 'no_show' | null
                    rating_given?: Json | null
                    xp_earned?: number | null
                    joined_at?: string | null
                }
                Update: {
                    id?: string
                    match_id?: string
                    user_id?: string
                    team?: number | null
                    position?: string | null
                    status?: 'invited' | 'confirmed' | 'declined' | 'no_show' | null
                    rating_given?: Json | null
                    xp_earned?: number | null
                    joined_at?: string | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_nearby_courts: {
                Args: {
                    p_latitude: number
                    p_longitude: number
                    p_radius_km: number
                    p_sport?: string
                    p_limit?: number
                }
                Returns: {
                    id: string
                    name: string
                    type: string
                    sport: string
                    distance: number
                    rating: number
                    price_per_hour: number
                    is_free: boolean
                    latitude: number
                    longitude: number
                    images: string[]
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}
