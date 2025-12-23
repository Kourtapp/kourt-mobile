import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

interface DailyChallengeProps {
    title: string;
    xpReward: number;
    progress: number;
    total: number;
}

// Lightning bolt icon
const BoltIcon = ({ size = 18, color = '#FACC15' }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </Svg>
);

export function DailyChallenge({ title, xpReward, progress, total }: DailyChallengeProps) {
    const percentage = (progress / total) * 100;

    return (
        <LinearGradient
            colors={['#34D399', '#10B981']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                marginHorizontal: 20,
                marginTop: 12,
                borderRadius: 16,
                // Add shadow for better visibility
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
            }}
        >
            <View style={{ padding: 16 }}>
                {/* Header row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <BoltIcon size={18} color="#FACC15" />
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>
                                Desafio Diário
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>
                            +{xpReward} XP
                        </Text>
                    </View>
                </View>

                {/* Challenge text */}
                <Text style={{ fontSize: 14, color: '#FFFFFF', marginBottom: 16, opacity: 0.95, lineHeight: 20 }}>
                    {title}
                </Text>

                {/* Progress bar row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View
                        style={{
                            flex: 1,
                            height: 8,
                            backgroundColor: 'rgba(255,255,255,0.5)',
                            borderRadius: 4,
                            overflow: 'hidden',
                        }}
                    >
                        <View
                            style={{
                                height: '100%',
                                width: `${Math.min(percentage, 100)}%`,
                                backgroundColor: '#FFFFFF',
                                borderRadius: 4,
                            }}
                        />
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>
                        {progress}/{total}
                    </Text>
                </View>
            </View>
        </LinearGradient>
    );
}
