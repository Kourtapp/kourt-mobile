// Stripe payment utilities
import { logger } from '../utils/logger';

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// Types
export interface PaymentIntentParams {
  amount: number; // in cents
  currency?: string;
  courtId: string;
  bookingId: string;
  customerEmail?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'pix';
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

// Mock API URL - replace with your actual backend
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.kourt.app';

/**
 * Initialize Stripe
 * Should be called at app startup
 */
export async function initializeStripe(): Promise<void> {
  // In production, this would initialize the Stripe SDK
  // For now, we just validate the key exists
  if (!STRIPE_PUBLISHABLE_KEY) {
    logger.warn('[Stripe] Publishable key not configured');
  }
}

/**
 * Create a payment intent on the backend
 */
export async function createPaymentIntent(
  params: PaymentIntentParams
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  try {
    const response = await fetch(`${API_URL}/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency || 'brl',
        courtId: params.courtId,
        bookingId: params.bookingId,
        customerEmail: params.customerEmail,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const data = await response.json();
    return {
      clientSecret: data.clientSecret,
      paymentIntentId: data.paymentIntentId,
    };
  } catch (error) {
    logger.error('[Stripe] Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Confirm card payment
 * In production, this uses Stripe SDK
 */
export async function confirmCardPayment(
  clientSecret: string,
  cardDetails: {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
    name: string;
  }
): Promise<PaymentResult> {
  try {
    // In production, this would use:
    // const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
    //   payment_method: {
    //     card: elements.getElement(CardElement),
    //     billing_details: { name: cardDetails.name },
    //   },
    // });

    // For development, simulate success
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate validation
    if (cardDetails.number.replace(/\s/g, '').length !== 16) {
      return {
        success: false,
        error: 'Invalid card number',
      };
    }

    return {
      success: true,
      paymentIntentId: `pi_${Date.now()}`,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Payment failed',
    };
  }
}

/**
 * Create PIX payment
 */
export async function createPixPayment(params: PaymentIntentParams): Promise<{
  pixCode: string;
  qrCodeUrl: string;
  expiresAt: Date;
}> {
  try {
    const response = await fetch(`${API_URL}/payments/create-pix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: params.amount,
        courtId: params.courtId,
        bookingId: params.bookingId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create PIX payment');
    }

    const data = await response.json();
    return {
      pixCode: data.pixCode,
      qrCodeUrl: data.qrCodeUrl,
      expiresAt: new Date(data.expiresAt),
    };
  } catch {
    // Return mock data for development
    return {
      pixCode: `00020126580014BR.GOV.BCB.PIX0136${Date.now()}520400005303986540${(params.amount / 100).toFixed(2)}5802BR5925KOURT ESPORTES LTDA6009SAO PAULO62070503***6304`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${Date.now()}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    };
  }
}

/**
 * Check PIX payment status
 */
export async function checkPixPaymentStatus(
  paymentId: string
): Promise<{ status: 'pending' | 'paid' | 'expired' }> {
  try {
    const response = await fetch(`${API_URL}/payments/pix-status/${paymentId}`);

    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }

    const data = await response.json();
    return { status: data.status };
  } catch {
    // For development, simulate status check
    return { status: 'pending' };
  }
}

/**
 * Get saved payment methods for a customer
 */
export async function getSavedPaymentMethods(
  customerId: string
): Promise<PaymentMethod[]> {
  try {
    const response = await fetch(`${API_URL}/payments/methods/${customerId}`);

    if (!response.ok) {
      throw new Error('Failed to get payment methods');
    }

    const data = await response.json();
    return data.paymentMethods;
  } catch {
    // Return empty for development
    return [];
  }
}

/**
 * Save a new payment method
 */
export async function savePaymentMethod(
  customerId: string,
  cardDetails: {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  }
): Promise<PaymentMethod> {
  try {
    const response = await fetch(`${API_URL}/payments/methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        card: cardDetails,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save payment method');
    }

    const data = await response.json();
    return data.paymentMethod;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a saved payment method
 */
export async function deletePaymentMethod(paymentMethodId: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/payments/methods/${paymentMethodId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete payment method');
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Process refund
 */
export async function processRefund(
  paymentIntentId: string,
  amount?: number // partial refund amount in cents
): Promise<{ success: boolean; refundId?: string; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/payments/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentIntentId,
        amount,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to process refund');
    }

    const data = await response.json();
    return {
      success: true,
      refundId: data.refundId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Refund failed',
    };
  }
}

/**
 * Validate card number using Luhn algorithm
 */
export function validateCardNumber(number: string): boolean {
  const digits = number.replace(/\s/g, '').split('').map(Number);
  if (digits.length !== 16) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Detect card brand from number
 */
export function detectCardBrand(number: string): string {
  const cleanNumber = number.replace(/\s/g, '');

  if (/^4/.test(cleanNumber)) return 'visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
  if (/^(?:636368|438935|504175|451416|636297)/.test(cleanNumber)) return 'elo';
  if (/^(606282|3841)/.test(cleanNumber)) return 'hipercard';

  return 'unknown';
}

/**
 * Format card number with spaces
 */
export function formatCardNumber(number: string): string {
  const cleaned = number.replace(/\D/g, '');
  const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  return formatted.substring(0, 19);
}

/**
 * Format expiry date
 */
export function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
  }
  return cleaned;
}

/**
 * Parse expiry to month and year
 */
export function parseExpiry(expiry: string): { month: number; year: number } | null {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return null;

  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);

  if (month < 1 || month > 12) return null;
  if (year < new Date().getFullYear()) return null;

  return { month, year };
}

export default {
  initializeStripe,
  createPaymentIntent,
  confirmCardPayment,
  createPixPayment,
  checkPixPaymentStatus,
  getSavedPaymentMethods,
  savePaymentMethod,
  deletePaymentMethod,
  processRefund,
  validateCardNumber,
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  parseExpiry,
};
