import { View, Text, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export function GalleryPost({ data }: { data: any }) {
    const imageSize = (width - 40 - 4) / 2; // -40 for padding, -4 for gap

    return (
        <View>
            <View className="flex-row flex-wrap gap-1 mb-2">
                {data.images.map((img: string, i: number) => (
                    <Image
                        key={i}
                        source={{ uri: img }}
                        style={{ width: imageSize, height: imageSize }}
                        className="rounded-lg bg-gray-200"
                    />
                ))}
            </View>
            <Text className="text-sm text-neutral-500 font-medium mb-1">{data.tagline}</Text>
        </View>
    );
}
