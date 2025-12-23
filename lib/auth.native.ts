import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from './supabase';
import { logger } from '../utils/logger';

// Conditional import for Google Sign-In (native module may not be available in dev)
let GoogleSignin: any = null;
let statusCodes: any = {};
let isErrorWithCode: any = () => false;
let IS_GOOGLE_SIGNIN_AVAILABLE = false;

try {
  const GoogleSigninModule = require('@react-native-google-signin/google-signin');
  GoogleSignin = GoogleSigninModule.GoogleSignin;
  statusCodes = GoogleSigninModule.statusCodes;
  isErrorWithCode = GoogleSigninModule.isErrorWithCode;
  IS_GOOGLE_SIGNIN_AVAILABLE = true;

  // Configure Google Sign-In only if available
  GoogleSignin.configure({
    scopes: ['email', 'profile'],
    webClientId: '138959893910-6910pim9b6v1r6dsism9suthh65u5p2o.apps.googleusercontent.com',
    iosClientId: '138959893910-tk4vdvs4iqm64mbmcqt6cpqk6hv4e3ai.apps.googleusercontent.com',
  });
} catch {
  logger.log('[Auth] Google Sign-In native module not available');
}

export interface AuthResult {
  success: boolean;
  error?: string;
  userId?: string;
}

/**
 * Sign in with Google (Native)
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  if (!IS_GOOGLE_SIGNIN_AVAILABLE || !GoogleSignin) {
    return {
      success: false,
      error: 'Google Sign-In não está disponível neste build',
    };
  }

  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    // Check if idToken is present (it should be if webClientId is configured)
    if (userInfo.data?.idToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: userInfo.data.idToken,
      });

      if (error) throw error;

      return {
        success: true,
        userId: data.user?.id,
      };
    } else {
      throw new Error('No ID token present');
    }
  } catch (error: any) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          return { success: false, error: 'Login cancelado pelo usuário' };
        case statusCodes.IN_PROGRESS:
          return { success: false, error: 'Login já está em andamento' };
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          return { success: false, error: 'Google Play Services não disponível' };
        default:
          logger.error('[Auth] Google sign in error:', error);
          return { success: false, error: 'Falha no login com Google' };
      }
    } else {
      logger.error('[Auth] Google sign in error:', error);
      return { success: false, error: error.message || 'Falha no login com Google' };
    }
  }
}

/**
 * Sign in with Apple (Native)
 */
export async function signInWithApple(): Promise<AuthResult> {
  try {
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        error: 'Apple Sign In não está disponível neste dispositivo',
      };
    }

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (credential.identityToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (error) throw error;

      // Update user profile with name if provided by Apple (only on first login)
      if (credential.fullName && data.user) {
        const fullName = [
          credential.fullName.givenName,
          credential.fullName.familyName,
        ]
          .filter(Boolean)
          .join(' ');

        if (fullName) {
          // It's safe to cast here as we know 'profiles' table exists
          await (supabase
            .from('profiles') as any)
            .update({ name: fullName })
            .eq('id', data.user.id);
        }
      }

      return {
        success: true,
        userId: data.user?.id,
      };
    }

    return {
      success: false,
      error: 'Token de identidade não recebido',
    };
  } catch (error: any) {
    if (error.code === 'ERR_CANCELED') {
      return {
        success: false,
        error: 'Login cancelado pelo usuário',
      };
    }

    logger.error('[Auth] Apple sign in error:', error);
    return {
      success: false,
      error: error.message || 'Falha no login com Apple',
    };
  }
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

    // Handle specific error messages
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

    // Check if email confirmation is required
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

    // Handle specific error messages
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
      redirectTo: 'kourt://auth/reset-password',
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
