export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      achievement_unlocks: {
        Row: {
          achievement_id: string | null
          id: string
          unlocked_at: string | null
          user_id: string | null
          xp_awarded: number | null
        }
        Insert: {
          achievement_id?: string | null
          id?: string
          unlocked_at?: string | null
          user_id?: string | null
          xp_awarded?: number | null
        }
        Update: {
          achievement_id?: string | null
          id?: string
          unlocked_at?: string | null
          user_id?: string | null
          xp_awarded?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "achievement_unlocks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievement_unlocks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      achievements: {
        Row: {
          category: string
          condition: Json
          created_at: string | null
          description: string
          icon: string
          id: string
          name: string
          xp_reward: number | null
        }
        Insert: {
          category: string
          condition: Json
          created_at?: string | null
          description: string
          icon: string
          id?: string
          name: string
          xp_reward?: number | null
        }
        Update: {
          category?: string
          condition?: Json
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      ai_generations: {
        Row: {
          created_at: string | null
          id: string
          input: Json | null
          model: string | null
          output: Json | null
          tokens_used: number | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          input?: Json | null
          model?: string | null
          output?: Json | null
          tokens_used?: number | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          input?: Json | null
          model?: string | null
          output?: Json | null
          tokens_used?: number | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_generations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_generations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string | null
          device_info: Json | null
          event_data: Json | null
          event_name: string | null
          id: string
          properties: Json | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          event_data?: Json | null
          event_name?: string | null
          id?: string
          properties?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          event_data?: Json | null
          event_name?: string | null
          id?: string
          properties?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_costs: {
        Row: {
          cost_usd: number | null
          created_at: string | null
          endpoint: string | null
          id: number
          service: string
          tokens_used: number | null
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string | null
          endpoint?: string | null
          id?: number
          service: string
          tokens_used?: number | null
        }
        Update: {
          cost_usd?: number | null
          created_at?: string | null
          endpoint?: string | null
          id?: number
          service?: string
          tokens_used?: number | null
        }
        Relationships: []
      }
      arena_schedules: {
        Row: {
          arena_id: string | null
          close_time: string
          created_at: string | null
          day_of_week: number | null
          id: string
          is_closed: boolean | null
          open_time: string
          price_modifier: number | null
          specific_date: string | null
        }
        Insert: {
          arena_id?: string | null
          close_time: string
          created_at?: string | null
          day_of_week?: number | null
          id?: string
          is_closed?: boolean | null
          open_time: string
          price_modifier?: number | null
          specific_date?: string | null
        }
        Update: {
          arena_id?: string | null
          close_time?: string
          created_at?: string | null
          day_of_week?: number | null
          id?: string
          is_closed?: boolean | null
          open_time?: string
          price_modifier?: number | null
          specific_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arena_schedules_arena_id_fkey"
            columns: ["arena_id"]
            isOneToOne: false
            referencedRelation: "arenas"
            referencedColumns: ["id"]
          },
        ]
      }
      arenas: {
        Row: {
          address: string | null
          amenities: string[] | null
          city: string | null
          cover_photo_url: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          owner_id: string | null
          phone: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          city?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          owner_id?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          city?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arenas_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arenas_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          coupon_code: string | null
          court_id: string
          created_at: string | null
          date: string
          discount_amount: number | null
          duration_hours: number
          end_time: string
          host_payout_amount: number | null
          id: string
          payment_id: string | null
          payment_method: string | null
          payment_status: string | null
          platform_fee: number | null
          refund_amount: number | null
          refunded_at: string | null
          service_fee: number | null
          start_time: string
          status: string | null
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          subtotal: number | null
          tax_amount: number | null
          total_price: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          coupon_code?: string | null
          court_id: string
          created_at?: string | null
          date: string
          discount_amount?: number | null
          duration_hours: number
          end_time: string
          host_payout_amount?: number | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          platform_fee?: number | null
          refund_amount?: number | null
          refunded_at?: string | null
          service_fee?: number | null
          start_time: string
          status?: string | null
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_price: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          coupon_code?: string | null
          court_id?: string
          created_at?: string | null
          date?: string
          discount_amount?: number | null
          duration_hours?: number
          end_time?: string
          host_payout_amount?: number | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          platform_fee?: number | null
          refund_amount?: number | null
          refunded_at?: string | null
          service_fee?: number | null
          start_time?: string
          status?: string | null
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_price?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          created_at: string | null
          description: string
          ends_at: string
          icon: string
          id: string
          is_active: boolean | null
          period: string | null
          starts_at: string
          target_count: number
          target_type: string
          title: string
          xp_reward: number
        }
        Insert: {
          created_at?: string | null
          description: string
          ends_at: string
          icon: string
          id?: string
          is_active?: boolean | null
          period?: string | null
          starts_at: string
          target_count: number
          target_type: string
          title: string
          xp_reward: number
        }
        Update: {
          created_at?: string | null
          description?: string
          ends_at?: string
          icon?: string
          id?: string
          is_active?: boolean | null
          period?: string | null
          starts_at?: string
          target_count?: number
          target_type?: string
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      chat_logs: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          match_id: string
          type: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          match_id: string
          type?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          match_id?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "nearby_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string | null
          id: string
          joined_at: string | null
          last_read_at: string | null
          notifications_enabled: boolean | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          notifications_enabled?: boolean | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          notifications_enabled?: boolean | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          created_by: string | null
          id: string
          last_message_at: string | null
          last_message_id: string | null
          name: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_message_at?: string | null
          last_message_id?: string | null
          name?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_message_at?: string | null
          last_message_id?: string | null
          name?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      coupon_uses: {
        Row: {
          booking_id: string | null
          coupon_id: string | null
          created_at: string | null
          discount_applied: number | null
          id: string
          subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          coupon_id?: string | null
          created_at?: string | null
          discount_applied?: number | null
          id?: string
          subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          coupon_id?: string | null
          created_at?: string | null
          discount_applied?: number | null
          id?: string
          subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_uses_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_uses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_uses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          applies_to: string | null
          code: string
          created_at: string | null
          created_by: string | null
          currency: string | null
          description: string | null
          discount_type: string | null
          discount_value: number
          id: string
          is_active: boolean | null
          max_discount: number | null
          max_uses: number | null
          max_uses_per_user: number | null
          min_purchase: number | null
          name: string | null
          stripe_coupon_id: string | null
          times_used: number | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          applies_to?: string | null
          code: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          discount_type?: string | null
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_discount?: number | null
          max_uses?: number | null
          max_uses_per_user?: number | null
          min_purchase?: number | null
          name?: string | null
          stripe_coupon_id?: string | null
          times_used?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          applies_to?: string | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_discount?: number | null
          max_uses?: number | null
          max_uses_per_user?: number | null
          min_purchase?: number | null
          name?: string | null
          stripe_coupon_id?: string | null
          times_used?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      court_checkins: {
        Row: {
          checkin_date: string
          court_id: string
          created_at: string | null
          id: string
          status: string | null
          time_slot: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          checkin_date: string
          court_id: string
          created_at?: string | null
          id?: string
          status?: string | null
          time_slot: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          checkin_date?: string
          court_id?: string
          created_at?: string | null
          id?: string
          status?: string | null
          time_slot?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "court_checkins_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
        ]
      }
      court_suggestions: {
        Row: {
          access_type: string | null
          address: string
          admin_notes: string | null
          amenities: string[] | null
          city: string
          closing_hours: string | null
          created_at: string | null
          description: string | null
          floor_types: string[] | null
          has_lighting: boolean | null
          id: string
          is_covered: boolean | null
          is_free: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          neighborhood: string | null
          number_of_courts: number | null
          opening_hours: string | null
          price_per_hour: number | null
          reference: string | null
          sports: string[] | null
          status: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_type?: string | null
          address: string
          admin_notes?: string | null
          amenities?: string[] | null
          city: string
          closing_hours?: string | null
          created_at?: string | null
          description?: string | null
          floor_types?: string[] | null
          has_lighting?: boolean | null
          id?: string
          is_covered?: boolean | null
          is_free?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          neighborhood?: string | null
          number_of_courts?: number | null
          opening_hours?: string | null
          price_per_hour?: number | null
          reference?: string | null
          sports?: string[] | null
          status?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_type?: string | null
          address?: string
          admin_notes?: string | null
          amenities?: string[] | null
          city?: string
          closing_hours?: string | null
          created_at?: string | null
          description?: string | null
          floor_types?: string[] | null
          has_lighting?: boolean | null
          id?: string
          is_covered?: boolean | null
          is_free?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          neighborhood?: string | null
          number_of_courts?: number | null
          opening_hours?: string | null
          price_per_hour?: number | null
          reference?: string | null
          sports?: string[] | null
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "court_suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "court_suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      courts: {
        Row: {
          address: string
          amenities: string[] | null
          arena_id: string | null
          cancellation_fee_percent: number | null
          cancellation_hours: number | null
          city: string
          country: string | null
          cover_image: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          hours_weekdays: string | null
          hours_weekends: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_free: boolean | null
          is_verified: boolean | null
          latitude: number | null
          location: unknown
          longitude: number | null
          minimum_booking_hours: number | null
          name: string
          neighborhood: string | null
          owner_id: string | null
          peak_price_per_hour: number | null
          price_per_hour: number | null
          rating: number | null
          rating_count: number | null
          sport: string
          sports: string[] | null
          state: string | null
          total_reviews: number | null
          type: string | null
          updated_at: string | null
          verified_at: string | null
          weekend_price_per_hour: number | null
        }
        Insert: {
          address: string
          amenities?: string[] | null
          arena_id?: string | null
          cancellation_fee_percent?: number | null
          cancellation_hours?: number | null
          city: string
          country?: string | null
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          hours_weekdays?: string | null
          hours_weekends?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_free?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          minimum_booking_hours?: number | null
          name: string
          neighborhood?: string | null
          owner_id?: string | null
          peak_price_per_hour?: number | null
          price_per_hour?: number | null
          rating?: number | null
          rating_count?: number | null
          sport: string
          sports?: string[] | null
          state?: string | null
          total_reviews?: number | null
          type?: string | null
          updated_at?: string | null
          verified_at?: string | null
          weekend_price_per_hour?: number | null
        }
        Update: {
          address?: string
          amenities?: string[] | null
          arena_id?: string | null
          cancellation_fee_percent?: number | null
          cancellation_hours?: number | null
          city?: string
          country?: string | null
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          hours_weekdays?: string | null
          hours_weekends?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_free?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          minimum_booking_hours?: number | null
          name?: string
          neighborhood?: string | null
          owner_id?: string | null
          peak_price_per_hour?: number | null
          price_per_hour?: number | null
          rating?: number | null
          rating_count?: number | null
          sport?: string
          sports?: string[] | null
          state?: string | null
          total_reviews?: number | null
          type?: string | null
          updated_at?: string | null
          verified_at?: string | null
          weekend_price_per_hour?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "courts_arena_id_fkey"
            columns: ["arena_id"]
            isOneToOne: false
            referencedRelation: "arenas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      data_deletion_log: {
        Row: {
          completed_at: string | null
          deleted_items: Json | null
          deletion_reason: string | null
          email_hash: string | null
          id: string
          requested_at: string | null
          requested_by: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          deleted_items?: Json | null
          deletion_reason?: string | null
          email_hash?: string | null
          id?: string
          requested_at?: string | null
          requested_by?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          deleted_items?: Json | null
          deletion_reason?: string | null
          email_hash?: string | null
          id?: string
          requested_at?: string | null
          requested_by?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      financial_daily_summary: {
        Row: {
          active_users: number | null
          canceled_subscriptions: number | null
          created_at: string | null
          date: string
          id: string
          new_subscriptions: number | null
          new_users: number | null
          total_bookings: number | null
          total_gmv: number | null
          total_payouts: number | null
          total_refunds: number | null
          total_revenue: number | null
          total_subscriptions_revenue: number | null
          total_tournaments_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          active_users?: number | null
          canceled_subscriptions?: number | null
          created_at?: string | null
          date: string
          id?: string
          new_subscriptions?: number | null
          new_users?: number | null
          total_bookings?: number | null
          total_gmv?: number | null
          total_payouts?: number | null
          total_refunds?: number | null
          total_revenue?: number | null
          total_subscriptions_revenue?: number | null
          total_tournaments_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          active_users?: number | null
          canceled_subscriptions?: number | null
          created_at?: string | null
          date?: string
          id?: string
          new_subscriptions?: number | null
          new_users?: number | null
          total_bookings?: number | null
          total_gmv?: number | null
          total_payouts?: number | null
          total_refunds?: number | null
          total_revenue?: number | null
          total_subscriptions_revenue?: number | null
          total_tournaments_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      host_applications: {
        Row: {
          address: string | null
          admin_notes: string | null
          approved_at: string | null
          business_name: string | null
          city: string | null
          cnpj: string | null
          created_at: string | null
          description: string | null
          documents: Json | null
          email: string | null
          id: string
          number_of_courts: number | null
          owner_cpf: string | null
          owner_name: string | null
          phone: string | null
          state: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          approved_at?: string | null
          business_name?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string | null
          description?: string | null
          documents?: Json | null
          email?: string | null
          id?: string
          number_of_courts?: number | null
          owner_cpf?: string | null
          owner_name?: string | null
          phone?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          approved_at?: string | null
          business_name?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string | null
          description?: string | null
          documents?: Json | null
          email?: string | null
          id?: string
          number_of_courts?: number | null
          owner_cpf?: string | null
          owner_name?: string | null
          phone?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "host_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "host_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      host_earnings: {
        Row: {
          available_at: string | null
          booking_id: string | null
          commission_rate: number | null
          court_id: string | null
          created_at: string | null
          gross_amount: number
          host_id: string
          id: string
          net_amount: number
          payout_id: string | null
          platform_fee: number
          status: string | null
        }
        Insert: {
          available_at?: string | null
          booking_id?: string | null
          commission_rate?: number | null
          court_id?: string | null
          created_at?: string | null
          gross_amount: number
          host_id: string
          id?: string
          net_amount: number
          payout_id?: string | null
          platform_fee: number
          status?: string | null
        }
        Update: {
          available_at?: string | null
          booking_id?: string | null
          commission_rate?: number | null
          court_id?: string | null
          created_at?: string | null
          gross_amount?: number
          host_id?: string
          id?: string
          net_amount?: number
          payout_id?: string | null
          platform_fee?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "host_earnings_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "host_payouts"
            referencedColumns: ["id"]
          },
        ]
      }
      host_monthly_summary: {
        Row: {
          avg_booking_value: number | null
          cancellation_rate: number | null
          created_at: string | null
          host_id: string
          id: string
          month: number
          net_earnings: number | null
          total_bookings: number | null
          total_commission: number | null
          total_payouts: number | null
          total_revenue: number | null
          updated_at: string | null
          year: number
        }
        Insert: {
          avg_booking_value?: number | null
          cancellation_rate?: number | null
          created_at?: string | null
          host_id: string
          id?: string
          month: number
          net_earnings?: number | null
          total_bookings?: number | null
          total_commission?: number | null
          total_payouts?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          year: number
        }
        Update: {
          avg_booking_value?: number | null
          cancellation_rate?: number | null
          created_at?: string | null
          host_id?: string
          id?: string
          month?: number
          net_earnings?: number | null
          total_bookings?: number | null
          total_commission?: number | null
          total_payouts?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      host_payouts: {
        Row: {
          amount: number
          booking_ids: string[] | null
          bookings_count: number | null
          created_at: string | null
          currency: string | null
          failure_reason: string | null
          fee: number | null
          host_id: string
          id: string
          net_amount: number | null
          paid_at: string | null
          period_end: string | null
          period_start: string | null
          status: string | null
          stripe_payout_id: string | null
          stripe_transfer_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_ids?: string[] | null
          bookings_count?: number | null
          created_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          fee?: number | null
          host_id: string
          id?: string
          net_amount?: number | null
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string | null
          stripe_payout_id?: string | null
          stripe_transfer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_ids?: string[] | null
          bookings_count?: number | null
          created_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          fee?: number | null
          host_id?: string
          id?: string
          net_amount?: number | null
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string | null
          stripe_payout_id?: string | null
          stripe_transfer_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hosts: {
        Row: {
          application_id: string | null
          available_balance: number | null
          bank_account_info: Json | null
          business_name: string | null
          cnpj: string | null
          commission_rate: number | null
          created_at: string | null
          email: string | null
          id: string
          is_verified: boolean | null
          lifetime_revenue: number | null
          payout_minimum: number | null
          payout_schedule: string | null
          pending_balance: number | null
          phone: string | null
          stripe_account_id: string | null
          stripe_account_status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_tier: string | null
          total_earnings: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          application_id?: string | null
          available_balance?: number | null
          bank_account_info?: Json | null
          business_name?: string | null
          cnpj?: string | null
          commission_rate?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          lifetime_revenue?: number | null
          payout_minimum?: number | null
          payout_schedule?: string | null
          pending_balance?: number | null
          phone?: string | null
          stripe_account_id?: string | null
          stripe_account_status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier?: string | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          application_id?: string | null
          available_balance?: number | null
          bank_account_info?: Json | null
          business_name?: string | null
          cnpj?: string | null
          commission_rate?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          lifetime_revenue?: number | null
          payout_minimum?: number | null
          payout_schedule?: string | null
          pending_balance?: number | null
          phone?: string | null
          stripe_account_id?: string | null
          stripe_account_status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier?: string | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hosts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hosts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_due: number
          amount_paid: number | null
          booking_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          discount: number | null
          due_date: string | null
          hosted_invoice_url: string | null
          id: string
          invoice_number: string | null
          line_items: Json | null
          metadata: Json | null
          paid_at: string | null
          pdf_url: string | null
          status: string | null
          stripe_invoice_id: string | null
          subscription_id: string | null
          subtotal: number | null
          tax: number | null
          tournament_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_due: number
          amount_paid?: number | null
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          discount?: number | null
          due_date?: string | null
          hosted_invoice_url?: string | null
          id?: string
          invoice_number?: string | null
          line_items?: Json | null
          metadata?: Json | null
          paid_at?: string | null
          pdf_url?: string | null
          status?: string | null
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          subtotal?: number | null
          tax?: number | null
          tournament_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_due?: number
          amount_paid?: number | null
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          discount?: number | null
          due_date?: string | null
          hosted_invoice_url?: string | null
          id?: string
          invoice_number?: string | null
          line_items?: Json | null
          metadata?: Json | null
          paid_at?: string | null
          pdf_url?: string | null
          status?: string | null
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          subtotal?: number | null
          tax?: number | null
          tournament_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      match_invites: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          match_id: string | null
          message: string | null
          recipient_id: string | null
          responded_at: string | null
          sender_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          match_id?: string | null
          message?: string | null
          recipient_id?: string | null
          responded_at?: string | null
          sender_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          match_id?: string | null
          message?: string | null
          recipient_id?: string | null
          responded_at?: string | null
          sender_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_invites_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_invites_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "nearby_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_invites_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_invites_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_invites_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_invites_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      match_players: {
        Row: {
          id: string
          joined_at: string | null
          match_id: string
          mvp: boolean | null
          points_scored: number | null
          position: number | null
          status: string | null
          team: number | null
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          match_id: string
          mvp?: boolean | null
          points_scored?: number | null
          position?: number | null
          status?: string | null
          team?: number | null
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          match_id?: string
          mvp?: boolean | null
          points_scored?: number | null
          position?: number | null
          status?: string | null
          team?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_players_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_players_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "nearby_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      match_scores: {
        Row: {
          current_set: number | null
          finished_at: string | null
          id: string
          match_id: string
          sets_history: Json | null
          started_at: string | null
          status: string | null
          team_a_score: number | null
          team_a_sets: number | null
          team_b_score: number | null
          team_b_sets: number | null
          updated_at: string | null
          winner_team: string | null
        }
        Insert: {
          current_set?: number | null
          finished_at?: string | null
          id?: string
          match_id: string
          sets_history?: Json | null
          started_at?: string | null
          status?: string | null
          team_a_score?: number | null
          team_a_sets?: number | null
          team_b_score?: number | null
          team_b_sets?: number | null
          updated_at?: string | null
          winner_team?: string | null
        }
        Update: {
          current_set?: number | null
          finished_at?: string | null
          id?: string
          match_id?: string
          sets_history?: Json | null
          started_at?: string | null
          status?: string | null
          team_a_score?: number | null
          team_a_sets?: number | null
          team_b_score?: number | null
          team_b_sets?: number | null
          updated_at?: string | null
          winner_team?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_scores_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_scores_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "nearby_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          court_id: string | null
          created_at: string | null
          current_players: number | null
          date: string
          description: string | null
          end_time: string | null
          id: string
          is_private: boolean | null
          is_public: boolean | null
          level: string | null
          location_address: string | null
          location_name: string | null
          max_players: number
          organizer_id: string
          photo_url: string | null
          player1_id: string | null
          requires_approval: boolean | null
          score: Json | null
          score_final: string | null
          sport: string
          start_time: string
          status: string | null
          time: string | null
          title: string
          type: string | null
          updated_at: string | null
          venue: string | null
          winner_team: number | null
        }
        Insert: {
          court_id?: string | null
          created_at?: string | null
          current_players?: number | null
          date: string
          description?: string | null
          end_time?: string | null
          id?: string
          is_private?: boolean | null
          is_public?: boolean | null
          level?: string | null
          location_address?: string | null
          location_name?: string | null
          max_players?: number
          organizer_id: string
          photo_url?: string | null
          player1_id?: string | null
          requires_approval?: boolean | null
          score?: Json | null
          score_final?: string | null
          sport: string
          start_time: string
          status?: string | null
          time?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          venue?: string | null
          winner_team?: number | null
        }
        Update: {
          court_id?: string | null
          created_at?: string | null
          current_players?: number | null
          date?: string
          description?: string | null
          end_time?: string | null
          id?: string
          is_private?: boolean | null
          is_public?: boolean | null
          level?: string | null
          location_address?: string | null
          location_name?: string | null
          max_players?: number
          organizer_id?: string
          photo_url?: string | null
          player1_id?: string | null
          requires_approval?: boolean | null
          score?: Json | null
          score_final?: string | null
          sport?: string
          start_time?: string
          status?: string | null
          time?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          venue?: string | null
          winner_team?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string | null
          created_at: string | null
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          media_url: string | null
          read_by: string[] | null
          reply_to_id: string | null
          sender_id: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          media_url?: string | null
          read_by?: string[] | null
          reply_to_id?: string | null
          sender_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          media_url?: string | null
          read_by?: string[] | null
          reply_to_id?: string | null
          sender_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          body: string | null
          created_at: string | null
          error: string | null
          id: string
          push_token: string | null
          status: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          push_token?: string | null
          status?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          push_token?: string | null
          status?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          data: Json | null
          id: string
          read: boolean | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          data?: Json | null
          id?: string
          read?: boolean | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          data?: Json | null
          id?: string
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          billing_details: Json | null
          brand: string | null
          created_at: string | null
          exp_month: number | null
          exp_year: number | null
          id: string
          is_default: boolean | null
          last4: string | null
          stripe_payment_method_id: string
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billing_details?: Json | null
          brand?: string | null
          created_at?: string | null
          exp_month?: number | null
          exp_year?: number | null
          id?: string
          is_default?: boolean | null
          last4?: string | null
          stripe_payment_method_id: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing_details?: Json | null
          brand?: string | null
          created_at?: string | null
          exp_month?: number | null
          exp_year?: number | null
          id?: string
          is_default?: boolean | null
          last4?: string | null
          stripe_payment_method_id?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_verifications: {
        Row: {
          attempts: number | null
          created_at: string | null
          expires_at: string
          id: string
          max_attempts: number | null
          otp_code: string
          phone: string
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          expires_at: string
          id?: string
          max_attempts?: number | null
          otp_code: string
          phone: string
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          expires_at?: string
          id?: string
          max_attempts?: number | null
          otp_code?: string
          phone?: string
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phone_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phone_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      player_suggestions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          reason: string | null
          score: number | null
          suggested_user_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          reason?: string | null
          score?: number | null
          suggested_user_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          reason?: string | null
          score?: number | null
          suggested_user_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_suggestions_suggested_user_id_fkey"
            columns: ["suggested_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_suggestions_suggested_user_id_fkey"
            columns: ["suggested_user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number | null
          content: string | null
          created_at: string | null
          duration: string | null
          id: string
          likes_count: number | null
          match_id: string | null
          metrics: Json | null
          photo_url: string | null
          result: string | null
          score: string | null
          sport: string | null
          type: string
          updated_at: string | null
          user_id: string
          venue: string | null
          xp_earned: number | null
        }
        Insert: {
          comments_count?: number | null
          content?: string | null
          created_at?: string | null
          duration?: string | null
          id?: string
          likes_count?: number | null
          match_id?: string | null
          metrics?: Json | null
          photo_url?: string | null
          result?: string | null
          score?: string | null
          sport?: string | null
          type?: string
          updated_at?: string | null
          user_id: string
          venue?: string | null
          xp_earned?: number | null
        }
        Update: {
          comments_count?: number | null
          content?: string | null
          created_at?: string | null
          duration?: string | null
          id?: string
          likes_count?: number | null
          match_id?: string | null
          metrics?: Json | null
          photo_url?: string | null
          result?: string | null
          score?: string | null
          sport?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
          venue?: string | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "nearby_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      private_ranking_members: {
        Row: {
          id: string
          joined_at: string | null
          losses: number | null
          points: number | null
          ranking_id: string
          user_id: string
          wins: number | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          losses?: number | null
          points?: number | null
          ranking_id: string
          user_id: string
          wins?: number | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          losses?: number | null
          points?: number | null
          ranking_id?: string
          user_id?: string
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "private_ranking_members_ranking_id_fkey"
            columns: ["ranking_id"]
            isOneToOne: false
            referencedRelation: "private_rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "private_ranking_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "private_ranking_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      private_rankings: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          invite_code: string | null
          name: string
          owner_id: string
          sport: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          invite_code?: string | null
          name: string
          owner_id: string
          sport: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          invite_code?: string | null
          name?: string
          owner_id?: string
          sport?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "private_rankings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "private_rankings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_services: {
        Row: {
          category: Database["public"]["Enums"]["service_category"]
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          price_cents: number
          professional_id: string
          title: string
        }
        Insert: {
          category: Database["public"]["Enums"]["service_category"]
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          price_cents: number
          professional_id: string
          title: string
        }
        Update: {
          category?: Database["public"]["Enums"]["service_category"]
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          price_cents?: number
          professional_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_services_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          profile_image_url: string | null
          qualifications: string | null
          specialties: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          profile_image_url?: string | null
          qualifications?: string | null
          specialties?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          profile_image_url?: string | null
          qualifications?: string | null
          specialties?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_status: string | null
          auth_provider: string | null
          avatar_url: string | null
          billing_address: Json | null
          billing_email: string | null
          billing_name: string | null
          bio: string | null
          city: string | null
          cpf: string | null
          created_at: string | null
          default_payment_method_id: string | null
          email: string
          email_verified: boolean | null
          followers_count: number | null
          following_count: number | null
          goals: string[] | null
          id: string
          identity_verified: boolean | null
          identity_verified_at: string | null
          is_pro: boolean | null
          last_active_at: string | null
          latitude: number | null
          level: number | null
          longitude: number | null
          losses: number | null
          main_goal: string | null
          matches_played: number | null
          name: string | null
          neighborhood: string | null
          notification_preferences: Json | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          phone: string | null
          phone_verified: boolean | null
          phone_verified_at: string | null
          play_frequency: string | null
          play_style: string | null
          preferred_schedule: string | null
          rank_points: number | null
          rating: number | null
          referral_code: string | null
          referral_credits: number | null
          referred_by: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          skill_level: string | null
          sport_levels: Json | null
          sports: string[] | null
          stats_attack: number | null
          stats_defense: number | null
          stats_mental: number | null
          stats_physical: number | null
          stats_technique: number | null
          streak: number | null
          stripe_customer_id: string | null
          subscription: string | null
          subscription_expires_at: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          total_matches: number | null
          total_referrals: number | null
          total_spent: number | null
          updated_at: string | null
          username: string | null
          wallet_balance: number | null
          win_rate: number | null
          wins: number | null
          xp: number | null
          xp_to_next_level: number | null
        }
        Insert: {
          account_status?: string | null
          auth_provider?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          billing_email?: string | null
          billing_name?: string | null
          bio?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string | null
          default_payment_method_id?: string | null
          email: string
          email_verified?: boolean | null
          followers_count?: number | null
          following_count?: number | null
          goals?: string[] | null
          id: string
          identity_verified?: boolean | null
          identity_verified_at?: string | null
          is_pro?: boolean | null
          last_active_at?: string | null
          latitude?: number | null
          level?: number | null
          longitude?: number | null
          losses?: number | null
          main_goal?: string | null
          matches_played?: number | null
          name?: string | null
          neighborhood?: string | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          phone_verified_at?: string | null
          play_frequency?: string | null
          play_style?: string | null
          preferred_schedule?: string | null
          rank_points?: number | null
          rating?: number | null
          referral_code?: string | null
          referral_credits?: number | null
          referred_by?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          skill_level?: string | null
          sport_levels?: Json | null
          sports?: string[] | null
          stats_attack?: number | null
          stats_defense?: number | null
          stats_mental?: number | null
          stats_physical?: number | null
          stats_technique?: number | null
          streak?: number | null
          stripe_customer_id?: string | null
          subscription?: string | null
          subscription_expires_at?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          total_matches?: number | null
          total_referrals?: number | null
          total_spent?: number | null
          updated_at?: string | null
          username?: string | null
          wallet_balance?: number | null
          win_rate?: number | null
          wins?: number | null
          xp?: number | null
          xp_to_next_level?: number | null
        }
        Update: {
          account_status?: string | null
          auth_provider?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          billing_email?: string | null
          billing_name?: string | null
          bio?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string | null
          default_payment_method_id?: string | null
          email?: string
          email_verified?: boolean | null
          followers_count?: number | null
          following_count?: number | null
          goals?: string[] | null
          id?: string
          identity_verified?: boolean | null
          identity_verified_at?: string | null
          is_pro?: boolean | null
          last_active_at?: string | null
          latitude?: number | null
          level?: number | null
          longitude?: number | null
          losses?: number | null
          main_goal?: string | null
          matches_played?: number | null
          name?: string | null
          neighborhood?: string | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          phone_verified_at?: string | null
          play_frequency?: string | null
          play_style?: string | null
          preferred_schedule?: string | null
          rank_points?: number | null
          rating?: number | null
          referral_code?: string | null
          referral_credits?: number | null
          referred_by?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          skill_level?: string | null
          sport_levels?: Json | null
          sports?: string[] | null
          stats_attack?: number | null
          stats_defense?: number | null
          stats_mental?: number | null
          stats_physical?: number | null
          stats_technique?: number | null
          streak?: number | null
          stripe_customer_id?: string | null
          subscription?: string | null
          subscription_expires_at?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          total_matches?: number | null
          total_referrals?: number | null
          total_spent?: number | null
          updated_at?: string | null
          username?: string | null
          wallet_balance?: number | null
          win_rate?: number | null
          wins?: number | null
          xp?: number | null
          xp_to_next_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      promotional_credits: {
        Row: {
          amount: number
          campaign_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          remaining_amount: number
          source: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          remaining_amount: number
          source?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          remaining_amount?: number
          source?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promotional_credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotional_credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendation_logs: {
        Row: {
          count: number | null
          created_at: string | null
          id: string
          top_reasons: string[] | null
          type: string
          user_id: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          id?: string
          top_reasons?: string[] | null
          type: string
          user_id?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          id?: string
          top_reasons?: string[] | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendation_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_rewards: {
        Row: {
          badge_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          milestone: number
          reward_amount: number
          reward_description: string | null
          reward_type: string
        }
        Insert: {
          badge_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          milestone: number
          reward_amount: number
          reward_description?: string | null
          reward_type: string
        }
        Update: {
          badge_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          milestone?: number
          reward_amount?: number
          reward_description?: string | null
          reward_type?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          referral_code: string
          referred_email: string | null
          referred_id: string | null
          referrer_id: string
          reward_amount: number | null
          reward_type: string | null
          rewarded_at: string | null
          signed_up_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referral_code: string
          referred_email?: string | null
          referred_id?: string | null
          referrer_id: string
          reward_amount?: number | null
          reward_type?: string | null
          rewarded_at?: string | null
          signed_up_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_email?: string | null
          referred_id?: string | null
          referrer_id?: string
          reward_amount?: number | null
          reward_type?: string | null
          rewarded_at?: string | null
          signed_up_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: true
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      refund_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          booking_id: string | null
          created_at: string | null
          description: string | null
          id: string
          reason: string | null
          refunded_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          stripe_refund_id: string | null
          subscription_id: string | null
          tournament_id: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          booking_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: string | null
          refunded_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          stripe_refund_id?: string | null
          subscription_id?: string | null
          tournament_id?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: string | null
          refunded_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          stripe_refund_id?: string | null
          subscription_id?: string | null
          tournament_id?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refund_requests_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          court_id: string | null
          created_at: string | null
          id: string
          match_id: string | null
          player_id: string | null
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          court_id?: string | null
          created_at?: string | null
          id?: string
          match_id?: string | null
          player_id?: string | null
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          court_id?: string | null
          created_at?: string | null
          id?: string
          match_id?: string | null
          player_id?: string | null
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "nearby_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      security_logs: {
        Row: {
          created_at: string | null
          event_details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          risk_score: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          risk_score?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          risk_score?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          id: string
          stripe_customer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          stripe_customer_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          stripe_customer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_events: {
        Row: {
          api_version: string | null
          created_at: string | null
          data: Json
          error: string | null
          event_type: string
          id: string
          livemode: boolean | null
          processed: boolean | null
          processed_at: string | null
          retry_count: number | null
          stripe_event_id: string
        }
        Insert: {
          api_version?: string | null
          created_at?: string | null
          data: Json
          error?: string | null
          event_type: string
          id?: string
          livemode?: boolean | null
          processed?: boolean | null
          processed_at?: string | null
          retry_count?: number | null
          stripe_event_id: string
        }
        Update: {
          api_version?: string | null
          created_at?: string | null
          data?: Json
          error?: string | null
          event_type?: string
          id?: string
          livemode?: boolean | null
          processed?: boolean | null
          processed_at?: string | null
          retry_count?: number | null
          stripe_event_id?: string
        }
        Relationships: []
      }
      subscription_history: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          new_status: string | null
          new_tier: string | null
          previous_status: string | null
          previous_tier: string | null
          reason: string | null
          subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          new_status?: string | null
          new_tier?: string | null
          previous_status?: string | null
          previous_tier?: string | null
          reason?: string | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          new_status?: string | null
          new_tier?: string | null
          previous_status?: string | null
          previous_tier?: string | null
          reason?: string | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price_monthly: number
          price_yearly: number | null
          sort_order: number | null
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          tier: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price_monthly: number
          price_yearly?: number | null
          sort_order?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          tier: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_monthly?: number
          price_yearly?: number | null
          sort_order?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          tier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"] | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billing_cycle?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"] | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing_cycle?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"] | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          avatar_url: string | null
          captain_id: string
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          sport: string
          stats: Json | null
        }
        Insert: {
          avatar_url?: string | null
          captain_id: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sport: string
          stats?: Json | null
        }
        Update: {
          avatar_url?: string | null
          captain_id?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sport?: string
          stats?: Json | null
        }
        Relationships: []
      }
      tournament_matches: {
        Row: {
          bracket_position: number | null
          created_at: string | null
          id: string
          match_id: string | null
          next_match_id: string | null
          round: number | null
          tournament_id: string | null
        }
        Insert: {
          bracket_position?: number | null
          created_at?: string | null
          id?: string
          match_id?: string | null
          next_match_id?: string | null
          round?: number | null
          tournament_id?: string | null
        }
        Update: {
          bracket_position?: number | null
          created_at?: string | null
          id?: string
          match_id?: string | null
          next_match_id?: string | null
          round?: number | null
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_matches_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_matches_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "nearby_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_participants: {
        Row: {
          created_at: string | null
          entry_fee_paid: number | null
          id: string
          paid_at: string | null
          payment_id: string | null
          payment_status: string | null
          refunded_at: string | null
          status: string | null
          team_id: string | null
          tournament_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entry_fee_paid?: number | null
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_status?: string | null
          refunded_at?: string | null
          status?: string | null
          team_id?: string | null
          tournament_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entry_fee_paid?: number | null
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_status?: string | null
          refunded_at?: string | null
          status?: string | null
          team_id?: string | null
          tournament_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          arena_id: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          entry_fee: number | null
          id: string
          max_participants: number | null
          organizer_id: string | null
          prize_distribution: Json | null
          prize_pool: number | null
          refund_policy: string | null
          registration_deadline: string | null
          sport: string
          start_date: string
          status: string | null
          title: string
          total_collected: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          arena_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          entry_fee?: number | null
          id?: string
          max_participants?: number | null
          organizer_id?: string | null
          prize_distribution?: Json | null
          prize_pool?: number | null
          refund_policy?: string | null
          registration_deadline?: string | null
          sport: string
          start_date: string
          status?: string | null
          title: string
          total_collected?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          arena_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          entry_fee?: number | null
          id?: string
          max_participants?: number | null
          organizer_id?: string | null
          prize_distribution?: Json | null
          prize_pool?: number | null
          refund_policy?: string | null
          registration_deadline?: string | null
          sport?: string
          start_date?: string
          status?: string | null
          title?: string
          total_collected?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_arena_id_fkey"
            columns: ["arena_id"]
            isOneToOne: false
            referencedRelation: "arenas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          host_id: string | null
          id: string
          metadata: Json | null
          net_amount: number | null
          status: string | null
          stripe_fee: number | null
          stripe_id: string | null
          subscription_id: string | null
          tournament_id: string | null
          transaction_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          host_id?: string | null
          id?: string
          metadata?: Json | null
          net_amount?: number | null
          status?: string | null
          stripe_fee?: number | null
          stripe_id?: string | null
          subscription_id?: string | null
          tournament_id?: string | null
          transaction_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          host_id?: string | null
          id?: string
          metadata?: Json | null
          net_amount?: number | null
          status?: string | null
          stripe_fee?: number | null
          stripe_id?: string | null
          subscription_id?: string | null
          tournament_id?: string | null
          transaction_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenges: {
        Row: {
          challenge_id: string
          completed: boolean | null
          completed_at: string | null
          id: string
          progress: number | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          progress?: number | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          progress?: number | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consents: {
        Row: {
          consent_type: string
          created_at: string | null
          granted: boolean | null
          granted_at: string | null
          id: string
          ip_address: string | null
          revoked_at: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          consent_type: string
          created_at?: string | null
          granted?: boolean | null
          granted_at?: string | null
          id?: string
          ip_address?: string | null
          revoked_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          consent_type?: string
          created_at?: string | null
          granted?: boolean | null
          granted_at?: string | null
          id?: string
          ip_address?: string | null
          revoked_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_consents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_consents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_id: string | null
          device_name: string | null
          device_type: string | null
          expires_at: string | null
          id: string
          ip_address: string | null
          is_current: boolean | null
          last_active_at: string | null
          location: string | null
          platform: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_id?: string | null
          device_name?: string | null
          device_type?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          is_current?: boolean | null
          last_active_at?: string | null
          location?: string | null
          platform?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_id?: string | null
          device_name?: string | null
          device_type?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          is_current?: boolean | null
          last_active_at?: string | null
          location?: string | null
          platform?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_logs: {
        Row: {
          attempts: number | null
          code: string
          created_at: string | null
          expires_at: string
          id: string
          phone: string
          user_id: string | null
          verified: boolean | null
          verified_at: string | null
        }
        Insert: {
          attempts?: number | null
          code: string
          created_at?: string | null
          expires_at: string
          id?: string
          phone: string
          user_id?: string | null
          verified?: boolean | null
          verified_at?: string | null
        }
        Update: {
          attempts?: number | null
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          phone?: string
          user_id?: string | null
          verified?: boolean | null
          verified_at?: string | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number | null
          balance_before: number | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          balance_after?: number | null
          balance_before?: number | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          balance_after?: number | null
          balance_before?: number | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          error: string | null
          event_type: string | null
          headers: Json | null
          id: string
          ip_address: string | null
          payload: Json | null
          processing_time_ms: number | null
          response_body: string | null
          response_status: number | null
          source: string | null
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          event_type?: string | null
          headers?: Json | null
          id?: string
          ip_address?: string | null
          payload?: Json | null
          processing_time_ms?: number | null
          response_body?: string | null
          response_status?: number | null
          source?: string | null
        }
        Update: {
          created_at?: string | null
          error?: string | null
          event_type?: string | null
          headers?: Json | null
          id?: string
          ip_address?: string | null
          payload?: Json | null
          processing_time_ms?: number | null
          response_body?: string | null
          response_status?: number | null
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      analytics_summary: {
        Row: {
          event_date: string | null
          event_name: string | null
          total_count: number | null
          unique_users: number | null
        }
        Relationships: []
      }
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      nearby_matches: {
        Row: {
          court_address: string | null
          court_id: string | null
          court_lat: number | null
          court_lon: number | null
          court_name: string | null
          created_at: string | null
          current_players: number | null
          date: string | null
          description: string | null
          end_time: string | null
          id: string | null
          is_private: boolean | null
          is_public: boolean | null
          level: string | null
          location_address: string | null
          location_name: string | null
          max_players: number | null
          organizer_id: string | null
          photo_url: string | null
          player1_id: string | null
          requires_approval: boolean | null
          score: Json | null
          score_final: string | null
          sport: string | null
          start_time: string | null
          status: string | null
          time: string | null
          title: string | null
          type: string | null
          updated_at: string | null
          venue: string | null
          winner_team: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "weekly_ranking"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_ranking: {
        Row: {
          avatar_url: string | null
          id: string | null
          name: string | null
          position: number | null
          weekly_matches: number | null
          weekly_points: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      calculate_distance_km: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      calculate_host_earnings: {
        Args: {
          p_booking_id: string
          p_gross_amount: number
          p_host_id: string
        }
        Returns: number
      }
      cleanup_old_analytics: { Args: never; Returns: number }
      delete_user_data: { Args: { p_user_id: string }; Returns: Json }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      export_user_data: { Args: { p_user_id: string }; Returns: Json }
      generate_invoice_number: { Args: never; Returns: string }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      gettransactionid: { Args: never; Returns: unknown }
      join_match: {
        Args: { p_match_id: string; p_user_id: string }
        Returns: boolean
      }
      longtransactionsenabled: { Args: never; Returns: boolean }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      revoke_all_user_consents: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      match_status: "scheduled" | "live" | "finished" | "cancelled"
      payment_status:
        | "pending"
        | "processing"
        | "paid"
        | "failed"
        | "refunded"
        | "cancelled"
      payout_status: "pending" | "processing" | "paid" | "failed"
      service_category:
        | "personal_trainer"
        | "sports_coach"
        | "nutritionist"
        | "physiotherapist"
        | "masseuse"
      subscription_status: "free" | "pro" | "cancelled"
      subscription_tier: "free" | "premium" | "pro"
      transaction_type:
        | "booking_payment"
        | "subscription_payment"
        | "tournament_entry"
        | "refund"
        | "payout"
        | "credit"
        | "debit"
      user_role: "player" | "host" | "admin"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      match_status: ["scheduled", "live", "finished", "cancelled"],
      payment_status: [
        "pending",
        "processing",
        "paid",
        "failed",
        "refunded",
        "cancelled",
      ],
      payout_status: ["pending", "processing", "paid", "failed"],
      service_category: [
        "personal_trainer",
        "sports_coach",
        "nutritionist",
        "physiotherapist",
        "masseuse",
      ],
      subscription_status: ["free", "pro", "cancelled"],
      subscription_tier: ["free", "premium", "pro"],
      transaction_type: [
        "booking_payment",
        "subscription_payment",
        "tournament_entry",
        "refund",
        "payout",
        "credit",
        "debit",
      ],
      user_role: ["player", "host", "admin"],
    },
  },
} as const
