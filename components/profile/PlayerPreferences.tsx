import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useUserStore } from '../../stores/useUserStore';

// Sport-specific preferences configuration
const SPORT_PREFERENCES: Record<string, { icon: string; label: string; options: string[] }[]> = {
    'beach-tennis': [
        { icon: '🤚', label: 'Mão preferida', options: ['Destro', 'Canhoto', 'Ambidestro'] },
        { icon: '📍', label: 'Posição na quadra', options: ['Direita', 'Esquerda', 'Ambas'] },
        { icon: '⚡', label: 'Estilo de jogo', options: ['Agressivo', 'Defensivo', 'All-court'] },
        { icon: '🎯', label: 'Golpe favorito', options: ['Smash', 'Bandeja', 'Voleio', 'Lob'] },
    ],
    'padel': [
        { icon: '🤚', label: 'Mão preferida', options: ['Destro', 'Canhoto', 'Ambidestro'] },
        { icon: '📍', label: 'Posição na quadra', options: ['Direita', 'Esquerda', 'Ambas'] },
        { icon: '⚡', label: 'Estilo de jogo', options: ['Agressivo', 'Defensivo', 'Contra-atacante'] },
        { icon: '🎯', label: 'Golpe favorito', options: ['Bandeja', 'Víbora', 'Chiquita', 'Por 3'] },
    ],
    'tennis': [
        { icon: '🤚', label: 'Mão preferida', options: ['Destro', 'Canhoto', 'Ambidestro'] },
        { icon: '🎾', label: 'Backhand', options: ['Uma mão', 'Duas mãos'] },
        { icon: '⚡', label: 'Estilo de jogo', options: ['Baseline', 'Saque e voleio', 'All-court'] },
        { icon: '🎯', label: 'Golpe favorito', options: ['Forehand', 'Backhand', 'Saque', 'Voleio'] },
    ],
    'football': [
        { icon: '🦶', label: 'Perna preferida', options: ['Direita', 'Esquerda', 'Ambidestro'] },
        { icon: '📍', label: 'Posição', options: ['Goleiro', 'Zagueiro', 'Lateral', 'Volante', 'Meia', 'Atacante'] },
        { icon: '⚡', label: 'Estilo de jogo', options: ['Ofensivo', 'Defensivo', 'Equilibrado'] },
        { icon: '🎯', label: 'Ponto forte', options: ['Drible', 'Passe', 'Finalização', 'Marcação'] },
    ],
    'volleyball': [
        { icon: '🤚', label: 'Mão preferida', options: ['Destro', 'Canhoto', 'Ambidestro'] },
        { icon: '📍', label: 'Posição', options: ['Levantador', 'Ponteiro', 'Oposto', 'Central', 'Líbero'] },
        { icon: '⚡', label: 'Estilo de jogo', options: ['Atacante', 'Defensivo', 'Completo'] },
        { icon: '🎯', label: 'Ponto forte', options: ['Ataque', 'Bloqueio', 'Defesa', 'Saque'] },
    ],
    'futevolei': [
        { icon: '🦶', label: 'Perna preferida', options: ['Direita', 'Esquerda', 'Ambidestro'] },
        { icon: '📍', label: 'Posição', options: ['Atacante', 'Levantador', 'Completo'] },
        { icon: '⚡', label: 'Estilo de jogo', options: ['Agressivo', 'Defensivo', 'Técnico'] },
        { icon: '🎯', label: 'Golpe favorito', options: ['Shark', 'Cabeça', 'Peito', 'Bicicleta'] },
    ],
};

interface PreferenceItemProps {
    icon: string;
    label: string;
    value: string | null;
    options: string[];
    onSelect: (value: string) => void;
    readOnly?: boolean;
    compact?: boolean;
}

function PreferenceItem({ icon, label, value, options, onSelect, readOnly, compact }: PreferenceItemProps) {
    const [expanded, setExpanded] = useState(false);

    const handlePress = () => {
        if (readOnly) return;
        setExpanded(!expanded);
    };

    if (compact) {
        return (
            <View className={`bg-neutral-50 rounded-xl mb-2 overflow-hidden border border-neutral-100 flex-1`}>
                <TouchableOpacity
                    onPress={handlePress}
                    activeOpacity={readOnly ? 1 : 0.7}
                    className={`flex-row items-center p-2.5`}
                >
                    <View className="w-8 h-8 rounded-full bg-white items-center justify-center mr-2 border border-neutral-100">
                        <Text className="text-sm">{icon}</Text>
                    </View>

                    <View className="flex-1">
                        {/* Removed label in compact to save space, or keep it very small? keeping it very small */}
                        <Text className="text-[10px] text-neutral-400 font-medium leading-tight mb-0.5" numberOfLines={1}>{label}</Text>
                        <Text className="text-xs font-bold text-neutral-900 leading-tight" numberOfLines={1}>
                            {value || '-'}
                        </Text>
                    </View>
                </TouchableOpacity>
                {/* Compact expandable content not implemented for simplicity/space. Or could be popup. 
                     Assuming readOnly for public profile usually. */}
            </View>
        );
    }

    return (
        <View className="bg-white border border-neutral-200 rounded-2xl mb-3 overflow-hidden">
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={readOnly ? 1 : 0.7}
                className="flex-row items-center p-4"
            >
                <Text className="text-2xl mr-3">{icon}</Text>
                <View className="flex-1">
                    <Text className="text-neutral-900 font-semibold text-base">{label}</Text>
                    <Text className={`text-sm ${value ? 'text-neutral-700' : 'text-neutral-400'}`}>
                        {value || 'Não definido'}
                    </Text>
                </View>
                {!readOnly && (
                    <Text className="text-neutral-400 text-lg">{expanded ? '▲' : '▼'}</Text>
                )}
            </TouchableOpacity>

            {expanded && !readOnly && (
                <View className="px-4 pb-4 pt-2 border-t border-neutral-100">
                    <View className="flex-row flex-wrap gap-2">
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => {
                                    onSelect(option);
                                    setExpanded(false);
                                }}
                                className={`px-4 py-2 rounded-full border ${value === option
                                    ? 'bg-black border-black'
                                    : 'bg-white border-neutral-300'
                                    }`}
                            >
                                <Text className={`font-medium ${value === option ? 'text-white' : 'text-neutral-700'
                                    }`}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
}

interface PlayerPreferencesProps {
    selectedSport?: string;
    preferences?: Record<string, string>;
    readOnly?: boolean;
    onUpdate?: (sport: string, key: string, value: string) => void;
    withoutPadding?: boolean;
    compact?: boolean;
}

export function PlayerPreferences({ selectedSport = 'beach-tennis', preferences, readOnly = false, onUpdate, withoutPadding = false, compact = false }: PlayerPreferencesProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { profile } = useUserStore();

    // Preferences state per sport (only used if not readOnly and no external preferences passed)
    const [localPreferences, setLocalPreferences] = useState<Record<string, Record<string, string>>>({});

    const handleUpdate = (sport: string, key: string, value: string) => {
        if (readOnly) return;

        if (onUpdate) {
            onUpdate(sport, key, value);
        } else {
            setLocalPreferences(prev => ({
                ...prev,
                [sport]: {
                    ...(prev[sport] || {}),
                    [key]: value
                }
            }));
        }
    };

    const currentPreferences = SPORT_PREFERENCES[selectedSport] || SPORT_PREFERENCES['beach-tennis'];
    // Use passed preferences or local state
    const currentValues = preferences || localPreferences[selectedSport] || {};

    const paddingClass = withoutPadding ? '' : 'px-5';

    return (
        <View className="mb-8">
            {/* Section Header */}
            <View className={`${paddingClass} flex-row justify-between items-center mb-4`}>
                <Text className="text-lg font-bold text-neutral-900">Preferências do Jogador</Text>
            </View>

            {/* Sport-specific Preferences */}
            <View className={`${paddingClass}`}>
                <View className={compact ? 'flex-row flex-wrap justify-between gap-2' : ''}>
                    {currentPreferences.map((pref) => (
                        <View key={`${selectedSport}-${pref.label}`} style={compact ? { width: '48%' } : {}}>
                            <PreferenceItem
                                icon={pref.icon}
                                label={pref.label}
                                value={currentValues[pref.label] || null}
                                options={pref.options}
                                onSelect={(v) => handleUpdate(selectedSport, pref.label, v)}
                                readOnly={readOnly}
                                compact={compact}
                            />
                        </View>
                    ))}
                </View>
            </View>

            {/* General Preferences */}
            <View className={`${paddingClass} mt-4`}>
                {!compact && <Text className="text-sm font-semibold text-neutral-500 mb-3 uppercase tracking-wide">Geral</Text>}
                <View className={compact ? 'flex-row flex-wrap justify-between gap-2' : ''}>
                    <View style={compact ? { width: '48%' } : {}}>
                        <PreferenceItem
                            icon="⏰"
                            label="Horário pref."
                            value={currentValues['Horário preferido'] || null}
                            options={['Manhã (6h-12h)', 'Tarde (12h-18h)', 'Noite (18h-22h)', 'Qualquer']}
                            onSelect={(v) => handleUpdate(selectedSport, 'Horário preferido', v)}
                            readOnly={readOnly}
                            compact={compact}
                        />
                    </View>
                    <View style={compact ? { width: '48%' } : {}}>
                        <PreferenceItem
                            icon="🎮"
                            label="Tipo de jogo"
                            value={currentValues['Tipo de partida'] || null}
                            options={['Competitivo', 'Casual', 'Treino', 'Qualquer']}
                            onSelect={(v) => handleUpdate(selectedSport, 'Tipo de partida', v)}
                            readOnly={readOnly}
                            compact={compact}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}
