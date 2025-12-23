import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Stack } from 'expo-router';

export default function TermsScreen() {
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Termos de Serviço',
                    headerShown: true,
                    headerBackTitle: 'Voltar'
                }}
            />
            <ScrollView className="flex-1 bg-white p-4">
                <Text className="text-2xl font-bold mb-4">Termos de Serviço</Text>
                <Text className="text-sm text-gray-500 mb-6">Última atualização: 22 de Dezembro de 2025</Text>

                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-2">1. Aceitação dos Termos</Text>
                    <Text className="text-base text-gray-700">Ao usar o Kourt, você concorda com estes termos. Se não concordar, não use o aplicativo.</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-2">2. Elegibilidade</Text>
                    <Text className="text-base text-gray-700">Você deve ter 13 anos ou mais para usar o Kourt.</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-2">3. Uso Permitido</Text>
                    <Text className="text-base text-gray-700">✅ Encontrar quadras e jogadores{'\n'}✅ Organizar partidas{'\n'}✅ Compartilhar fotos de esportes{'\n'}✅ Avaliar quadras</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-2">4. Uso Proibido</Text>
                    <Text className="text-base text-gray-700">❌ Assédio ou discriminação{'\n'}❌ Spam{'\n'}❌ Perfis falsos{'\n'}❌ Atividades ilegais</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-2">5. Responsabilidade</Text>
                    <Text className="text-base text-gray-700">Praticar esportes tem riscos. Você assume total responsabilidade por sua segurança e saúde.</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-2">6. Pagamentos e Reembolsos</Text>
                    <Text className="text-base text-gray-700">• Pagamentos via Stripe (seguro){'\n'}• Reembolsos conforme política da quadra{'\n'}• Geralmente: cancelamento 24h antes = reembolso total</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-2">7. Modificações</Text>
                    <Text className="text-base text-gray-700">Podemos atualizar estes termos. Você será notificado de mudanças significativas.</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-2">Contato</Text>
                    <Text className="text-base text-gray-700">Suporte: suporte@kourt.app{'\n'}Jurídico: juridico@kourt.app</Text>
                </View>

                <View className="bg-yellow-50 p-4 rounded-lg mb-6">
                    <Text className="text-sm text-yellow-800">
                        ⚠️ Este documento será revisado por advogado especializado em breve.
                    </Text>
                </View>
            </ScrollView>
        </>
    );
}
