import React from 'react';
import { View, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { ConsentManager } from '../../components/ConsentManager';

export default function PrivacySettingsScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Privacidade e Dados',
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              className="p-2 mr-2"
              accessibilityLabel="Voltar"
              accessibilityRole="button"
            >
              <ChevronLeft size={24} color="#000000" />
            </Pressable>
          ),
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerShadowVisible: true,
        }}
      />
      <View className="flex-1">
        <ConsentManager />
      </View>
    </>
  );
}
