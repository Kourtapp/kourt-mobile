import { View } from 'react-native';

interface RacketIconProps {
    size: number;
    color: string;
}

export const RacketIcon = ({ size, color }: RacketIconProps) => {
    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-45deg' }] }}>
            {/* Racket Head (Oval) */}
            <View style={{
                width: size * 0.55,
                height: size * 0.7,
                borderRadius: size * 0.35,
                borderWidth: 2,
                borderColor: color,
                backgroundColor: 'transparent'
            }} />
            {/* Racket Handle */}
            <View style={{
                width: 3,
                height: size * 0.45,
                backgroundColor: color,
                marginTop: -4,
                borderRadius: 1
            }} />
        </View>
    );
};
