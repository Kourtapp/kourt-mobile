import { useState, useCallback, useEffect } from 'react';
import * as Stripe from '../lib/stripe';

export type PaymentMethod = 'pix' | 'credit' | 'debit';

interface CardDetails {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

interface UsePaymentOptions {
  amount: number; // in reais
  courtId: string;
  bookingId: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

interface UsePaymentReturn {
  // Card payment
  cardDetails: CardDetails;
  setCardNumber: (value: string) => void;
  setCardName: (value: string) => void;
  setCardExpiry: (value: string) => void;
  setCardCvv: (value: string) => void;
  cardBrand: string;
  isCardValid: boolean;

  // PIX payment
  pixCode: string | null;
  pixQrUrl: string | null;
  pixExpiresAt: Date | null;
  pixCountdown: number;
  generatePixCode: () => Promise<void>;

  // Status
  loading: boolean;
  error: string | null;

  // Actions
  processPayment: (method: PaymentMethod) => Promise<boolean>;
  checkPaymentStatus: () => Promise<'pending' | 'paid' | 'expired'>;
}

export function usePayment({
  amount,
  courtId,
  bookingId,
  onSuccess,
  onError,
}: UsePaymentOptions): UsePaymentReturn {
  // Card state
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  // PIX state
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [pixQrUrl, setPixQrUrl] = useState<string | null>(null);
  const [pixExpiresAt, setPixExpiresAt] = useState<Date | null>(null);
  const [pixCountdown, setPixCountdown] = useState(15 * 60);

  // General state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // Card brand detection
  const cardBrand = Stripe.detectCardBrand(cardDetails.number);

  // Card validation
  const isCardValid =
    Stripe.validateCardNumber(cardDetails.number) &&
    cardDetails.name.trim().length > 2 &&
    cardDetails.expiry.length === 5 &&
    Stripe.parseExpiry(cardDetails.expiry) !== null &&
    cardDetails.cvv.length >= 3;

  // Card setters with formatting
  const setCardNumber = useCallback((value: string) => {
    setCardDetails((prev) => ({
      ...prev,
      number: Stripe.formatCardNumber(value),
    }));
  }, []);

  const setCardName = useCallback((value: string) => {
    setCardDetails((prev) => ({
      ...prev,
      name: value.toUpperCase(),
    }));
  }, []);

  const setCardExpiry = useCallback((value: string) => {
    setCardDetails((prev) => ({
      ...prev,
      expiry: Stripe.formatExpiry(value),
    }));
  }, []);

  const setCardCvv = useCallback((value: string) => {
    setCardDetails((prev) => ({
      ...prev,
      cvv: value.replace(/\D/g, '').substring(0, 4),
    }));
  }, []);

  // PIX countdown
  useEffect(() => {
    if (!pixExpiresAt) return;

    const timer = setInterval(() => {
      const now = new Date();
      const remaining = Math.max(
        0,
        Math.floor((pixExpiresAt.getTime() - now.getTime()) / 1000)
      );
      setPixCountdown(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [pixExpiresAt]);

  // Generate PIX code
  const generatePixCode = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await Stripe.createPixPayment({
        amount: Math.round(amount * 100), // Convert to cents
        courtId,
        bookingId,
      });

      setPixCode(result.pixCode);
      setPixQrUrl(result.qrCodeUrl);
      setPixExpiresAt(result.expiresAt);
      setPixCountdown(
        Math.floor((result.expiresAt.getTime() - Date.now()) / 1000)
      );
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to generate PIX code';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [amount, courtId, bookingId, onError]);

  // Process payment
  const processPayment = useCallback(
    async (method: PaymentMethod): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        if (method === 'pix') {
          // For PIX, we just check if payment was received
          const status = await Stripe.checkPixPaymentStatus(paymentId || '');
          if (status.status === 'paid') {
            onSuccess?.(paymentId || '');
            return true;
          } else if (status.status === 'expired') {
            throw new Error('PIX payment expired');
          }
          return false;
        } else {
          // Card payment
          const expiryParsed = Stripe.parseExpiry(cardDetails.expiry);
          if (!expiryParsed) {
            throw new Error('Invalid expiry date');
          }

          // First create payment intent
          const { clientSecret } = await Stripe.createPaymentIntent({
            amount: Math.round(amount * 100),
            courtId,
            bookingId,
          });

          // Then confirm the payment
          const result = await Stripe.confirmCardPayment(clientSecret, {
            number: cardDetails.number.replace(/\s/g, ''),
            expMonth: expiryParsed.month,
            expYear: expiryParsed.year,
            cvc: cardDetails.cvv,
            name: cardDetails.name,
          });

          if (result.success) {
            setPaymentId(result.paymentIntentId || null);
            onSuccess?.(result.paymentIntentId || '');
            return true;
          } else {
            throw new Error(result.error || 'Payment failed');
          }
        }
      } catch (err: any) {
        const errorMsg = err.message || 'Payment failed';
        setError(errorMsg);
        onError?.(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [
      cardDetails,
      amount,
      courtId,
      bookingId,
      paymentId,
      onSuccess,
      onError,
    ]
  );

  // Check payment status (for PIX polling)
  const checkPaymentStatus = useCallback(async () => {
    if (!paymentId) return 'pending' as const;

    try {
      const result = await Stripe.checkPixPaymentStatus(paymentId);
      if (result.status === 'paid') {
        onSuccess?.(paymentId);
      }
      return result.status;
    } catch {
      return 'pending' as const;
    }
  }, [paymentId, onSuccess]);

  return {
    // Card
    cardDetails,
    setCardNumber,
    setCardName,
    setCardExpiry,
    setCardCvv,
    cardBrand,
    isCardValid,

    // PIX
    pixCode,
    pixQrUrl,
    pixExpiresAt,
    pixCountdown,
    generatePixCode,

    // Status
    loading,
    error,

    // Actions
    processPayment,
    checkPaymentStatus,
  };
}

export default usePayment;
