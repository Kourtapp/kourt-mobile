// Web version of auth - without Apple Authentication
import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase';
import { logger } from '../utils/logger';

// Configure WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

export interface AuthResult {
  success: boolean;
  error?: string;
  userId?: string;
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : 'kourt://auth/callback',
        skipBrowserRedirect: false,
      },
    });

    if (error) throw error;

    // On web, the OAuth flow redirects automatically
    return {
      success: true,
    };
  } catch (error: any) {
    logger.error('[Auth] Google sign in error:', error);
    return {
      success: false,
      error: error.message || 'Google sign in failed',
    };
  }
}

/**
 * Sign in with Apple - Not available on web
 */
export async function signInWithApple(): Promise<AuthResult> {
  return {
    success: false,
    error: 'Apple Sign In is not available on web',
  };
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return {
      success: true,
      userId: data.user?.id,
    };
  } catch (error: any) {
    logger.error('[Auth] Email sign in error:', error);

    if (error.message.includes('Invalid login credentials')) {
      return {
        success: false,
        error: 'Email ou senha incorretos',
      };
    }

    return {
      success: false,
      error: error.message || 'Email sign in failed',
    };
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;

    if (data.user && !data.session) {
      return {
        success: true,
        error: 'Please check your email to confirm your account',
        userId: data.user.id,
      };
    }

    return {
      success: true,
      userId: data.user?.id,
    };
  } catch (error: any) {
    logger.error('[Auth] Email sign up error:', error);

    if (error.message.includes('already registered')) {
      return {
        success: false,
        error: 'Este email já está cadastrado',
      };
    }

    if (error.message.includes('Password should be')) {
      return {
        success: false,
        error: 'A senha deve ter pelo menos 6 caracteres',
      };
    }

    return {
      success: false,
      error: error.message || 'Sign up failed',
    };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined'
        ? `${window.location.origin}/auth/reset-password`
        : 'kourt://auth/reset-password',
    });

    if (error) throw error;

    return {
      success: true,
    };
  } catch (error: any) {
    logger.error('[Auth] Password reset error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send reset email',
    };
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return {
      success: true,
    };
  } catch (error: any) {
    logger.error('[Auth] Update password error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update password',
    };
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return {
      success: true,
    };
  } catch (error: any) {
    logger.error('[Auth] Sign out error:', error);
    return {
      success: false,
      error: error.message || 'Failed to sign out',
    };
  }
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    return data.session;
  } catch (error) {
    logger.error('[Auth] Get session error:', error);
    return null;
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;

    return data.user;
  } catch (error) {
    logger.error('[Auth] Get user error:', error);
    return null;
  }
}

/**
 * Handle OAuth callback URL
 */
export async function handleAuthCallback(url: string): Promise<AuthResult> {
  try {
    const parsedUrl = new URL(url);
    const params = new URLSearchParams(parsedUrl.hash.substring(1));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const error = params.get('error');
    const errorDescription = params.get('error_description');

    if (error) {
      return {
        success: false,
        error: errorDescription || error,
      };
    }

    if (accessToken && refreshToken) {
      const { data, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) throw sessionError;

      return {
        success: true,
        userId: data.user?.id,
      };
    }

    return {
      success: false,
      error: 'No tokens found in callback URL',
    };
  } catch (error: any) {
    logger.error('[Auth] Auth callback error:', error);
    return {
      success: false,
      error: error.message || 'Failed to handle auth callback',
    };
  }
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

export default {
  signInWithGoogle,
  signInWithApple,
  signInWithEmail,
  signUpWithEmail,
  sendPasswordResetEmail,
  updatePassword,
  signOut,
  getSession,
  getCurrentUser,
  handleAuthCallback,
  onAuthStateChange,
};
