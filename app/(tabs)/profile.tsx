import { View, Text, ScrollView, Alert, Linking } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/useUserStore';

import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { MenuItem } from '@/components/profile/MenuItem';

export default function ProfileScreen() {
  const { signOut } = useAuthStore();
  const { profile } = useUserStore();

  const handleSignOut = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header Background */}
        <View className="h-32 bg-neutral-100 mb-12" />

        {/* Profile Content */}
        <View className="-mt-16">
          <ProfileHeader
            user={{
              name: profile?.name || 'Bruno Silva',
              username: 'brunosilva',
              isVerified: profile?.is_verified || false,
              avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&auto=format&fit=crop',
              stats: {
                matches: profile?.matches_count || 0,
                wins: profile?.wins || 0,
                level: profile?.level || 1,
              }
            }}
          />

          {/* Menu Sections */}
          <View className="px-6">
            {/* CONTA */}
            <Text className="text-xs font-bold text-neutral-400 mb-2 mt-6">CONTA</Text>
            <MenuItem
              icon="person"
              label="Editar Perfil"
              onPress={() => router.push('/settings/edit-profile')}
            />
            <MenuItem
              icon="analytics"
              label="Atividades"
              onPress={() => router.push('/profile/activities')}
            />
            <MenuItem
              icon="emoji-events"
              label="Conquistas"
              onPress={() => router.push('/achievements')}
            />
            <MenuItem
              icon="credit-card"
              label="Pagamentos"
              onPress={() => router.push('/settings/payments')}
            />

            {/* CONFIGURAÇÕES */}
            <Text className="text-xs font-bold text-neutral-400 mb-2 mt-6">CONFIGURAÇÕES</Text>
            <MenuItem
              icon="lock"
              label="Segurança"
              onPress={() => router.push('/settings/security')}
            />
            <MenuItem
              icon="notifications"
              label="Notificações"
              onPress={() => router.push('/settings/notifications')}
            />
            <MenuItem
              icon="privacy-tip"
              label="Privacidade"
              onPress={() => router.push('/settings/privacy')}
            />
            <MenuItem
              icon="star"
              label="Kourt PRO"
              onPress={() => router.push('/settings/subscription')}
            />

            {/* SUPORTE */}
            <Text className="text-xs font-bold text-neutral-400 mb-2 mt-6">SUPORTE</Text>
            <MenuItem
              icon="help"
              label="Ajuda"
              onPress={() => router.push('/settings/help')}
            />
            <MenuItem
              icon="group-add"
              label="Indicar amigos"
              onPress={() => router.push('/referral')}
            />
            <MenuItem
              icon="description"
              label="Termos de uso"
              onPress={() => Linking.openURL('https://kourt.app/terms')}
            />
            <MenuItem
              icon="logout"
              label="Sair"
              onPress={handleSignOut}
              isDestructive
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
