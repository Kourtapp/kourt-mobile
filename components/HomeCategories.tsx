import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Animated } from 'react-native';

interface Category {
  id: string;
  label: string;
  icon: any;
  isNew?: boolean;
}

const categories: Category[] = [
  { id: 'quadras', label: 'Quadras', icon: require('../assets/icons/3d/quadras.png') },
  { id: 'matchs', label: 'Matchs', icon: require('../assets/icons/3d/matchs.png') },
  { id: 'torneios', label: 'Torneios', icon: require('../assets/icons/3d/torneios.png') },
  { id: 'profissionais', label: 'Profissionais', icon: require('../assets/icons/3d/profissionais.png'), isNew: true },
];

interface HomeCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function HomeCategories({ selectedCategory, onSelectCategory }: HomeCategoriesProps) {
  const [scaleValues] = useState(
    categories.reduce((acc, cat) => {
      acc[cat.id] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  );

  const handlePressIn = (categoryId: string) => {
    Animated.spring(scaleValues[categoryId], {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = (categoryId: string) => {
    Animated.spring(scaleValues[categoryId], {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handlePress = (categoryId: string) => {
    onSelectCategory(categoryId);
    handlePressOut(categoryId);
  };

  return (
    <View style={{ backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 24 }}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => handlePress(category.id)}
              onPressIn={() => handlePressIn(category.id)}
              onPressOut={() => handlePressOut(category.id)}
              style={{ alignItems: 'center', position: 'relative' }}
              activeOpacity={0.8}
            >
              <Animated.View
                style={{
                  transform: [{ scale: scaleValues[category.id] }],
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    backgroundColor: '#F3F4F6',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    source={category.icon}
                    style={{ width: 56, height: 56 }}
                    resizeMode="cover"
                  />
                </View>

                {category.isNew && (
                  <View style={{
                    position: 'absolute',
                    top: -4,
                    right: -8,
                    backgroundColor: '#3B82F6',
                    borderRadius: 10,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                  }}>
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>NOVO</Text>
                  </View>
                )}
              </Animated.View>

              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: isSelected ? '#171717' : '#6B7280',
                }}
              >
                {category.label}
              </Text>

              {isSelected && (
                <View style={{
                  height: 2,
                  width: '100%',
                  backgroundColor: '#171717',
                  borderRadius: 1,
                  marginTop: 8,
                }} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
