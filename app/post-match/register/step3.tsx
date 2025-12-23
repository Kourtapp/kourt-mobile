import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Trophy, X, Minus, Plus, UserPlus, User } from 'lucide-react-native';
import { RegisterHeader } from '@/components/post-match/RegisterHeader';
import { usePostMatch } from './PostMatchContext';

type ResultType = 'win' | 'loss' | 'draw';

export default function RegisterStep3() {
    const router = useRouter();
    const { data, updateData } = usePostMatch();
    const [result, setResult] = useState<ResultType>(data.result);

    // Score State
    const [sets, setSets] = useState(data.sets.length > 0 ? data.sets : [{ myScore: 6, oppScore: 4 }]);

    // Update context when values change
    useEffect(() => {
        updateData({ result, sets });
    }, [result, sets]);

    const handleScoreChange = (index: number, team: 'my' | 'opp', change: number) => {
        const newSets = [...sets];
        if (team === 'my') {
            newSets[index].myScore = Math.max(0, newSets[index].myScore + change);
        } else {
            newSets[index].oppScore = Math.max(0, newSets[index].oppScore + change);
        }
        setSets(newSets);
    };

    const addSet = () => {
        setSets([...sets, { myScore: 0, oppScore: 0 }]);
    };

    const removeSet = (index: number) => {
        if (sets.length > 1) {
            setSets(sets.filter((_, i) => i !== index));
        }
    };

    const handleNext = () => {
        router.push('/post-match/register/step4');
    };

    return (
        <View className="flex-1 bg-white">
            <RegisterHeader title="Resultado" step={3} />

            <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>

                {/* 1. Result Selector */}
                <Text className="text-base font-bold text-gray-900 mb-3">Como foi a partida?</Text>
                <View className="flex-row gap-3 mb-6">
                    <Pressable
                        onPress={() => setResult('win')}
                        className={`flex-1 aspect-[1.1] rounded-2xl items-center justify-center border-2 ${result === 'win' ? 'bg-green-50 border-green-400' : 'bg-white border-gray-200'
                            }`}
                    >
                        <Trophy size={24} color={result === 'win' ? '#15803d' : '#9CA3AF'} className="mb-2" />
                        <Text className={`font-bold ${result === 'win' ? 'text-green-700' : 'text-gray-500'}`}>
                            Vitória
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setResult('loss')}
                        className={`flex-1 aspect-[1.1] rounded-2xl items-center justify-center border-2 ${result === 'loss' ? 'bg-red-50 border-red-400' : 'bg-white border-gray-200'
                            }`}
                    >
                        <X size={24} color={result === 'loss' ? '#dc2626' : '#9CA3AF'} className="mb-2" />
                        <Text className={`font-bold ${result === 'loss' ? 'text-red-700' : 'text-gray-500'}`}>
                            Derrota
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setResult('draw')}
                        className={`flex-1 aspect-[1.1] rounded-2xl items-center justify-center border-2 ${result === 'draw' ? 'bg-gray-100 border-gray-400' : 'bg-white border-gray-200'
                            }`}
                    >
                        <Minus size={24} color={result === 'draw' ? '#4B5563' : '#9CA3AF'} className="mb-2 rotate-90" />
                        <Text className={`font-bold ${result === 'draw' ? 'text-gray-700' : 'text-gray-500'}`}>
                            Empate
                        </Text>
                    </Pressable>
                </View>

                {/* 2. Score Input */}
                <Text className="text-base font-bold text-gray-900 mb-3">Placar (opcional)</Text>
                <View className="border border-gray-200 rounded-3xl p-5 mb-8">
                    <View className="flex-row justify-between mb-2 px-8">
                        <Text className="text-sm text-gray-500 font-medium">Você</Text>
                        <Text className="text-sm text-gray-500 font-medium">Adversário</Text>
                    </View>

                    {sets.map((set, index) => (
                        <View key={index} className="flex-row items-center justify-between mb-4">
                            {/* My Score */}
                            <View className="flex-row items-center gap-3">
                                <Pressable
                                    onPress={() => handleScoreChange(index, 'my', -1)}
                                    className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center active:bg-gray-200"
                                >
                                    <Minus size={16} color="#374151" />
                                </Pressable>
                                <Text className="text-3xl font-bold w-8 text-center">{set.myScore}</Text>
                                <Pressable
                                    onPress={() => handleScoreChange(index, 'my', 1)}
                                    className="w-10 h-10 bg-black rounded-xl items-center justify-center active:opacity-80"
                                >
                                    <Plus size={16} color="#FFF" />
                                </Pressable>
                            </View>

                            {/* Divider / Remove Set */}
                            {sets.length > 1 ? (
                                <Pressable onPress={() => removeSet(index)} className="p-2">
                                    <X size={16} color="#9CA3AF" />
                                </Pressable>
                            ) : (
                                <Text className="text-gray-300 font-bold text-xl">×</Text>
                            )}

                            {/* Opponent Score */}
                            <View className="flex-row items-center gap-3">
                                <Pressable
                                    onPress={() => handleScoreChange(index, 'opp', -1)}
                                    className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center active:bg-gray-200"
                                >
                                    <Minus size={16} color="#374151" />
                                </Pressable>
                                <Text className="text-3xl font-bold w-8 text-center">{set.oppScore}</Text>
                                <Pressable
                                    onPress={() => handleScoreChange(index, 'opp', 1)}
                                    className="w-10 h-10 bg-black rounded-xl items-center justify-center active:opacity-80"
                                >
                                    <Plus size={16} color="#FFF" />
                                </Pressable>
                            </View>
                        </View>
                    ))}

                    <Pressable
                        onPress={addSet}
                        className="self-center mt-2 p-2 active:opacity-60"
                    >
                        <Text className="text-gray-500 font-bold">+ Adicionar set</Text>
                    </Pressable>
                </View>

                {/* 3. Players List */}
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-lg font-bold text-gray-900">Jogadores</Text>
                    <Pressable className="flex-row items-center gap-1">
                        <UserPlus size={16} color="#000" />
                        <Text className="font-bold text-sm">Adicionar</Text>
                    </Pressable>
                </View>

                {/* My Team */}
                <Text className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Seu Time</Text>

                {/* Me */}
                <View className="flex-row items-center p-3 rounded-2xl border border-green-100 bg-green-50 mb-3">
                    <View className="w-10 h-10 bg-black rounded-full items-center justify-center mr-3">
                        <User size={20} color="#FFF" />
                    </View>
                    <View className="flex-1">
                        <Text className="font-bold text-gray-900">Você</Text>
                        <Text className="text-xs text-gray-500">@alexandrepato</Text>
                    </View>
                    <View className="bg-green-100 px-2 py-1 rounded-md">
                        <Text className="text-[10px] font-bold text-green-700 bg-transparent">VOCÊ</Text>
                    </View>
                </View>

                {/* Teammate */}
                <View className="flex-row items-center p-3 rounded-2xl border border-gray-100 bg-white mb-6">
                    <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center mr-3">
                        <User size={20} color="#6B7280" />
                    </View>
                    <View className="flex-1">
                        <Text className="font-bold text-gray-900">Pedro Fernandes</Text>
                        <Text className="text-xs text-gray-500">@pedrofernandes</Text>
                    </View>
                    <Pressable className="p-2">
                        <X size={16} color="#9CA3AF" />
                    </Pressable>
                </View>

                {/* Opponents */}
                <Text className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Adversários</Text>

                {/* Opponent 1 */}
                <View className="flex-row items-center p-3 rounded-2xl border border-gray-100 bg-white mb-3">
                    <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center mr-3">
                        <User size={20} color="#6B7280" />
                    </View>
                    <View className="flex-1">
                        <Text className="font-bold text-gray-900">Marina Silva</Text>
                        <Text className="text-xs text-gray-500">@marinasilva</Text>
                    </View>
                    <Pressable className="p-2">
                        <X size={16} color="#9CA3AF" />
                    </Pressable>
                </View>

                {/* Add Opponent Placeholder */}
                <Pressable className="flex-row items-center justify-center p-4 rounded-2xl border border-dashed border-gray-300 mb-8 active:bg-gray-50">
                    <UserPlus size={18} color="#6B7280" className="mr-2" />
                    <Text className="font-bold text-gray-500">Adicionar adversário</Text>
                </Pressable>

                <View className="h-20" />
            </ScrollView>

            {/* Footer */}
            <View className="absolute bottom-0 left-0 right-0 p-5 pb-8 bg-white border-t border-gray-100">
                <Pressable
                    className="w-full bg-black h-14 rounded-full items-center justify-center active:opacity-90"
                    onPress={handleNext}
                >
                    <Text className="text-white font-bold text-lg">Próximo</Text>
                </Pressable>
            </View>
        </View>
    );
}
