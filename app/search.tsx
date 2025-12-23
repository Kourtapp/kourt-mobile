import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, FlatList, Keyboard } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X, ChevronLeft, SlidersHorizontal, Clock } from 'lucide-react-native';
import { useCourts } from '../hooks/useCourts';
import { CourtCard } from '../components/home/CourtCard';
import { FilterSheet, FilterOptions } from '../components/ui/FilterSheet';
import { EmptyState } from '../components/ui/EmptyState';

// Mock recent searches
const MOCK_RECENTS = [
    'Beach Tennis',
    'Arena Ibirapuera',
    'Padel',
    'Vôlei de Praia',
];

export default function SearchScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const inputRef = useRef<TextInput>(null);
    const { courts } = useCourts();

    const [query, setQuery] = useState('');
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [recentSearches, setRecentSearches] = useState(MOCK_RECENTS);
    const [filteredCourts, setFilteredCourts] = useState(courts);

    // Focus input on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Filter logic
    useEffect(() => {
        if (!query.trim()) {
            setFilteredCourts([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = courts.filter(court =>
            court.name.toLowerCase().includes(lowerQuery) ||
            court.sport.toLowerCase().includes(lowerQuery)
        );
        setFilteredCourts(results);
    }, [query, courts]);

    const handleApplyFilters = (filters: FilterOptions) => {
        // In a real app, apply complex filtering logic here
        console.log('Applied filters:', filters);
        // For now just close, as we don't have enough mock data to show meaningful filter results
    };

    const clearRecent = (item: string) => {
        setRecentSearches(prev => prev.filter(i => i !== item));
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{
                paddingTop: insets.top + 8,
                paddingBottom: 12,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#F3F4F6',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12
            }}>
                <Pressable
                    onPress={() => router.back()}
                    style={{ padding: 4 }}
                >
                    <ChevronLeft size={24} color="#000" />
                </Pressable>

                <View style={{
                    flex: 1,
                    height: 44,
                    backgroundColor: '#F3F4F6',
                    borderRadius: 22,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    gap: 8
                }}>
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        ref={inputRef}
                        style={{ flex: 1, fontSize: 16, color: '#000', height: '100%' }}
                        placeholder="Buscar quadras, esportes..."
                        placeholderTextColor="#9CA3AF"
                        value={query}
                        onChangeText={setQuery}
                        returnKeyType="search"
                    />
                    {query.length > 0 && (
                        <Pressable onPress={() => setQuery('')}>
                            <X size={18} color="#9CA3AF" />
                        </Pressable>
                    )}
                </View>

                <Pressable
                    onPress={() => setFilterVisible(true)}
                    style={{
                        width: 44,
                        height: 44,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 22,
                        backgroundColor: '#F3F4F6'
                    }}
                >
                    <SlidersHorizontal size={20} color="#000" />
                </Pressable>
            </View>

            {/* Content */}
            <View style={{ flex: 1 }}>
                {query.length === 0 ? (
                    /* Recent Searches */
                    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 16 }}>
                            Buscas recentes
                        </Text>
                        {recentSearches.map((item, index) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingVertical: 12,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#F3F4F6'
                                }}
                            >
                                <Pressable
                                    style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}
                                    onPress={() => setQuery(item)}
                                >
                                    <Clock size={20} color="#9CA3AF" />
                                    <Text style={{ fontSize: 16, color: '#374151' }}>{item}</Text>
                                </Pressable>
                                <Pressable onPress={() => clearRecent(item)} style={{ padding: 4 }}>
                                    <X size={16} color="#9CA3AF" />
                                </Pressable>
                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    /* Search Results */
                    <FlatList
                        data={filteredCourts}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}
                        ListEmptyComponent={
                            <EmptyState
                                type="noResults"
                                title={`Nenhum resultado para "${query}"`}
                                description="Tente buscar por outro termo ou adicione uma nova quadra"
                                actionLabel="Adicionar quadra"
                                onAction={() => router.push('/court/new')}
                                compact
                            />
                        }
                        renderItem={({ item }) => (
                            <View style={{ alignItems: 'center' }}>
                                <CourtCard
                                    court={item}
                                    onPress={() => router.push(`/court/${item.id}` as any)}
                                />
                            </View>
                        )}
                        onScroll={() => Keyboard.dismiss()}
                        ListFooterComponent={
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <Pressable
                                    onPress={() => router.push('/court/new')}
                                    style={{ paddingVertical: 12 }}
                                >
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#3B82F6' }}>
                                        Não encontrou o que procurava? Adicione uma quadra
                                    </Text>
                                </Pressable>
                            </View>
                        }
                    />
                )}
            </View>

            <FilterSheet
                visible={isFilterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={handleApplyFilters}
                resultsCount={filteredCourts.length > 0 ? filteredCourts.length : courts.length}
            />
        </View>
    );
}
