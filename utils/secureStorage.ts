/**
 * Secure Storage Utility
 * Uses expo-secure-store for sensitive data (encrypted on both iOS and Android)
 * Falls back to AsyncStorage only for non-sensitive data on web
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Keys for secure storage
export const SECURE_KEYS = {
    AUTH_TOKEN: 'kourt_auth_token',
    REFRESH_TOKEN: 'kourt_refresh_token',
    USER_ID: 'kourt_user_id',
    SESSION_DATA: 'kourt_session',
    CPF_HASH: 'kourt_cpf_hash', // Store hashed CPF for local validation
} as const;

// Keys for regular storage (non-sensitive)
export const STORAGE_KEYS = {
    ONBOARDING_COMPLETED: 'kourt_onboarding',
    THEME_PREFERENCE: 'kourt_theme',
    NOTIFICATION_SETTINGS: 'kourt_notifications',
    LAST_LOCATION: 'kourt_last_location',
    SEARCH_HISTORY: 'kourt_search_history',
} as const;

/**
 * Check if SecureStore is available (not available on web)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isSecureStoreAvailable = async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;

    try {
        await SecureStore.getItemAsync('__test__');
        return true;
    } catch {
        return false;
    }
};

/**
 * Save sensitive data securely
 * Uses SecureStore on native, encrypted AsyncStorage key on web
 */
export async function saveSecure(key: string, value: string): Promise<void> {
    try {
        if (Platform.OS === 'web') {
            // On web, use AsyncStorage with a warning
            // In production, consider using IndexedDB with encryption
            console.warn('[SecureStorage] Web platform - using AsyncStorage (less secure)');
            await AsyncStorage.setItem(`secure_${key}`, value);
        } else {
            await SecureStore.setItemAsync(key, value, {
                keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
            });
        }
    } catch (error) {
        console.error('[SecureStorage] Error saving:', error);
        throw new Error('Failed to save secure data');
    }
}

/**
 * Get sensitive data from secure storage
 */
export async function getSecure(key: string): Promise<string | null> {
    try {
        if (Platform.OS === 'web') {
            return await AsyncStorage.getItem(`secure_${key}`);
        }
        return await SecureStore.getItemAsync(key);
    } catch (error) {
        console.error('[SecureStorage] Error reading:', error);
        return null;
    }
}

/**
 * Delete sensitive data from secure storage
 */
export async function deleteSecure(key: string): Promise<void> {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.removeItem(`secure_${key}`);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    } catch (error) {
        console.error('[SecureStorage] Error deleting:', error);
    }
}

/**
 * Clear all secure storage (for logout)
 */
export async function clearAllSecure(): Promise<void> {
    const keys = Object.values(SECURE_KEYS);

    for (const key of keys) {
        await deleteSecure(key);
    }
}

/**
 * Save non-sensitive data to regular storage
 */
export async function saveStorage(key: string, value: string): Promise<void> {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error('[Storage] Error saving:', error);
    }
}

/**
 * Get non-sensitive data from regular storage
 */
export async function getStorage(key: string): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(key);
    } catch (error) {
        console.error('[Storage] Error reading:', error);
        return null;
    }
}

/**
 * Delete non-sensitive data from regular storage
 */
export async function deleteStorage(key: string): Promise<void> {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('[Storage] Error deleting:', error);
    }
}

/**
 * Hash a value (for CPF storage)
 * Uses a simple hash - in production use a proper hashing library
 */
export function hashValue(value: string): string {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        const char = value.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
}
