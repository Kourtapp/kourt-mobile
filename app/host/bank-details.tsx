import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ArrowLeft, Building, CreditCard, Plus, Trash2, Check } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useProfile } from '../../hooks/useProfile';

// Mock saved bank accounts
const MOCK_ACCOUNTS = [
    {
        id: '1',
        bank: 'Nubank',
        type: 'Conta Corrente',
        agency: '0001',
        account: '****5678',
        holder: 'Bruno Silva',
        cpf: '***.***.***-00',
        isPrimary: true,
    },
];

export default function BankDetailsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { profile } = useProfile();
    const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form state
    const [bank, setBank] = useState('');
    const [accountType, setAccountType] = useState('corrente');
    const [agency, setAgency] = useState('');
    const [account, setAccount] = useState('');
    const [cpf, setCpf] = useState('');

    const handleAddAccount = () => {
        if (!bank || !agency || !account) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
            return;
        }

        const newAccount = {
            id: Date.now().toString(),
            bank,
            type: accountType === 'corrente' ? 'Conta Corrente' : 'Conta Poupança',
            agency,
            account: '****' + account.slice(-4),
            holder: profile?.name || 'Usuário',
            cpf: '***.***.***-' + (cpf.slice(-2) || '00'),
            isPrimary: accounts.length === 0,
        };

        setAccounts([...accounts, newAccount]);
        setShowAddForm(false);
        setBank('');
        setAgency('');
        setAccount('');
        setCpf('');
        Alert.alert('Sucesso', 'Conta bancária adicionada com sucesso!');
    };

    const handleSetPrimary = (id: string) => {
        setAccounts(accounts.map(acc => ({
            ...acc,
            isPrimary: acc.id === id,
        })));
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Remover conta',
            'Tem certeza que deseja remover esta conta bancária?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: () => setAccounts(accounts.filter(acc => acc.id !== id)),
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Dados Bancários</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Info Card */}
                <Animated.View entering={FadeIn.delay(100)} style={styles.infoCard}>
                    <CreditCard size={24} color="#22C55E" />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>Receba seus pagamentos</Text>
                        <Text style={styles.infoText}>
                            Configure sua conta bancária para receber os pagamentos das reservas.
                            Os repasses são feitos em até 2 dias úteis.
                        </Text>
                    </View>
                </Animated.View>

                {/* Saved Accounts */}
                <Text style={styles.sectionTitle}>Contas Cadastradas</Text>

                {accounts.map((acc, index) => (
                    <Animated.View key={acc.id} entering={FadeInDown.delay(index * 100)}>
                        <View style={[styles.accountCard, acc.isPrimary && styles.accountCardPrimary]}>
                            {acc.isPrimary && (
                                <View style={styles.primaryBadge}>
                                    <Check size={12} color="#FFF" />
                                    <Text style={styles.primaryBadgeText}>Principal</Text>
                                </View>
                            )}

                            <View style={styles.accountHeader}>
                                <View style={styles.bankIcon}>
                                    <Building size={20} color="#6B7280" />
                                </View>
                                <View>
                                    <Text style={styles.bankName}>{acc.bank}</Text>
                                    <Text style={styles.accountType}>{acc.type}</Text>
                                </View>
                            </View>

                            <View style={styles.accountDetails}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Agência</Text>
                                    <Text style={styles.detailValue}>{acc.agency}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Conta</Text>
                                    <Text style={styles.detailValue}>{acc.account}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Titular</Text>
                                    <Text style={styles.detailValue}>{acc.holder}</Text>
                                </View>
                            </View>

                            <View style={styles.accountActions}>
                                {!acc.isPrimary && (
                                    <Pressable
                                        style={styles.setPrimaryButton}
                                        onPress={() => handleSetPrimary(acc.id)}
                                    >
                                        <Text style={styles.setPrimaryText}>Definir como principal</Text>
                                    </Pressable>
                                )}
                                <Pressable
                                    style={styles.deleteButton}
                                    onPress={() => handleDelete(acc.id)}
                                >
                                    <Trash2 size={18} color="#EF4444" />
                                </Pressable>
                            </View>
                        </View>
                    </Animated.View>
                ))}

                {/* Add Account Form */}
                {showAddForm ? (
                    <Animated.View entering={FadeInDown} style={styles.addForm}>
                        <Text style={styles.formTitle}>Nova Conta Bancária</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Banco</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nome do banco"
                                value={bank}
                                onChangeText={setBank}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Tipo de conta</Text>
                            <View style={styles.typeSelector}>
                                <Pressable
                                    style={[
                                        styles.typeOption,
                                        accountType === 'corrente' && styles.typeOptionActive
                                    ]}
                                    onPress={() => setAccountType('corrente')}
                                >
                                    <Text style={[
                                        styles.typeOptionText,
                                        accountType === 'corrente' && styles.typeOptionTextActive
                                    ]}>
                                        Corrente
                                    </Text>
                                </Pressable>
                                <Pressable
                                    style={[
                                        styles.typeOption,
                                        accountType === 'poupanca' && styles.typeOptionActive
                                    ]}
                                    onPress={() => setAccountType('poupanca')}
                                >
                                    <Text style={[
                                        styles.typeOptionText,
                                        accountType === 'poupanca' && styles.typeOptionTextActive
                                    ]}>
                                        Poupança
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.inputLabel}>Agência</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0000"
                                    value={agency}
                                    onChangeText={setAgency}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 2, marginLeft: 12 }]}>
                                <Text style={styles.inputLabel}>Conta</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="00000-0"
                                    value={account}
                                    onChangeText={setAccount}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>CPF do titular</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="000.000.000-00"
                                value={cpf}
                                onChangeText={setCpf}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.formActions}>
                            <Pressable
                                style={styles.cancelButton}
                                onPress={() => setShowAddForm(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </Pressable>
                            <Pressable
                                style={styles.saveButton}
                                onPress={handleAddAccount}
                            >
                                <Text style={styles.saveButtonText}>Salvar</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                ) : (
                    <Pressable
                        style={styles.addAccountButton}
                        onPress={() => setShowAddForm(true)}
                    >
                        <Plus size={20} color="#22C55E" />
                        <Text style={styles.addAccountText}>Adicionar conta bancária</Text>
                    </Pressable>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    content: {
        padding: 16,
        paddingBottom: 100,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#DCFCE7',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        gap: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#166534',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
        color: '#166534',
        lineHeight: 18,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    accountCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    accountCardPrimary: {
        borderColor: '#22C55E',
        borderWidth: 2,
    },
    primaryBadge: {
        position: 'absolute',
        top: -10,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#22C55E',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    primaryBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#FFF',
    },
    accountHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    bankIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bankName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    accountType: {
        fontSize: 13,
        color: '#6B7280',
    },
    accountDetails: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    detailLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    detailValue: {
        fontSize: 13,
        fontWeight: '500',
        color: '#111827',
    },
    accountActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    setPrimaryButton: {
        paddingVertical: 8,
    },
    setPrimaryText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#22C55E',
    },
    deleteButton: {
        padding: 8,
    },
    addAccountButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#22C55E',
    },
    addAccountText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#22C55E',
    },
    addForm: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    typeSelector: {
        flexDirection: 'row',
        gap: 12,
    },
    typeOption: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    typeOptionActive: {
        backgroundColor: '#111827',
    },
    typeOptionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    typeOptionTextActive: {
        color: '#FFF',
    },
    rowInputs: {
        flexDirection: 'row',
    },
    formActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    saveButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#22C55E',
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
});
