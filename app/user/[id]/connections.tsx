import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { supabase } from '../../../lib/supabase';

interface Connection {
  id: string;
  name: string;
  avatar_url?: string;
  level?: number;
}

export default function ConnectionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, tab } = useLocalSearchParams<{ id: string; tab?: string }>();

  const [activeTab, setActiveTab] = useState<'following' | 'followers'>(
    (tab as 'following' | 'followers') || 'followers'
  );
  const [followers, setFollowers] = useState<Connection[]>([]);
  const [following, setFollowing] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadConnections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadConnections = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Load followers
      const { data: followersData } = await supabase
        .from('follows')
        .select('follower_id, profiles!follows_follower_id_fkey(id, name, avatar_url, level)')
        .eq('following_id', id);

      if (followersData) {
        setFollowers(
          followersData
            .map((f: any) => f.profiles)
            .filter(Boolean) as Connection[]
        );
      }

      // Load following
      const { data: followingData } = await supabase
        .from('follows')
        .select('following_id, profiles!follows_following_id_fkey(id, name, avatar_url, level)')
        .eq('follower_id', id);

      if (followingData) {
        setFollowing(
          followingData
            .map((f: any) => f.profiles)
            .filter(Boolean) as Connection[]
        );
      }
    } catch (error) {
      console.error('Error loading connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const connections = activeTab === 'followers' ? followers : following;

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ChevronLeft size={24} color="#111827" />
            <Text style={{ fontSize: 16, color: '#111827', marginLeft: 4 }}>Perfil</Text>
          </TouchableOpacity>
          <Text style={{ flex: 1, fontSize: 17, fontWeight: '600', color: '#111827', textAlign: 'center', marginRight: 60 }}>
            Conexões
          </Text>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => setActiveTab('following')}
            style={{
              flex: 1,
              paddingVertical: 14,
              alignItems: 'center',
              borderBottomWidth: 2,
              borderBottomColor: activeTab === 'following' ? '#F97316' : 'transparent',
            }}
          >
            <Text style={{
              fontSize: 15,
              fontWeight: activeTab === 'following' ? '600' : '400',
              color: activeTab === 'following' ? '#111827' : '#6B7280'
            }}>
              Seguindo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('followers')}
            style={{
              flex: 1,
              paddingVertical: 14,
              alignItems: 'center',
              borderBottomWidth: 2,
              borderBottomColor: activeTab === 'followers' ? '#F97316' : 'transparent',
            }}
          >
            <Text style={{
              fontSize: 15,
              fontWeight: activeTab === 'followers' ? '600' : '400',
              color: activeTab === 'followers' ? '#111827' : '#6B7280'
            }}>
              Seguidores
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      ) : connections.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
          <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center' }}>
            {activeTab === 'following'
              ? 'Não está seguindo ninguém'
              : 'Nenhum seguidor ainda'}
          </Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
          {connections.map((connection) => (
            <TouchableOpacity
              key={connection.id}
              onPress={() => router.push(`/user/${connection.id}`)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 12,
                marginBottom: 8,
              }}
            >
              {/* Avatar */}
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                overflow: 'hidden',
                backgroundColor: '#22C55E',
              }}>
                {connection.avatar_url ? (
                  <Image source={{ uri: connection.avatar_url }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>
                      {connection.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              {/* Info */}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
                  {connection.name}
                </Text>
                <Text style={{ fontSize: 13, color: '#6B7280' }}>
                  Nível {(connection.level || 1).toFixed(2)}
                </Text>
              </View>

              {/* Follow button */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#22C55E',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#fff' }}>Seguir</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
