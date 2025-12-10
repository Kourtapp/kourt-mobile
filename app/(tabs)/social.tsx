import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { FeedTab } from '@/components/social/FeedTab';
import { PlayersTab } from '@/components/social/PlayersTab';
import { GroupsTab } from '@/components/social/GroupsTab';

const tabs = [
  { id: 'feed', label: 'Feed' },
  { id: 'players', label: 'Jogadores' },
  { id: 'groups', label: 'Grupos' },
];

export default function SocialScreen() {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <View className="flex-1 bg-[#fafafa]">
      {/* Header */}
      <View className="bg-white px-5 pt-4 pb-3 border-b border-neutral-100">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-black">Comunidade</Text>
          <Pressable onPress={() => router.push('/search' as any)}>
            <MaterialIcons name="search" size={24} color="#000" />
          </Pressable>
        </View>

        {/* Tab Pills */}
        <View className="flex-row gap-2">
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full ${activeTab === tab.id ? 'bg-black' : 'bg-neutral-100'
                }`}
            >
              <Text className={`text-sm font-medium ${activeTab === tab.id ? 'text-white' : 'text-black'
                }`}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        {activeTab === 'feed' && <FeedTab />}
        {activeTab === 'players' && <PlayersTab />}
        {activeTab === 'groups' && <GroupsTab />}
      </View>
    </View>
  );
}
