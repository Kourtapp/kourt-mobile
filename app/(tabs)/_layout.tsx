import { Tabs } from 'expo-router';
import { View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 4,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F5F5F5',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#A3A3A3',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? 'home' : 'home'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="map" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="plus"
        options={{
          title: '',
          tabBarButton: (props: any) => <CenterButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: 'Social',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="forum" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// Componente do botão central
function CenterButton({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#000000',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <MaterialIcons name="add" size={30} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}
