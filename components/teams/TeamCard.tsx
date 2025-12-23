import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Team } from '../../types/team';

interface TeamCardProps {
    team: Team;
    onPress: () => void;
}

export function TeamCard({ team, onPress }: TeamCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center bg-white p-4 rounded-2xl border border-neutral-100 mb-3 shadow-sm"
        >
            {/* Avatar / Shield */}
            <View className="w-14 h-14 rounded-xl bg-neutral-100 items-center justify-center overflow-hidden border border-neutral-200 mr-4">
                {team.avatar_url ? (
                    <Image source={{ uri: team.avatar_url }} className="w-full h-full" resizeMode="cover" />
                ) : (
                    <MaterialIcons name="shield" size={24} color="#9CA3AF" />
                )}
            </View>

            {/* Info */}
            <View className="flex-1">
                <Text className="text-base font-bold text-neutral-900 mb-0.5">{team.name}</Text>
                <Text className="text-xs text-neutral-500 mb-2">{team.sport} • {team.member_count} membros</Text>

                {/* Mini Stats Badge */}
                <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded">
                        <Text className="text-[10px] font-bold text-green-700">W {team.stats.wins}</Text>
                    </View>
                    <View className="flex-row items-center gap-1 bg-red-50 px-1.5 py-0.5 rounded">
                        <Text className="text-[10px] font-bold text-red-700">L {team.stats.losses}</Text>
                    </View>
                </View>
            </View>

            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
        </TouchableOpacity>
    );
}
