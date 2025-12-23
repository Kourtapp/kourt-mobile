import { View, Text } from 'react-native';

interface PricePinProps {
    price: number | null;
    selected: boolean;
}

export function PricePin({ price, selected }: PricePinProps) {
    return (
        <View
            style={{
                backgroundColor: selected ? '#22C55E' : '#FFFFFF',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                transform: [{ scale: selected ? 1.1 : 1 }]
            }}
        >
            <Text style={{
                fontSize: 13,
                fontWeight: '700',
                color: selected ? '#FFFFFF' : '#000'
            }}>
                {price ? `R$ ${price}` : 'Grátis'}
            </Text>
        </View>
    );
}
