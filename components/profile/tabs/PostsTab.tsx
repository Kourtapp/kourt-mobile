import { View, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const COLUMN_SIZE = width / 3;

const PHOTOS = [
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&auto=format&fit=crop',
    'https://plus.unsplash.com/premium_photo-1676634832558-6654a134e920?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595435934249-fd96316cd29a?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1622163642998-1ea31304536f?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542144582-130113db653b?q=80&w=400&auto=format&fit=crop',
];

export function PostsTab() {
    return (
        <View className="flex-row flex-wrap">
            {PHOTOS.map((photo, index) => (
                <View key={index} style={{ width: COLUMN_SIZE, height: COLUMN_SIZE }} className="p-0.5">
                    <Image source={{ uri: photo }} className="w-full h-full bg-neutral-200" />
                </View>
            ))}
        </View>
    );
}
