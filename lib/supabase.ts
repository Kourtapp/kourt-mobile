import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import { logger } from '../utils/logger';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  logger.warn('[Supabase] Configuration missing. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

// Cross-platform storage adapter for Supabase auth
const authStorage = Platform.OS === 'web'
  ? {
    getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
    setItem: (key: string, value: string) => {
      localStorage.setItem(key, value);
      return Promise.resolve();
    },
    removeItem: (key: string) => {
      localStorage.removeItem(key);
      return Promise.resolve();
    },
  }
  : AsyncStorage;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});

// Helper to get typed tables
export const db = {
  profiles: () => supabase.from('profiles'),
  courts: () => supabase.from('courts'),
  bookings: () => supabase.from('bookings'),
  booking_players: () => supabase.from('booking_players'),
  reviews: () => supabase.from('reviews'),
  conversations: () => supabase.from('conversations'),
  conversation_participants: () => supabase.from('conversation_participants'),
  messages: () => supabase.from('messages'),
  friendships: () => supabase.from('friendships'),
  notifications: () => supabase.from('notifications'),
  push_tokens: () => supabase.from('push_tokens'),
  rankings: () => supabase.from('rankings'),
  favorites: () => supabase.from('favorites'),
  matches: () => supabase.from('matches'),
  match_players: () => supabase.from('match_players'),
};

// Realtime subscriptions helper
export function subscribeToChannel(
  channelName: string,
  table: string,
  filter: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
        filter,
      },
      callback
    )
    .subscribe();
}

// Storage helpers
export const storage = {
  avatars: supabase.storage.from('avatars'),
  courtImages: supabase.storage.from('court-images'),
  messageAttachments: supabase.storage.from('message-attachments'),
};

// Upload file helper
export async function uploadFile(
  bucket: 'avatars' | 'court-images' | 'message-attachments',
  path: string,
  file: Blob | File,
  options?: { cacheControl?: string; upsert?: boolean }
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      upsert: options?.upsert || false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

  return {
    path: data.path,
    publicUrl: urlData.publicUrl,
  };
}

// Delete file helper
export async function deleteFile(
  bucket: 'avatars' | 'court-images' | 'message-attachments',
  paths: string[]
) {
  const { error } = await supabase.storage.from(bucket).remove(paths);
  if (error) throw error;
}

export default supabase;
