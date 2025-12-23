import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Line, Polyline } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const MoneyIcon = ({ size = 18, color = "#22c55e" }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
        <Line x1={12} y1={1} x2={12} y2={23} />
        <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Svg>
);

const ChevronRightIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth={2.5}>
        <Polyline points="9 18 15 12 9 6" />
    </Svg>
);

interface KourtHostBannerProps {
    onPress?: () => void;
}

export function KourtHostBanner({ onPress }: KourtHostBannerProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.container, pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }]}
        >
            <LinearGradient
                colors={['#f0fdf4', '#dcfce7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.iconContainer}>
                <MoneyIcon size={20} color="#22c55e" />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>Ganhe dinheiro com sua quadra</Text>
                <Text style={styles.subtitle}>Cadastre-se como Host</Text>
            </View>

            <View style={styles.arrow}>
                <ChevronRightIcon />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 8,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#bbf7d0',
        overflow: 'hidden',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#166534',
    },
    subtitle: {
        fontSize: 12,
        color: '#16a34a',
        marginTop: 2,
    },
    arrow: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default KourtHostBanner;
