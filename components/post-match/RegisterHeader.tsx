import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RegisterHeaderProps {
    title: string;
    step: 1 | 2 | 3 | 4;
    totalSteps?: number;
    onClose?: () => void;
}

export function RegisterHeader({ title, step, totalSteps = 4, onClose }: RegisterHeaderProps) {
    const insets = useSafeAreaInsets();

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            router.back();
        }
    };

    return (
        <View style={{ paddingTop: insets.top, backgroundColor: '#FFFFFF' }}>
            {/* Top Bar */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                height: 56
            }}>
                <Pressable
                    onPress={handleClose}
                    style={{ padding: 4, marginLeft: -4 }}
                >
                    <X size={24} color="#000" />
                </Pressable>

                <Text style={{ fontSize: 17, fontWeight: '700', color: '#000' }}>
                    {title}
                </Text>

                <Text style={{ fontSize: 15, color: '#9CA3AF', width: 40, textAlign: 'right' }}>
                    {step}/{totalSteps}
                </Text>
            </View>

            {/* Progress Bar */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 8, paddingBottom: 16 }}>
                {Array.from({ length: totalSteps }).map((_, index) => {
                    const isActive = index < step;
                    return (
                        <View
                            key={index}
                            style={{
                                flex: 1,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: isActive ? '#000000' : '#E5E7EB'
                            }}
                        />
                    );
                })}
            </View>
        </View>
    );
}
