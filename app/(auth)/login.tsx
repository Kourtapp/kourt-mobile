import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';
import { Analytics } from '../../services/analyticsService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  const { signInWithEmail, signInWithGoogle, signInWithApple } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithEmail(email, password);

      if (!result.success) {
        Alert.alert('Erro', result.error || 'Erro ao fazer login');
        Analytics.log('auth_failure', { method: 'email', reason: result.error });
        return;
      }

      Analytics.log('sign_in', { method: 'email' });

      // Check if user needs onboarding
      const { profile } = useAuthStore.getState();
      if (profile && !profile.onboarding_completed) {
        router.replace('/(onboarding)/sport-selection');
      } else {
        router.replace('/(tabs)');
      }
    } catch {
      Alert.alert('Erro', 'Falha ao fazer login');
      Analytics.log('auth_failure', { method: 'email', reason: 'unknown' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSocialLoading('google');
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        Alert.alert('Erro', result.error || 'Erro ao fazer login com Google');
      }
      // On success, the auth listener will handle navigation
    } finally {
      setSocialLoading(null);
    }
  };

  const handleAppleLogin = async () => {
    setSocialLoading('apple');
    try {
      const result = await signInWithApple();
      if (!result.success) {
        Alert.alert('Erro', result.error || 'Erro ao fazer login com Apple');
      }
      // On success, the auth listener will handle navigation
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Logo Area */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-4xl font-black tracking-tight text-black">
          KOURT
        </Text>
        <Text className="text-sm text-neutral-500 mt-2">
          Seu app de esportes
        </Text>
      </View>

      {/* Form Area */}
      <View className="px-6 pb-6">
        {/* Email */}
        <Text className="text-sm font-medium text-black mb-2">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          className="w-full bg-neutral-100 rounded-xl px-4 py-3.5 text-sm text-black mb-4"
          placeholderTextColor="#A3A3A3"
          textContentType="emailAddress"
          autoComplete="email"
        />

        {/* Senha */}
        <Text className="text-sm font-medium text-black mb-2">Senha</Text>
        <View className="relative">
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            className="w-full bg-neutral-100 rounded-xl px-4 py-3.5 text-sm text-black pr-12"
            placeholderTextColor="#A3A3A3"
            textContentType="password"
            autoComplete="password"
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3.5"
          >
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color="#A3A3A3"
            />
          </Pressable>
        </View>

        {/* Esqueci senha */}
        <Pressable
          onPress={() => router.push('/(auth)/forgot-password')}
          className="mt-2 self-end"
        >
          <Text className="text-sm text-neutral-500">
            Esqueci minha senha
          </Text>
        </Pressable>

        {/* Botão Entrar */}
        <Pressable
          onPress={handleLogin}
          disabled={loading || !!socialLoading}
          className={`w-full py-4 rounded-2xl mt-6 items-center ${loading || !!socialLoading ? 'bg-neutral-300' : 'bg-black'
            }`}
        >
          <Text className="text-white font-semibold text-[15px]">
            {loading ? 'Entrando...' : 'Entrar'}
          </Text>
        </Pressable>
      </View>

      {/* Social Login */}
      <View className="px-6 pb-6">
        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-neutral-200" />
          <Text className="px-4 text-sm text-neutral-400">ou continue com</Text>
          <View className="flex-1 h-px bg-neutral-200" />
        </View>

        {/* Social Buttons */}
        <View className="flex-row gap-3">
          <Pressable
            onPress={handleGoogleLogin}
            disabled={!!socialLoading}
            className="flex-1 py-3.5 bg-white border border-neutral-200 rounded-xl flex-row items-center justify-center"
          >
            {socialLoading === 'google' ? <ActivityIndicator color="#000" /> : <MaterialIcons name="g-translate" size={20} color="#000" />}
            <Text className="ml-2 font-medium text-black">Google</Text>
          </Pressable>

          <Pressable
            onPress={handleAppleLogin}
            disabled={!!socialLoading}
            className="flex-1 py-3.5 bg-white border border-neutral-200 rounded-xl flex-row items-center justify-center"
          >
            {socialLoading === 'apple' ? <ActivityIndicator color="#000" /> : <MaterialIcons name="apple" size={20} color="#000" />}
            <Text className="ml-2 font-medium text-black">Apple</Text>
          </Pressable>
        </View>
      </View>

      {/* Footer */}
      <View className="px-6 pb-10">
        <Pressable onPress={() => router.push('/(auth)/register')}>
          <Text className="text-center text-sm text-neutral-500">
            Não tem conta?{' '}
            <Text className="text-black font-semibold">Cadastre-se</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
