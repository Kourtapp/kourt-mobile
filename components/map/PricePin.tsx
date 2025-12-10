import { View, Text } from 'react-native';

interface PricePinProps {
    price: number | null;
    selected: boolean;
}

export function PricePin({ price, selected }: PricePinProps) {
    return (
        <View
            className={`px-2.5 py-1.5 rounded-xl shadow-sm ${selected ? 'bg-black' : 'bg-white'
                }`}
        >
            <Text className={`text-xs font-bold ${selected ? 'text-white' : 'text-black'
                }`}>
                {price ? `R$ ${price}` : 'Grátis'}
            </Text>
            {/* Triangle pointer */}
            <View
                className={`absolute -bottom-1 left-1/2 -ml-1 w-2 h-2 rotate-45 ${selected ? 'bg-black' : 'bg-white'
                    }`}
            />
        </View>
    );
}
