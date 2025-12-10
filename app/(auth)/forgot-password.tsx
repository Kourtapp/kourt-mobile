import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Mail } from 'lucide-react-native';
import { Colors } from '../../constants';
import { Button, Input, IconButton } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      setError('Email é obrigatório');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email inválido');
      return;
    }

    setError('');
    const { error: resetError } = await resetPassword(email);

    if (resetError) {
      Alert.alert('Erro', 'Não foi possível enviar o email. Tente novamente.');
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center px-4 py-2">
          <IconButton
            icon={ChevronLeft}
            onPress={() => router.back()}
            variant="ghost"
            iconColor={Colors.primary}
          />
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
            <Mail size={40} color={Colors.success} />
          </View>
          <Text className="text-2xl font-bold text-black text-center">
            Email enviado!
          </Text>
          <Text className="text-neutral-500 text-center mt-3 px-6">
            Enviamos um link para redefinir sua senha para{' '}
            <Text className="font-semibold text-black">{email}</Text>
          </Text>

          <Button
            onPress={() => router.replace('/(auth)/login')}
            className="mt-8"
            fullWidth
          >
            Voltar para login
          </Button>

          <Text className="text-neutral-400 text-center mt-6">
            Não recebeu? Verifique sua caixa de spam ou{' '}
            <Text
              onPress={() => setSent(false)}
              className="text-black font-semibold"
            >
              tente novamente
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-row items-center px-4 py-2">
          <IconButton
            icon={ChevronLeft}
            onPress={() => router.back()}
            variant="ghost"
            iconColor={Colors.primary}
          />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-8">
            <Text className="text-3xl font-bold text-black">
              Esqueceu a senha?
            </Text>
            <Text className="text-neutral-500 mt-2">
              Digite seu email e enviaremos um link para redefinir sua senha.
            </Text>
          </View>

          <Input
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon={Mail}
            error={error}
          />

          <Button
            onPress={handleReset}
            loading={isLoading}
            fullWidth
            size="lg"
            className="mt-8"
          >
            Enviar link
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
