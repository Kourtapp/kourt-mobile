import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, Linking } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signUpWithEmail } = useAuthStore();

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Erro', 'Você precisa aceitar os termos de uso');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      const result = await signUpWithEmail(email, password, name);

      if (!result.success) {
        Alert.alert('Erro', result.error || 'Erro ao criar conta');
        return;
      }

      Alert.alert(
        'Sucesso',
        'Conta criada com sucesso! Faça login para continuar.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 py-10">
      {/* Header */}
      <View className="mb-8">
        <Pressable onPress={() => router.back()} className="mb-6">
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text className="text-2xl font-bold text-black mb-1">Criar conta</Text>
        <Text className="text-neutral-500">Junte-se à comunidade</Text>
      </View>

      {/* Form */}
      <View>
        {/* Nome */}
        <Text className="text-sm font-medium text-black mb-2">Nome completo</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          className="w-full bg-neutral-100 rounded-xl px-4 py-3.5 text-sm text-black mb-4"
          placeholderTextColor="#A3A3A3"
        />

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
        />

        {/* Telefone */}
        <Text className="text-sm font-medium text-black mb-2">Telefone</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="(11) 99999-9999"
          keyboardType="phone-pad"
          className="w-full bg-neutral-100 rounded-xl px-4 py-3.5 text-sm text-black mb-4"
          placeholderTextColor="#A3A3A3"
        />

        {/* Senha */}
        <Text className="text-sm font-medium text-black mb-2">Senha</Text>
        <View className="relative mb-2">
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            className="w-full bg-neutral-100 rounded-xl px-4 py-3.5 text-sm text-black pr-12"
            placeholderTextColor="#A3A3A3"
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
        <Text className="text-xs text-neutral-500 mb-6">Mínimo 8 caracteres</Text>

        {/* Termos */}
        <Pressable
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          className="flex-row items-start gap-3 mb-6"
        >
          <View
            className={`w-5 h-5 rounded border items-center justify-center mt-0.5 ${acceptedTerms ? 'bg-black border-black' : 'border-neutral-300 bg-white'
              }`}
          >
            {acceptedTerms && (
              <MaterialIcons name="check" size={14} color="#FFFFFF" />
            )}
          </View>
          <Text className="flex-1 text-sm text-neutral-500">
            Aceito os{' '}
            <Text
              className="text-black font-medium"
              onPress={() => Linking.openURL('https://kourt.app/terms')}
            >
              Termos de Uso
            </Text>{' '}
            e{' '}
            <Text
              className="text-black font-medium"
              onPress={() => Linking.openURL('https://kourt.app/privacy')}
            >
              Política de Privacidade
            </Text>
          </Text>
        </Pressable>

        {/* Botão Criar Conta */}
        <Pressable
          onPress={handleRegister}
          disabled={loading}
          className={`w-full py-4 rounded-2xl items-center ${loading ? 'bg-neutral-300' : 'bg-black'
            }`}
        >
          <Text className="text-white font-semibold text-[15px]">
            {loading ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
          </Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View className="mt-6">
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <Text className="text-center text-sm text-neutral-500">
            Já tem conta?{' '}
            <Text className="text-black font-semibold">Entre</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
