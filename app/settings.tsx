import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Lock,
  Globe,
  CreditCard,
  HelpCircle,
  FileText,
  Shield,
  LogOut,
  Trash2,
  Moon,
  MapPin,
  Vibrate,
} from 'lucide-react-native';
import { Colors } from '../constants';
import { IconButton } from '../components/ui';
import { useAuthStore } from '../stores/authStore';

type SettingItemProps = {
  icon: React.ElementType;
  iconColor?: string;
  label: string;
  value?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  danger?: boolean;
};

function SettingItem({
  icon: Icon,
  iconColor = Colors.neutral[600],
  label,
  value,
  hasSwitch,
  switchValue,
  onSwitchChange,
  onPress,
  danger,
}: SettingItemProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={hasSwitch}
      className="flex-row items-center py-4 px-4 bg-white"
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{ backgroundColor: danger ? Colors.error + '15' : Colors.neutral[100] }}
      >
        <Icon size={20} color={danger ? Colors.error : iconColor} />
      </View>
      <Text
        className={`flex-1 ml-4 ${
          danger ? 'text-red-500' : 'text-black'
        } font-medium`}
      >
        {label}
      </Text>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: Colors.neutral[200], true: Colors.primary }}
          thumbColor="#fff"
        />
      ) : value ? (
        <Text className="text-neutral-500 mr-2">{value}</Text>
      ) : null}
      {!hasSwitch && onPress && (
        <ChevronRight size={20} color={Colors.neutral[400]} />
      )}
    </Pressable>
  );
}

function SettingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-6">
      <Text className="text-neutral-500 text-sm font-medium px-5 mb-2">
        {title.toUpperCase()}
      </Text>
      <View className="bg-white divide-y divide-neutral-100">{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();

  // Settings state
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir conta',
      'Esta ação é irreversível. Todos os seus dados serão perdidos. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
            console.log('Deleting account...');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 bg-white border-b border-neutral-100">
        <IconButton
          icon={ChevronLeft}
          onPress={() => router.back()}
          variant="default"
          iconColor={Colors.primary}
        />
        <Text className="flex-1 text-xl font-bold text-black text-center mr-10">
          Configurações
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
      >
        {/* Notifications */}
        <SettingSection title="Notificações">
          <SettingItem
            icon={Bell}
            iconColor={Colors.primary}
            label="Push notifications"
            hasSwitch
            switchValue={pushEnabled}
            onSwitchChange={setPushEnabled}
          />
          <SettingItem
            icon={Bell}
            label="Notificações por e-mail"
            hasSwitch
            switchValue={emailEnabled}
            onSwitchChange={setEmailEnabled}
          />
          <SettingItem
            icon={Vibrate}
            label="Som"
            hasSwitch
            switchValue={soundEnabled}
            onSwitchChange={setSoundEnabled}
          />
          <SettingItem
            icon={Vibrate}
            label="Vibração"
            hasSwitch
            switchValue={vibrationEnabled}
            onSwitchChange={setVibrationEnabled}
          />
        </SettingSection>

        {/* Privacy & Security */}
        <SettingSection title="Privacidade e Segurança">
          <SettingItem
            icon={Shield}
            iconColor="#3B82F6"
            label="Gerenciar Consentimentos LGPD"
            onPress={() => router.push('/settings/privacy-settings')}
          />
          <SettingItem
            icon={Lock}
            iconColor={Colors.warning}
            label="Alterar senha"
            onPress={() => Alert.alert('Em breve', 'Esta funcionalidade estará disponível em breve.')}
          />
          <SettingItem
            icon={Shield}
            label="Autenticação em 2 fatores"
            value="Ativada"
            onPress={() => {}}
          />
          <SettingItem
            icon={MapPin}
            label="Compartilhar localização"
            hasSwitch
            switchValue={locationEnabled}
            onSwitchChange={setLocationEnabled}
          />
        </SettingSection>

        {/* Preferences */}
        <SettingSection title="Preferências">
          <SettingItem
            icon={Globe}
            label="Idioma"
            value="Português"
            onPress={() => {}}
          />
          <SettingItem
            icon={Moon}
            label="Modo escuro"
            hasSwitch
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
          />
        </SettingSection>

        {/* Payment */}
        <SettingSection title="Pagamentos">
          <SettingItem
            icon={CreditCard}
            iconColor={Colors.success}
            label="Formas de pagamento"
            onPress={() => Alert.alert('Em breve', 'Esta funcionalidade estará disponível em breve.')}
          />
        </SettingSection>

        {/* Support */}
        <SettingSection title="Suporte">
          <SettingItem
            icon={HelpCircle}
            label="Central de ajuda"
            onPress={() => {}}
          />
          <SettingItem
            icon={FileText}
            label="Termos de uso"
            onPress={() => {}}
          />
          <SettingItem
            icon={Shield}
            label="Política de privacidade"
            onPress={() => {}}
          />
        </SettingSection>

        {/* Account Actions */}
        <SettingSection title="Conta">
          <SettingItem
            icon={LogOut}
            label="Sair da conta"
            onPress={handleLogout}
            danger
          />
          <SettingItem
            icon={Trash2}
            label="Excluir conta"
            onPress={handleDeleteAccount}
            danger
          />
        </SettingSection>

        {/* App Info */}
        <View className="items-center py-8">
          <Text className="text-neutral-400 text-sm">Kourt v1.0.0</Text>
          <Text className="text-neutral-300 text-xs mt-1">
            © 2024 Kourt. Todos os direitos reservados.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
