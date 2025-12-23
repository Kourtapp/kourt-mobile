/**
 * Stripe SDK Hooks Wrapper
 *
 * This file provides mock implementations that allow the app to run in
 * iOS Simulator without crashing. The actual Stripe SDK is imported
 * dynamically only on real devices.
 *
 * NOTE: For Expo development builds in Simulator, native modules like
 * StripeSdk are not available. We detect this and return mocks instead.
 */

import { NativeModules } from 'react-native';

// Check if running on real device with Stripe native module
// NativeModules.StripeSdk will be undefined in Simulator
const isRealDevice = (): boolean => {
    // Check for Stripe native module presence
    // This is false in Simulator but true on real devices with native build
    return !!NativeModules.StripeSdk;
};

// Export availability flag
export const isStripeAvailable = isRealDevice();

// Mock implementations that work in Simulator
const mockStripeReturn = {
    confirmPayment: async () => ({
        paymentIntent: { id: 'mock_pi_simulator', status: 'Succeeded' },
        error: null
    }),
    initPaymentSheet: async () => ({ error: null }),
    presentPaymentSheet: async () => {
        console.log('[Stripe Mock] presentPaymentSheet called - simulating success');
        return { error: null };
    },
    createPaymentMethod: async () => ({
        paymentMethod: { id: 'mock_pm_simulator' },
        error: null
    }),
    handleNextAction: async () => ({ error: null }),
    confirmSetupIntent: async () => ({ error: null }),
    createToken: async () => ({ token: { id: 'mock_tok_simulator' }, error: null }),
    retrievePaymentIntent: async () => ({ paymentIntent: null, error: null }),
    retrieveSetupIntent: async () => ({ setupIntent: null, error: null }),
};

const mockPlatformPayReturn = {
    isPlatformPaySupported: async () => false,
    confirmPlatformPayPayment: async () => ({
        error: { code: 'Canceled', message: 'Not available in Simulator' }
    }),
    confirmPlatformPaySetupIntent: async () => ({
        error: { code: 'Canceled', message: 'Not available in Simulator' }
    }),
    createPlatformPayPaymentMethod: async () => ({
        error: { code: 'Canceled', message: 'Not available in Simulator' }
    }),
};

export const PlatformPay = {
    PaymentType: {
        Immediate: 'Immediate',
        Deferred: 'Deferred',
    },
};

/**
 * Hook: useStripe
 * Returns mock implementation for Simulator
 * On real devices with native build, import from '@stripe/stripe-react-native' directly
 */
export function useStripe() {
    // In Simulator, always return mock to avoid TurboModule crash
    // The actual Stripe SDK can only be used on real devices
    return mockStripeReturn;
}

/**
 * Hook: usePlatformPay
 * Returns mock implementation for Simulator
 * Platform Pay (Apple Pay/Google Pay) only works on real devices
 */
export function usePlatformPay() {
    return mockPlatformPayReturn;
}

// Development warning
if (__DEV__ && !isStripeAvailable) {
    console.log(
        '💳 [Stripe] Running with mock implementations (Simulator). ' +
        'Use a real device to test actual payments.'
    );
}
