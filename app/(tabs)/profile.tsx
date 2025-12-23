import { View, ScrollView, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores/authStore';

import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { OverviewTab } from '@/components/profile/tabs/OverviewTab';
import { MatchesTab } from '@/components/profile/tabs/MatchesTab';
import { PostsTab } from '@/components/profile/tabs/PostsTab';


const TABS = [
  { id: 'overview', label: 'Visão Geral' },
  { id: 'matches', label: 'Partidas' },
  { id: 'posts', label: 'Posts' },
];

export default function ProfileScreen() {
  const { session } = useAuthStore();
  const { profile, fetchProfile, loading } = useUserStore();
  const [activeTab, setActiveTab] = useState('overview');

  const loadData = useCallback(() => {
    if (session?.user?.id) {
      fetchProfile(session.user.id);
    }
  }, [session?.user?.id, fetchProfile]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!profile && loading) {
    return <View className="flex-1 bg-white" />; // Or a skeleton loader
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]} // Makes ProfileTabs sticky (after Header)
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
      >
        {/* Modern Header - Real Data */}
        <ProfileHeader
          user={{
            name: profile?.name || 'Atleta Kourt',
            username: profile?.email?.split('@')[0] || 'usuario',
            isVerified: profile?.is_verified || false,
            avatar: profile?.avatar_url,
            cover: profile?.cover_url,
            bio: profile?.bio || 'Sem bio definida.',
            stats: {
              followers: profile?.followers_count || 0,
              following: profile?.following_count || 0,
              matches: profile?.matches_count || 0,
            }
          }}
        />

        {/* Sticky Tabs */}
        <ProfileTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <View className="min-h-[500px] bg-white pt-4">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'matches' && <MatchesTab />}
          {activeTab === 'posts' && <PostsTab />}
        </View>

      </ScrollView>
    </View>
  );
}
