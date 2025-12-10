import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Auth from '../lib/auth';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

// Create a cross-platform storage adapter
const createStorage = (): StateStorage => {
  if (Platform.OS === 'web') {
    // Use localStorage on web
    return {
      getItem: (name: string) => {
        const value = localStorage.getItem(name);
        return value ?? null;
      },
      setItem: (name: string, value: string) => {
        localStorage.setItem(name, value);
      },
      removeItem: (name: string) => {
        localStorage.removeItem(name);
      },
    };
  }
  // Use AsyncStorage on native
  return {
    getItem: async (name: string) => {
      const value = await AsyncStorage.getItem(name);
      return value ?? null;
    },
    setItem: async (name: string, value: string) => {
      await AsyncStorage.setItem(name, value);
    },
    removeItem: async (name: string) => {
      await AsyncStorage.removeItem(name);
    },
  };
};

const storage = createStorage();

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  level: string | null;
  favorite_sports: string[] | null;
  location: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  // State
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithApple: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  updateAvatar: (uri: string) => Promise<{ success: boolean; error?: string }>;
  refreshSession: () => Promise<void>;
  setSession: (session: Session | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      session: null,
      user: null,
      profile: null,
      isLoading: true,
      isInitialized: false,
      error: null,

      // Initialize auth
      initialize: async () => {
        try {
          set({ isLoading: true, error: null });

          // Get current session
          const session = await Auth.getSession();

          if (session) {
            // Fetch user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            set({
              session,
              user: session.user,
              profile,
              isLoading: false,
              isInitialized: true,
            });
          } else {
            set({
              session: null,
              user: null,
              profile: null,
              isLoading: false,
              isInitialized: true,
            });
          }

          // Set up auth state listener
          Auth.onAuthStateChange(async (event: string, session: Session | null) => {
            if (event === 'SIGNED_IN' && session) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              set({
                session,
                user: session.user,
                profile,
              });
            } else if (event === 'SIGNED_OUT') {
              set({
                session: null,
                user: null,
                profile: null,
              });
            } else if (event === 'TOKEN_REFRESHED' && session) {
              set({ session });
            }
          });
        } catch (error: any) {
          console.error('Auth initialization error:', error);
          set({
            error: error.message,
            isLoading: false,
            isInitialized: true,
          });
        }
      },

      // Sign in with email
      signInWithEmail: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        const result = await Auth.signInWithEmail(email, password);

        if (result.success) {
          // Session will be updated by the auth state listener
          set({ isLoading: false });
          return { success: true };
        } else {
          set({ isLoading: false, error: result.error });
          return { success: false, error: result.error };
        }
      },

      // Sign up with email
      signUpWithEmail: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });

        const result = await Auth.signUpWithEmail(email, password, name);

        if (result.success) {
          set({ isLoading: false });
          return { success: true, error: result.error }; // May have confirmation message
        } else {
          set({ isLoading: false, error: result.error });
          return { success: false, error: result.error };
        }
      },

      // Sign in with Google
      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });

        const result = await Auth.signInWithGoogle();

        if (result.success) {
          set({ isLoading: false });
          return { success: true };
        } else {
          set({ isLoading: false, error: result.error });
          return { success: false, error: result.error };
        }
      },

      // Sign in with Apple
      signInWithApple: async () => {
        set({ isLoading: true, error: null });

        const result = await Auth.signInWithApple();

        if (result.success) {
          set({ isLoading: false });
          return { success: true };
        } else {
          set({ isLoading: false, error: result.error });
          return { success: false, error: result.error };
        }
      },

      // Sign out
      signOut: async () => {
        set({ isLoading: true });
        await Auth.signOut();
        set({
          session: null,
          user: null,
          profile: null,
          isLoading: false,
        });
      },

      // Reset password
      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });

        const result = await Auth.sendPasswordResetEmail(email);

        set({ isLoading: false });
        if (!result.success) {
          set({ error: result.error });
        }

        return result;
      },

      // Update profile
      updateProfile: async (updates: Partial<Profile>) => {
        const { user } = get();
        if (!user) return { success: false, error: 'Not authenticated' };

        set({ isLoading: true, error: null });

        try {
          const { data, error } = await (supabase
            .from('profiles') as any)
            .update({
              ...updates,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
            .select()
            .single();

          if (error) throw error;

          set({ profile: data, isLoading: false });
          return { success: true };
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Update avatar
      updateAvatar: async (uri: string) => {
        const { user } = get();
        if (!user) return { success: false, error: 'Not authenticated' };

        set({ isLoading: true, error: null });

        try {
          // Upload to Supabase storage
          const fileName = `${user.id}-${Date.now()}.jpg`;
          const response = await fetch(uri);
          const blob = await response.blob();

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, blob, {
              cacheControl: '3600',
              upsert: true,
            });

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

          // Update profile
          const { data, error: updateError } = await (supabase
            .from('profiles') as any)
            .update({
              avatar_url: urlData.publicUrl,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
            .select()
            .single();

          if (updateError) throw updateError;

          set({ profile: data, isLoading: false });
          return { success: true };
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      // Refresh session
      refreshSession: async () => {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (error) throw error;
          if (data.session) {
            set({ session: data.session });
          }
        } catch (error: any) {
          console.error('Session refresh error:', error);
        }
      },

      // Set session (for OAuth callback)
      setSession: (session: Session | null) => {
        if (session) {
          set({ session, user: session.user });
        } else {
          set({ session: null, user: null, profile: null });
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'kourt-auth-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        // Only persist essential data
        profile: state.profile,
      }),
    }
  )
);

export default useAuthStore;
