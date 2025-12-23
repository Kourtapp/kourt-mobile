import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ChevronLeft,
    Trophy,
    Target,
    Shuffle,
    Users,
    MapPin,
    DollarSign,
    Clock,
    Check,
    ChevronRight,
    Upload,
    Calendar,
} from 'lucide-react-native';
import { useState } from 'react';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { tournamentService, TournamentData } from '@/services/tournamentService';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const STEPS = [
    { id: 1, title: 'Informações', short: 'Info' },
    { id: 2, title: 'Formato', short: 'Formato' },
    { id: 3, title: 'Local e Data', short: 'Local' },
    { id: 4, title: 'Inscrições', short: 'Inscrições' },
    { id: 5, title: 'Regras', short: 'Regras' },
    { id: 6, title: 'Premiação', short: 'Prêmios' },
    { id: 7, title: 'Publicar', short: 'Publicar' },
];

const SPORTS = [
    { id: 'beach_tennis', label: 'Beach Tennis', icon: '🎾' },
    { id: 'padel', label: 'Padel', icon: '🏸' },
    { id: 'tennis', label: 'Tênis', icon: '🎾' },
    { id: 'futsal', label: 'Futsal', icon: '⚽' },
    { id: 'volleyball', label: 'Vôlei', icon: '🏐' },
];

const CATEGORIES = [
    { id: 'masculino', label: 'Masculino' },
    { id: 'feminino', label: 'Feminino' },
    { id: 'misto', label: 'Misto' },
    { id: 'open', label: 'Open' },
];

const LEVELS = [
    { id: 'iniciante', label: 'Iniciante' },
    { id: 'intermediario', label: 'Intermediário' },
    { id: 'avancado', label: 'Avançado' },
    { id: 'profissional', label: 'Profissional' },
    { id: 'todos', label: 'Todos os níveis' },
];

const FORMATS = [
    {
        id: 'eliminatoria_simples',
        name: 'Eliminatória Simples',
        description: 'Mata-mata direto. Perdeu, está fora.',
        ideal: 'Torneios rápidos, muitas duplas',
        icon: Trophy,
    },
    {
        id: 'eliminatoria_dupla',
        name: 'Eliminatória Dupla',
        description: 'Duas derrotas para ser eliminado.',
        ideal: 'Competições mais equilibradas',
        icon: Shuffle,
    },
    {
        id: 'round_robin',
        name: 'Round Robin',
        description: 'Todas as duplas jogam entre si.',
        ideal: 'Grupos pequenos (até 8 duplas)',
        icon: Users,
    },
    {
        id: 'grupos_mata_mata',
        name: 'Grupos + Mata-Mata',
        description: 'Grupos classificatórios + eliminatórias.',
        ideal: 'Torneios grandes e competitivos',
        icon: Target,
    },
];

const TEAM_SIZES = [8, 16, 32, 64];

// Step 1: Informações Básicas
function Step1({ data, updateData }: { data: any; updateData: (d: any) => void }) {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.stepTitle}>Informações básicas do torneio</Text>

            <Text style={styles.inputLabel}>Nome do torneio *</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: Copa Beach Pinheiros 2024"
                value={data.name}
                onChangeText={(v) => updateData({ name: v })}
                placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Esporte *</Text>
            <View style={styles.optionsRow}>
                {SPORTS.map((sport) => (
                    <Pressable
                        key={sport.id}
                        style={[styles.optionChip, data.sport === sport.id && styles.optionChipActive]}
                        onPress={() => updateData({ sport: sport.id })}
                    >
                        <Text style={styles.optionEmoji}>{sport.icon}</Text>
                        <Text style={[styles.optionText, data.sport === sport.id && styles.optionTextActive]}>
                            {sport.label}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.inputLabel}>Tipo de competição *</Text>
            <View style={styles.radioGroup}>
                {[
                    { id: 'duplas', label: 'Duplas' },
                    { id: 'individual', label: 'Individual (Simples)' },
                    { id: 'times', label: 'Times (3+ jogadores)' },
                ].map((type) => (
                    <Pressable
                        key={type.id}
                        style={styles.radioItem}
                        onPress={() => updateData({ competitionType: type.id })}
                    >
                        <View style={[styles.radio, data.competitionType === type.id && styles.radioActive]}>
                            {data.competitionType === type.id && <View style={styles.radioInner} />}
                        </View>
                        <Text style={styles.radioLabel}>{type.label}</Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.inputLabel}>Categoria *</Text>
            <View style={styles.optionsRow}>
                {CATEGORIES.map((cat) => (
                    <Pressable
                        key={cat.id}
                        style={[styles.optionChipSmall, data.category === cat.id && styles.optionChipActive]}
                        onPress={() => updateData({ category: cat.id })}
                    >
                        <Text style={[styles.optionTextSmall, data.category === cat.id && styles.optionTextActive]}>
                            {cat.label}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.inputLabel}>Nível dos participantes</Text>
            <View style={styles.optionsRow}>
                {LEVELS.map((level) => (
                    <Pressable
                        key={level.id}
                        style={[styles.optionChipSmall, data.level === level.id && styles.optionChipActive]}
                        onPress={() => updateData({ level: level.id })}
                    >
                        <Text style={[styles.optionTextSmall, data.level === level.id && styles.optionTextActive]}>
                            {level.label}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.inputLabel}>Descrição (opcional)</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva seu torneio..."
                value={data.description}
                onChangeText={(v) => updateData({ description: v })}
                multiline
                numberOfLines={4}
                placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Banner do torneio (opcional)</Text>
            <Pressable style={styles.uploadArea}>
                <Upload size={32} color="#9CA3AF" />
                <Text style={styles.uploadText}>Toque para fazer upload</Text>
                <Text style={styles.uploadHint}>Recomendado: 1200x630px</Text>
            </Pressable>
        </ScrollView>
    );
}

// Step 2: Formato
function Step2({ data, updateData }: { data: any; updateData: (d: any) => void }) {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.stepTitle}>Escolha o formato do torneio</Text>

            {FORMATS.map((format) => (
                <Pressable
                    key={format.id}
                    style={[styles.formatCard, data.format === format.id && styles.formatCardActive]}
                    onPress={() => updateData({ format: format.id })}
                >
                    <View style={styles.formatHeader}>
                        <format.icon size={24} color={data.format === format.id ? '#8B5CF6' : '#6B7280'} />
                        <View style={styles.formatInfo}>
                            <Text style={[styles.formatName, data.format === format.id && styles.formatNameActive]}>
                                {format.name}
                            </Text>
                            <Text style={styles.formatDesc}>{format.description}</Text>
                        </View>
                        {data.format === format.id && (
                            <View style={styles.checkCircle}>
                                <Check size={16} color="#FFF" />
                            </View>
                        )}
                    </View>
                    <Text style={styles.formatIdeal}>Ideal para: {format.ideal}</Text>
                </Pressable>
            ))}

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Configurações do formato</Text>

            <Text style={styles.inputLabel}>Número de duplas/times *</Text>
            <View style={styles.optionsRow}>
                {TEAM_SIZES.map((size) => (
                    <Pressable
                        key={size}
                        style={[styles.sizeChip, data.maxTeams === size && styles.sizeChipActive]}
                        onPress={() => updateData({ maxTeams: size })}
                    >
                        <Text style={[styles.sizeText, data.maxTeams === size && styles.sizeTextActive]}>
                            {size}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <View style={styles.checkboxRow}>
                <Pressable
                    style={[styles.checkbox, data.useSeeds && styles.checkboxActive]}
                    onPress={() => updateData({ useSeeds: !data.useSeeds })}
                >
                    {data.useSeeds && <Check size={14} color="#FFF" />}
                </Pressable>
                <Text style={styles.checkboxLabel}>
                    Usar seeds (melhores ranqueados não se enfrentam no início)
                </Text>
            </View>

            <View style={styles.checkboxRow}>
                <Pressable
                    style={[styles.checkbox, data.thirdPlace && styles.checkboxActive]}
                    onPress={() => updateData({ thirdPlace: !data.thirdPlace })}
                >
                    {data.thirdPlace && <Check size={14} color="#FFF" />}
                </Pressable>
                <Text style={styles.checkboxLabel}>Realizar disputa de 3º lugar</Text>
            </View>
        </ScrollView>
    );
}

// Step 3: Local e Data
function Step3({ data, updateData }: { data: any; updateData: (d: any) => void }) {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.stepTitle}>Onde e quando será o torneio?</Text>

            <Text style={styles.sectionTitle}>Local</Text>

            <Text style={styles.inputLabel}>Tipo de local *</Text>
            <View style={styles.radioGroup}>
                <Pressable
                    style={styles.radioItem}
                    onPress={() => updateData({ locationType: 'kourt' })}
                >
                    <View style={[styles.radio, data.locationType === 'kourt' && styles.radioActive]}>
                        {data.locationType === 'kourt' && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>Quadra cadastrada no Kourt</Text>
                </Pressable>
                <Pressable
                    style={styles.radioItem}
                    onPress={() => updateData({ locationType: 'manual' })}
                >
                    <View style={[styles.radio, data.locationType === 'manual' && styles.radioActive]}>
                        {data.locationType === 'manual' && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>Endereço manual</Text>
                </Pressable>
            </View>

            {data.locationType === 'kourt' && (
                <Pressable style={styles.courtSelector}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=200' }}
                        style={styles.courtImage}
                    />
                    <View style={styles.courtInfo}>
                        <Text style={styles.courtName}>Arena Beach Pinheiros</Text>
                        <Text style={styles.courtAddress}>Rua das Palmeiras, 123</Text>
                        <Text style={styles.courtCourts}>4 quadras de Beach Tennis</Text>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                </Pressable>
            )}

            {data.locationType === 'manual' && (
                <TextInput
                    style={styles.input}
                    placeholder="Digite o endereço completo"
                    value={data.address}
                    onChangeText={(v) => updateData({ address: v })}
                    placeholderTextColor="#9CA3AF"
                />
            )}

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Data e Horário</Text>

            <Text style={styles.inputLabel}>Data do torneio *</Text>
            <Pressable style={styles.dateSelector}>
                <Calendar size={20} color="#6B7280" />
                <Text style={styles.dateSelectorText}>
                    {data.date || 'Selecionar data'}
                </Text>
            </Pressable>

            <View style={styles.row}>
                <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>Horário de início *</Text>
                    <Pressable style={styles.dateSelector}>
                        <Clock size={20} color="#6B7280" />
                        <Text style={styles.dateSelectorText}>{data.startTime || '08:00'}</Text>
                    </Pressable>
                </View>
                <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>Previsão término</Text>
                    <View style={styles.dateSelectorDisabled}>
                        <Clock size={20} color="#9CA3AF" />
                        <Text style={styles.dateSelectorTextDisabled}>18:00 (auto)</Text>
                    </View>
                </View>
            </View>

            <View style={styles.estimateCard}>
                <Clock size={18} color="#3B82F6" />
                <Text style={styles.estimateText}>
                    Estimativa: {data.maxTeams || 16} duplas × 30min/partida = ~10h
                </Text>
            </View>
        </ScrollView>
    );
}

// Step 4: Inscrições
function Step4({ data, updateData }: { data: any; updateData: (d: any) => void }) {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.stepTitle}>Configure as inscrições</Text>

            <Text style={styles.sectionTitle}>Valor da Inscrição</Text>

            <View style={styles.radioGroup}>
                <Pressable
                    style={styles.radioItem}
                    onPress={() => updateData({ isFree: true })}
                >
                    <View style={[styles.radio, data.isFree && styles.radioActive]}>
                        {data.isFree && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>Gratuito</Text>
                </Pressable>
                <Pressable
                    style={styles.radioItem}
                    onPress={() => updateData({ isFree: false })}
                >
                    <View style={[styles.radio, !data.isFree && styles.radioActive]}>
                        {!data.isFree && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>Pago</Text>
                </Pressable>
            </View>

            {!data.isFree && (
                <>
                    <Text style={styles.inputLabel}>Valor por dupla *</Text>
                    <View style={styles.priceInput}>
                        <Text style={styles.priceCurrency}>R$</Text>
                        <TextInput
                            style={styles.priceValue}
                            placeholder="100,00"
                            value={data.price}
                            onChangeText={(v) => updateData({ price: v })}
                            keyboardType="numeric"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <Text style={styles.inputLabel}>Forma de pagamento</Text>
                    <View style={styles.checkboxRow}>
                        <Pressable
                            style={[styles.checkbox, data.paymentOnline && styles.checkboxActive]}
                            onPress={() => updateData({ paymentOnline: !data.paymentOnline })}
                        >
                            {data.paymentOnline && <Check size={14} color="#FFF" />}
                        </Pressable>
                        <Text style={styles.checkboxLabel}>Online (Pix/Cartão) - Taxa de 5%</Text>
                    </View>
                    <View style={styles.checkboxRow}>
                        <Pressable
                            style={[styles.checkbox, data.paymentLocal && styles.checkboxActive]}
                            onPress={() => updateData({ paymentLocal: !data.paymentLocal })}
                        >
                            {data.paymentLocal && <Check size={14} color="#FFF" />}
                        </Pressable>
                        <Text style={styles.checkboxLabel}>No local (dinheiro/Pix manual)</Text>
                    </View>
                </>
            )}

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Vagas</Text>

            <View style={styles.checkboxRow}>
                <Pressable
                    style={[styles.checkbox, data.waitList && styles.checkboxActive]}
                    onPress={() => updateData({ waitList: !data.waitList })}
                >
                    {data.waitList && <Check size={14} color="#FFF" />}
                </Pressable>
                <Text style={styles.checkboxLabel}>Permitir lista de espera</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Aprovação</Text>
            <View style={styles.radioGroup}>
                <Pressable
                    style={styles.radioItem}
                    onPress={() => updateData({ approvalAuto: true })}
                >
                    <View style={[styles.radio, data.approvalAuto && styles.radioActive]}>
                        {data.approvalAuto && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>Automática (confirmação imediata ao pagar)</Text>
                </Pressable>
                <Pressable
                    style={styles.radioItem}
                    onPress={() => updateData({ approvalAuto: false })}
                >
                    <View style={[styles.radio, !data.approvalAuto && styles.radioActive]}>
                        {!data.approvalAuto && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>Manual (organizador aprova cada inscrição)</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

// Step 5: Regras
function Step5({ data, updateData }: { data: any; updateData: (d: any) => void }) {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.stepTitle}>Regras do torneio</Text>

            <Text style={styles.sectionTitle}>Formato das Partidas</Text>

            <Text style={styles.inputLabel}>Sets para vencer</Text>
            <View style={styles.optionsRow}>
                {[1, 2, 3].map((n) => (
                    <Pressable
                        key={n}
                        style={[styles.sizeChip, data.setsToWin === n && styles.sizeChipActive]}
                        onPress={() => updateData({ setsToWin: n })}
                    >
                        <Text style={[styles.sizeText, data.setsToWin === n && styles.sizeTextActive]}>
                            {n}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.inputLabel}>Games para vencer set</Text>
            <View style={styles.optionsRow}>
                {[4, 6].map((n) => (
                    <Pressable
                        key={n}
                        style={[styles.sizeChip, data.gamesToWin === n && styles.sizeChipActive]}
                        onPress={() => updateData({ gamesToWin: n })}
                    >
                        <Text style={[styles.sizeText, data.gamesToWin === n && styles.sizeTextActive]}>
                            {n}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <View style={styles.checkboxRow}>
                <Pressable
                    style={[styles.checkbox, data.superTiebreak && styles.checkboxActive]}
                    onPress={() => updateData({ superTiebreak: !data.superTiebreak })}
                >
                    {data.superTiebreak && <Check size={14} color="#FFF" />}
                </Pressable>
                <Text style={styles.checkboxLabel}>Set decisivo em super tie-break (10 pontos)</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Tempo</Text>

            <Text style={styles.inputLabel}>Tempo estimado por partida</Text>
            <View style={styles.optionsRow}>
                {['20min', '30min', '45min', '60min'].map((t) => (
                    <Pressable
                        key={t}
                        style={[styles.optionChipSmall, data.matchTime === t && styles.optionChipActive]}
                        onPress={() => updateData({ matchTime: t })}
                    >
                        <Text style={[styles.optionTextSmall, data.matchTime === t && styles.optionTextActive]}>
                            {t}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.inputLabel}>Tolerância para início</Text>
            <View style={styles.optionsRow}>
                {['5min', '10min', '15min'].map((t) => (
                    <Pressable
                        key={t}
                        style={[styles.optionChipSmall, data.tolerance === t && styles.optionChipActive]}
                        onPress={() => updateData({ tolerance: t })}
                    >
                        <Text style={[styles.optionTextSmall, data.tolerance === t && styles.optionTextActive]}>
                            {t}
                        </Text>
                    </Pressable>
                ))}
            </View>
            <Text style={styles.hintText}>Após esse tempo, WO para quem não comparecer</Text>
        </ScrollView>
    );
}

// Step 6: Premiação
function Step6({ data, updateData }: { data: any; updateData: (d: any) => void }) {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.stepTitle}>Premiação</Text>

            <Text style={styles.inputLabel}>O torneio terá premiação em dinheiro?</Text>
            <View style={styles.radioGroup}>
                <Pressable
                    style={styles.radioItem}
                    onPress={() => updateData({ hasPrize: true })}
                >
                    <View style={[styles.radio, data.hasPrize && styles.radioActive]}>
                        {data.hasPrize && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>Sim</Text>
                </Pressable>
                <Pressable
                    style={styles.radioItem}
                    onPress={() => updateData({ hasPrize: false })}
                >
                    <View style={[styles.radio, !data.hasPrize && styles.radioActive]}>
                        {!data.hasPrize && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>Não (apenas troféus/medalhas)</Text>
                </Pressable>
            </View>

            {data.hasPrize && (
                <>
                    <View style={styles.prizeCard}>
                        <View style={styles.prizeIcon}>
                            <Text style={styles.prizeEmoji}>🥇</Text>
                        </View>
                        <View style={styles.prizeInfo}>
                            <Text style={styles.prizeLabel}>1º Lugar</Text>
                            <View style={styles.priceInput}>
                                <Text style={styles.priceCurrency}>R$</Text>
                                <TextInput
                                    style={styles.prizeValue}
                                    placeholder="800"
                                    value={data.prize1}
                                    onChangeText={(v) => updateData({ prize1: v })}
                                    keyboardType="numeric"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.prizeCard}>
                        <View style={styles.prizeIcon}>
                            <Text style={styles.prizeEmoji}>🥈</Text>
                        </View>
                        <View style={styles.prizeInfo}>
                            <Text style={styles.prizeLabel}>2º Lugar</Text>
                            <View style={styles.priceInput}>
                                <Text style={styles.priceCurrency}>R$</Text>
                                <TextInput
                                    style={styles.prizeValue}
                                    placeholder="400"
                                    value={data.prize2}
                                    onChangeText={(v) => updateData({ prize2: v })}
                                    keyboardType="numeric"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.prizeCard}>
                        <View style={styles.prizeIcon}>
                            <Text style={styles.prizeEmoji}>🥉</Text>
                        </View>
                        <View style={styles.prizeInfo}>
                            <Text style={styles.prizeLabel}>3º Lugar</Text>
                            <View style={styles.priceInput}>
                                <Text style={styles.priceCurrency}>R$</Text>
                                <TextInput
                                    style={styles.prizeValue}
                                    placeholder="200"
                                    value={data.prize3}
                                    onChangeText={(v) => updateData({ prize3: v })}
                                    keyboardType="numeric"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>
                    </View>
                </>
            )}

            <View style={styles.divider} />

            <Text style={styles.inputLabel}>Tipo de premiação</Text>
            <View style={styles.checkboxRow}>
                <Pressable
                    style={[styles.checkbox, data.hasTrophy && styles.checkboxActive]}
                    onPress={() => updateData({ hasTrophy: !data.hasTrophy })}
                >
                    {data.hasTrophy && <Check size={14} color="#FFF" />}
                </Pressable>
                <Text style={styles.checkboxLabel}>Troféus/Medalhas</Text>
            </View>
            <View style={styles.checkboxRow}>
                <Pressable
                    style={[styles.checkbox, data.hasProducts && styles.checkboxActive]}
                    onPress={() => updateData({ hasProducts: !data.hasProducts })}
                >
                    {data.hasProducts && <Check size={14} color="#FFF" />}
                </Pressable>
                <Text style={styles.checkboxLabel}>Produtos/Brindes</Text>
            </View>
        </ScrollView>
    );
}

// Step 7: Publicar
function Step7({ data, updateData }: { data: any; updateData: (d: any) => void }) {
    const sportLabel = SPORTS.find((s) => s.id === data.sport)?.label || 'Esporte';
    const formatLabel = FORMATS.find((f) => f.id === data.format)?.name || 'Formato';
    const categoryLabel = CATEGORIES.find((c) => c.id === data.category)?.label || 'Categoria';

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.stepTitle}>Revise e publique seu torneio</Text>

            <View style={styles.previewCard}>
                <View style={styles.previewBanner}>
                    <Trophy size={48} color="#8B5CF6" />
                </View>
                <View style={styles.previewContent}>
                    <Text style={styles.previewName}>{data.name || 'Nome do Torneio'}</Text>
                    <Text style={styles.previewMeta}>
                        {sportLabel} • {categoryLabel} • {data.level || 'Nível'}
                    </Text>
                    <View style={styles.previewRow}>
                        <Calendar size={16} color="#6B7280" />
                        <Text style={styles.previewText}>{data.date || 'Data a definir'}</Text>
                    </View>
                    <View style={styles.previewRow}>
                        <MapPin size={16} color="#6B7280" />
                        <Text style={styles.previewText}>
                            {data.locationType === 'kourt' ? 'Arena Beach Pinheiros' : data.address || 'Local'}
                        </Text>
                    </View>
                    <View style={styles.previewRow}>
                        <Users size={16} color="#6B7280" />
                        <Text style={styles.previewText}>{data.maxTeams || 16} duplas</Text>
                    </View>
                    <View style={styles.previewRow}>
                        <DollarSign size={16} color="#6B7280" />
                        <Text style={styles.previewText}>
                            {data.isFree ? 'Gratuito' : `R$ ${data.price || '0'} por dupla`}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Formato</Text>
                    <Text style={styles.summaryValue}>{formatLabel}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Regras</Text>
                    <Text style={styles.summaryValue}>
                        Melhor de {data.setsToWin || 2} sets • {data.matchTime || '30min'}/partida
                    </Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Premiação</Text>
                    <Text style={styles.summaryValue}>
                        {data.hasPrize
                            ? `R$ ${data.prize1 || 0} + R$ ${data.prize2 || 0} + R$ ${data.prize3 || 0}`
                            : 'Troféus/Medalhas'}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Visibilidade</Text>
            <View style={styles.radioGroup}>
                <Pressable
                    style={styles.radioItem}
                    onPress={() => updateData({ visibility: 'public' })}
                >
                    <View style={[styles.radio, data.visibility === 'public' && styles.radioActive]}>
                        {data.visibility === 'public' && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>Público - Qualquer pessoa pode ver e se inscrever</Text>
                </Pressable>
                <Pressable
                    style={styles.radioItem}
                    onPress={() => updateData({ visibility: 'private' })}
                >
                    <View style={[styles.radio, data.visibility === 'private' && styles.radioActive]}>
                        {data.visibility === 'private' && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>Privado - Apenas com link de convite</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

// Main Component
export default function CreateTournamentScreen() {
    const insets = useSafeAreaInsets();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [data, setData] = useState({
        name: '',
        sport: 'beach_tennis',
        competitionType: 'duplas',
        category: 'masculino',
        level: 'intermediario',
        description: '',
        format: 'eliminatoria_simples',
        maxTeams: 16,
        useSeeds: true,
        thirdPlace: true,
        locationType: 'kourt' as 'kourt' | 'manual',
        address: '',
        date: 'Sábado, 21 de Dezembro de 2024',
        startTime: '08:00',
        isFree: false,
        price: '100',
        paymentOnline: true,
        paymentLocal: true,
        waitList: true,
        approvalAuto: true,
        setsToWin: 2,
        gamesToWin: 6,
        superTiebreak: true,
        matchTime: '30min',
        tolerance: '10min',
        hasPrize: true,
        prize1: '800',
        prize2: '400',
        prize3: '200',
        hasTrophy: true,
        hasProducts: false,
        visibility: 'public' as 'public' | 'private',
    });

    const updateData = (newData: Partial<typeof data>) => {
        setData((prev) => ({ ...prev, ...newData }));
    };

    const parseMatchTime = (timeStr: string): number => {
        const match = timeStr.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 30;
    };

    const parseTolerance = (toleranceStr: string): number => {
        const match = toleranceStr.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 10;
    };

    const handlePublish = async () => {
        if (isSubmitting) return;

        // Validate required fields
        if (!data.name.trim()) {
            Alert.alert('Atenção', 'O nome do torneio é obrigatório');
            return;
        }

        setIsSubmitting(true);

        try {
            const tournamentData: TournamentData = {
                name: data.name.trim(),
                sport: data.sport,
                competition_type: data.competitionType,
                category: data.category,
                level: data.level,
                description: data.description.trim() || undefined,
                format: data.format,
                max_teams: data.maxTeams,
                use_seeds: data.useSeeds,
                third_place_match: data.thirdPlace,
                location_type: data.locationType,
                address: data.locationType === 'manual' ? data.address : undefined,
                date: data.date,
                start_time: data.startTime,
                is_free: data.isFree,
                price_per_team: data.isFree ? undefined : parseFloat(data.price.replace(',', '.')) || 0,
                payment_online: data.paymentOnline,
                payment_local: data.paymentLocal,
                wait_list_enabled: data.waitList,
                auto_approval: data.approvalAuto,
                sets_to_win: data.setsToWin,
                games_to_win: data.gamesToWin,
                super_tiebreak: data.superTiebreak,
                match_duration_minutes: parseMatchTime(data.matchTime),
                late_tolerance_minutes: parseTolerance(data.tolerance),
                has_prize_money: data.hasPrize,
                prize_1st: data.hasPrize ? parseFloat(data.prize1) || 0 : undefined,
                prize_2nd: data.hasPrize ? parseFloat(data.prize2) || 0 : undefined,
                prize_3rd: data.hasPrize ? parseFloat(data.prize3) || 0 : undefined,
                has_trophy: data.hasTrophy,
                has_products: data.hasProducts,
                visibility: data.visibility,
            };

            const result = await tournamentService.create(tournamentData);

            if (result.success) {
                Alert.alert(
                    'Torneio Criado!',
                    'Seu torneio foi publicado com sucesso. Os jogadores já podem se inscrever.',
                    [
                        {
                            text: 'Ver Torneio',
                            onPress: () => {
                                router.replace(`/tournament/${result.tournamentId}`);
                            },
                        },
                        {
                            text: 'Voltar',
                            onPress: () => router.back(),
                            style: 'cancel',
                        },
                    ]
                );
            } else {
                Alert.alert('Erro', result.error || 'Não foi possível criar o torneio. Tente novamente.');
            }
        } catch (error: any) {
            console.error('[CreateTournament] Error:', error);
            Alert.alert('Erro', error.message || 'Erro inesperado ao criar torneio');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        if (currentStep < 7) {
            setCurrentStep(currentStep + 1);
        } else {
            handlePublish();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            router.back();
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1 data={data} updateData={updateData} />;
            case 2:
                return <Step2 data={data} updateData={updateData} />;
            case 3:
                return <Step3 data={data} updateData={updateData} />;
            case 4:
                return <Step4 data={data} updateData={updateData} />;
            case 5:
                return <Step5 data={data} updateData={updateData} />;
            case 6:
                return <Step6 data={data} updateData={updateData} />;
            case 7:
                return <Step7 data={data} updateData={updateData} />;
            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleBack} style={styles.backButton}>
                    <ChevronLeft size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Criar Torneio</Text>
                <Text style={styles.stepIndicator}>Passo {currentStep} de 7</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${(currentStep / 7) * 100}%` }]} />
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Animated.View
                    key={currentStep}
                    entering={FadeInRight}
                    exiting={FadeOutLeft}
                    style={styles.stepContainer}
                >
                    {renderStep()}
                </Animated.View>
            </View>

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                {currentStep > 1 && (
                    <Pressable
                        style={styles.secondaryButton}
                        onPress={handleBack}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.secondaryButtonText}>Voltar</Text>
                    </Pressable>
                )}
                <Pressable
                    style={[
                        styles.primaryButton,
                        currentStep === 1 && styles.primaryButtonFull,
                        isSubmitting && styles.primaryButtonDisabled
                    ]}
                    onPress={handleNext}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.primaryButtonText}>
                            {currentStep === 7 ? 'Publicar Torneio' : 'Continuar'}
                        </Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginLeft: 12,
    },
    stepIndicator: {
        fontSize: 13,
        color: '#6B7280',
    },
    progressContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#8B5CF6',
        borderRadius: 2,
    },
    content: {
        flex: 1,
    },
    stepContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
        marginTop: 8,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#000',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 6,
    },
    optionChipSmall: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    optionChipActive: {
        backgroundColor: '#8B5CF6',
        borderColor: '#8B5CF6',
    },
    optionEmoji: {
        fontSize: 18,
    },
    optionText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    optionTextSmall: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '500',
    },
    optionTextActive: {
        color: '#FFF',
    },
    radioGroup: {
        gap: 12,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioActive: {
        borderColor: '#8B5CF6',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#8B5CF6',
    },
    radioLabel: {
        fontSize: 15,
        color: '#374151',
    },
    uploadArea: {
        backgroundColor: '#F9FAFB',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 12,
        paddingVertical: 32,
        alignItems: 'center',
    },
    uploadText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
    },
    uploadHint: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    formatCard: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    formatCardActive: {
        backgroundColor: '#F5F3FF',
        borderColor: '#8B5CF6',
    },
    formatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    formatInfo: {
        flex: 1,
    },
    formatName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    formatNameActive: {
        color: '#8B5CF6',
    },
    formatDesc: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    formatIdeal: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 8,
        marginLeft: 36,
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#8B5CF6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 24,
    },
    sizeChip: {
        width: 56,
        height: 44,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sizeChipActive: {
        backgroundColor: '#8B5CF6',
        borderColor: '#8B5CF6',
    },
    sizeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    sizeTextActive: {
        color: '#FFF',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 12,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        backgroundColor: '#8B5CF6',
        borderColor: '#8B5CF6',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#374151',
        flex: 1,
    },
    courtSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
    },
    courtImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    courtInfo: {
        flex: 1,
        marginLeft: 12,
    },
    courtName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    courtAddress: {
        fontSize: 13,
        color: '#6B7280',
    },
    courtCourts: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 10,
    },
    dateSelectorText: {
        fontSize: 15,
        color: '#000',
    },
    dateSelectorDisabled: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 10,
    },
    dateSelectorTextDisabled: {
        fontSize: 15,
        color: '#9CA3AF',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    estimateCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 12,
        marginTop: 16,
        gap: 8,
    },
    estimateText: {
        fontSize: 13,
        color: '#3B82F6',
    },
    priceInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    priceCurrency: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
        marginRight: 8,
    },
    priceValue: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        paddingVertical: 14,
    },
    hintText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    prizeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        marginTop: 12,
    },
    prizeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FEF3C7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    prizeEmoji: {
        fontSize: 24,
    },
    prizeInfo: {
        flex: 1,
        marginLeft: 12,
    },
    prizeLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    prizeValue: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        paddingVertical: 8,
    },
    previewCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    previewBanner: {
        height: 120,
        backgroundColor: '#F5F3FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewContent: {
        padding: 16,
    },
    previewName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    previewMeta: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    previewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    previewText: {
        fontSize: 14,
        color: '#374151',
    },
    summaryCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        gap: 12,
    },
    secondaryButton: {
        flex: 1,
        height: 52,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    primaryButton: {
        flex: 2,
        height: 52,
        backgroundColor: '#8B5CF6',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonFull: {
        flex: 1,
    },
    primaryButtonDisabled: {
        backgroundColor: '#C4B5FD',
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
});
