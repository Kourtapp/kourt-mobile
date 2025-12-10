import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  CreditCard,
  Copy,
  Check,
  Clock,
  QrCode,
} from 'lucide-react-native';
import { Colors } from '../constants';
import { Button, Card, IconButton } from '../components/ui';

export default function PaymentScreen() {
  const router = useRouter();
  const { courtId, date, time, duration, price, paymentMethod } =
    useLocalSearchParams<{
      courtId: string;
      date: string;
      time: string;
      duration: string;
      price: string;
      paymentMethod: string;
      players: string;
    }>();

  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [pixCopied, setPixCopied] = useState(false);
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutes

  const isPix = paymentMethod === 'pix';
  const pixCode = 'kourt.app/pix/abc123xyz456';

  // Countdown for PIX
  useEffect(() => {
    if (!isPix) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPix]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleCopyPix = async () => {
    // In real app, use Clipboard.setStringAsync(pixCode)
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  const handlePayment = async () => {
    if (!isPix) {
      // Validate card
      if (cardNumber.replace(/\s/g, '').length < 16) {
        Alert.alert('Erro', 'Número do cartão inválido');
        return;
      }
      if (!cardName.trim()) {
        Alert.alert('Erro', 'Nome no cartão é obrigatório');
        return;
      }
      if (cardExpiry.length < 5) {
        Alert.alert('Erro', 'Data de validade inválida');
        return;
      }
      if (cardCvv.length < 3) {
        Alert.alert('Erro', 'CVV inválido');
        return;
      }
    }

    setLoading(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);

    router.replace({
      pathname: '/booking-confirmed',
      params: { courtId, date, time, duration, price },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center px-5 py-4 bg-white border-b border-neutral-100">
          <IconButton
            icon={ChevronLeft}
            onPress={() => router.back()}
            variant="default"
            iconColor={Colors.primary}
          />
          <Text className="flex-1 text-xl font-bold text-black text-center mr-10">
            {isPix ? 'Pagar com PIX' : 'Dados do cartão'}
          </Text>
        </View>

        {isPix ? (
          // PIX Payment
          <View className="px-5 py-6">
            {/* QR Code placeholder */}
            <Card variant="outlined" className="items-center py-8 mb-6">
              <View className="w-48 h-48 bg-neutral-100 rounded-xl items-center justify-center mb-4">
                <QrCode size={100} color={Colors.neutral[400]} />
              </View>
              <Text className="text-neutral-500 text-center">
                Escaneie o QR Code com seu app de banco
              </Text>
            </Card>

            {/* PIX Copy */}
            <Text className="font-semibold text-black mb-2">
              Ou copie o código PIX
            </Text>
            <Pressable
              onPress={handleCopyPix}
              className="flex-row items-center p-4 bg-neutral-100 rounded-xl mb-4"
            >
              <Text className="flex-1 text-neutral-600 font-mono" numberOfLines={1}>
                {pixCode}
              </Text>
              {pixCopied ? (
                <Check size={20} color={Colors.success} />
              ) : (
                <Copy size={20} color={Colors.neutral[500]} />
              )}
            </Pressable>

            {pixCopied && (
              <Text className="text-success text-center mb-4">
                Código copiado!
              </Text>
            )}

            {/* Countdown */}
            <View className="flex-row items-center justify-center bg-amber-50 px-4 py-3 rounded-xl mb-6">
              <Clock size={18} color={Colors.warning} />
              <Text className="ml-2 text-amber-700">
                Este código expira em{' '}
                <Text className="font-bold">{formatCountdown(countdown)}</Text>
              </Text>
            </View>

            {/* Amount */}
            <View className="items-center mb-8">
              <Text className="text-neutral-500">Valor a pagar</Text>
              <Text className="text-4xl font-bold text-black mt-1">
                R$ {parseFloat(price!).toFixed(2)}
              </Text>
            </View>

            <Button onPress={handlePayment} loading={loading} fullWidth size="lg">
              Já fiz o pagamento
            </Button>
          </View>
        ) : (
          // Card Payment
          <View className="px-5 py-6">
            {/* Card Preview */}
            <View className="bg-gradient-to-br from-neutral-800 to-black rounded-2xl p-5 mb-6 h-48">
              <View className="flex-row items-center justify-between mb-8">
                <CreditCard size={32} color="#fff" />
                <Text className="text-white/60">
                  {paymentMethod === 'credit' ? 'CRÉDITO' : 'DÉBITO'}
                </Text>
              </View>
              <Text className="text-white text-xl tracking-widest mb-4">
                {cardNumber || '•••• •••• •••• ••••'}
              </Text>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-white/60 text-xs">TITULAR</Text>
                  <Text className="text-white uppercase">
                    {cardName || 'SEU NOME'}
                  </Text>
                </View>
                <View>
                  <Text className="text-white/60 text-xs">VALIDADE</Text>
                  <Text className="text-white">{cardExpiry || 'MM/AA'}</Text>
                </View>
              </View>
            </View>

            {/* Card Form */}
            <View className="gap-4">
              <View>
                <Text className="text-sm font-medium text-neutral-700 mb-1.5">
                  Número do cartão
                </Text>
                <TextInput
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  placeholder="0000 0000 0000 0000"
                  keyboardType="numeric"
                  maxLength={19}
                  className="border border-neutral-200 rounded-xl px-4 py-3.5 text-base bg-white"
                  placeholderTextColor={Colors.neutral[400]}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-neutral-700 mb-1.5">
                  Nome no cartão
                </Text>
                <TextInput
                  value={cardName}
                  onChangeText={setCardName}
                  placeholder="Como está no cartão"
                  autoCapitalize="characters"
                  className="border border-neutral-200 rounded-xl px-4 py-3.5 text-base bg-white"
                  placeholderTextColor={Colors.neutral[400]}
                />
              </View>

              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-neutral-700 mb-1.5">
                    Validade
                  </Text>
                  <TextInput
                    value={cardExpiry}
                    onChangeText={(text) => setCardExpiry(formatExpiry(text))}
                    placeholder="MM/AA"
                    keyboardType="numeric"
                    maxLength={5}
                    className="border border-neutral-200 rounded-xl px-4 py-3.5 text-base bg-white"
                    placeholderTextColor={Colors.neutral[400]}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-neutral-700 mb-1.5">
                    CVV
                  </Text>
                  <TextInput
                    value={cardCvv}
                    onChangeText={setCardCvv}
                    placeholder="123"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    className="border border-neutral-200 rounded-xl px-4 py-3.5 text-base bg-white"
                    placeholderTextColor={Colors.neutral[400]}
                  />
                </View>
              </View>
            </View>

            {/* Amount & Pay */}
            <View className="mt-8">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-neutral-500">Total</Text>
                <Text className="text-2xl font-bold text-black">
                  R$ {parseFloat(price!).toFixed(2)}
                </Text>
              </View>

              <Button onPress={handlePayment} loading={loading} fullWidth size="lg">
                Pagar agora
              </Button>

              <View className="flex-row items-center justify-center mt-4">
                <Text className="text-neutral-400 text-sm">
                  Pagamento seguro processado por
                </Text>
                <Text className="text-neutral-600 font-semibold text-sm ml-1">
                  Stripe
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
