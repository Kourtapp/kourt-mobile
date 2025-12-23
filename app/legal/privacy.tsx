import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Stack } from 'expo-router';

export default function PrivacyPolicyScreen() {
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Política de Privacidade',
                    headerShown: true,
                    headerBackTitle: 'Voltar'
                }}
            />
            <ScrollView className="flex-1 bg-white p-4">
                <Text className="text-2xl font-bold mb-4">Política de Privacidade</Text>
                <Text className="text-sm text-gray-500 mb-6">Última atualização: 22 de Dezembro de 2025</Text>

                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-2">1. Informações que Coletamos</Text>
                    <Text className="text-base text-gray-700 mb-2">O Kourt coleta as seguintes informações:</Text>
                    <Text className="text-base text-gray-700">• Nome completo{'\n'}• E-mail{'\n'}• Telefone (opcional){'\n'}• Fotos{'\n'}• Localização GPS (quando permitido)</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-2">2. Como Usamos Suas Informações</Text>
                    <Text className="text-base text-gray-700">• Mostrar quadras próximas{'\n'}• Conectar jogadores{'\n'}• Facilitar reservas e check-ins{'\n'}• Melhorar nossos serviços</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-2">3. Seus Direitos (LGPD)</Text>
                    <Text className="text-base text-gray-700 mb-2">Você tem direito a:</Text>
                    <Text className="text-base text-gray-700">✅ Acessar seus dados{'\n'}✅ Corrigir dados incorretos{'\n'}✅ Deletar sua conta{'\n'}✅ Exportar seus dados{'\n'}✅ Revogar consentimento</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-2">4. Segurança</Text>
                    <Text className="text-base text-gray-700">Implementamos medidas de segurança para proteger seus dados, incluindo criptografia e acesso restrito.</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-2">5. Compartilhamento</Text>
                    <Text className="text-base text-gray-700 font-bold mb-2">NÃO vendemos seus dados.</Text>
                    <Text className="text-base text-gray-700">Compartilhamos apenas quando você autoriza ou é exigido por lei.</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-2">Contato</Text>
                    <Text className="text-base text-gray-700">E-mail DPO: privacidade@kourt.app{'\n'}Suporte: suporte@kourt.app</Text>
                </View>

                <View className="bg-yellow-50 p-4 rounded-lg mb-6">
                    <Text className="text-sm text-yellow-800">
                        ⚠️ Este documento será revisado por advogado especializado em LGPD em breve.
                    </Text>
                </View>
            </ScrollView>
        </>
    );
}
