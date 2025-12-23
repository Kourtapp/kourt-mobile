import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, Alert, Pressable, Linking } from 'react-native';
import { Shield, Trash2, ExternalLink, MapPin, Camera, Bell, BarChart3, Megaphone, Download, UserX, ChevronRight } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Button } from './ui/Button';
import { useConsent, CONSENT_INFO, ConsentType } from '../hooks/useConsent';
import { dataPrivacyService } from '../services/dataPrivacyService';
import { logger } from '../utils/logger';

const CONSENT_ICONS = {
  location: MapPin,
  camera: Camera,
  notifications: Bell,
  analytics: BarChart3,
  marketing: Megaphone,
};

export function ConsentManager() {
  const {
    consents,
    loading,
    grantConsent,
    revokeConsent,
    revokeAllConsents,
    hasConsent,
  } = useConsent();

  const [processing, setProcessing] = useState<ConsentType | null>(null);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggleConsent = async (type: ConsentType, currentValue: boolean) => {
    setProcessing(type);
    try {
      if (currentValue) {
        await revokeConsent(type);
        logger.log(`[ConsentManager] Revoked ${type}`);
      } else {
        await grantConsent(type);
        logger.log(`[ConsentManager] Granted ${type}`);
      }
    } catch (error) {
      logger.error('[ConsentManager] Error toggling consent:', error);
      Alert.alert('Erro', 'Não foi possível alterar o consentimento. Tente novamente.');
    } finally {
      setProcessing(null);
    }
  };

  const handleRevokeAll = () => {
    Alert.alert(
      'Revogar Todos os Dados',
      'Tem certeza que deseja revogar todos os consentimentos? Isso pode afetar a funcionalidade do app.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Revogar Todos',
          style: 'destructive',
          onPress: async () => {
            try {
              await revokeAllConsents();
              Alert.alert(
                'Consentimentos Revogados',
                'Todos os seus consentimentos foram revogados com sucesso. Você pode reativá-los a qualquer momento.',
                [{ text: 'OK' }]
              );
              logger.log('[ConsentManager] All consents revoked');
            } catch (error) {
              logger.error('[ConsentManager] Error revoking all:', error);
              Alert.alert('Erro', 'Não foi possível revogar os consentimentos. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  const openPrivacyPolicy = () => {
    // TODO: Replace with actual privacy policy URL
    const url = 'https://kourt.app/privacy';
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir a Política de Privacidade.');
    });
  };

  const openTerms = () => {
    // TODO: Replace with actual terms URL
    const url = 'https://kourt.app/terms';
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir os Termos de Uso.');
    });
  };

  // LGPD Art. 18 - Portabilidade de Dados
  const handleExportData = async () => {
    setExporting(true);
    try {
      const result = await dataPrivacyService.exportUserData();

      if (!result.success || !result.data) {
        Alert.alert('Erro', result.error || 'Não foi possível exportar seus dados.');
        return;
      }

      // Save to file and share
      const fileName = `kourt_dados_${new Date().toISOString().split('T')[0]}.json`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(result.data, null, 2));

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/json',
          dialogTitle: 'Exportar meus dados',
        });
      } else {
        Alert.alert(
          'Dados Exportados',
          `Seus dados foram salvos em: ${filePath}`,
          [{ text: 'OK' }]
        );
      }

      logger.log('[ConsentManager] Data exported successfully');
    } catch (error) {
      logger.error('[ConsentManager] Export error:', error);
      Alert.alert('Erro', 'Não foi possível exportar seus dados. Tente novamente.');
    } finally {
      setExporting(false);
    }
  };

  // LGPD Art. 18 - Direito ao Esquecimento
  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta e Dados',
      'ATENÇÃO: Esta ação é IRREVERSÍVEL!\n\nTodos os seus dados serão permanentemente excluídos, incluindo:\n• Perfil e configurações\n• Histórico de partidas\n• Posts e comentários\n• Reservas e pagamentos\n\nVocê tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, excluir tudo',
          style: 'destructive',
          onPress: () => confirmDeleteAccount(),
        },
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Confirmação Final',
      'Digite "EXCLUIR" para confirmar a exclusão permanente de todos os seus dados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar Exclusão',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              const result = await dataPrivacyService.deleteAllUserData();

              if (!result.success) {
                Alert.alert('Erro', result.error || 'Não foi possível excluir seus dados.');
                return;
              }

              Alert.alert(
                'Conta Excluída',
                'Todos os seus dados foram excluídos permanentemente. Você será desconectado.',
                [{ text: 'OK' }]
              );

              logger.log('[ConsentManager] Account deleted:', result.result);
            } catch (error) {
              logger.error('[ConsentManager] Delete error:', error);
              Alert.alert('Erro', 'Não foi possível excluir sua conta. Tente novamente.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Nunca';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-neutral-600">Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header Section */}
      <View className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 pb-8">
        <View className="flex-row items-center mb-3">
          <View className="bg-white/20 p-3 rounded-full mr-3">
            <Shield size={28} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-white mb-1">
              Gerenciar Privacidade
            </Text>
            <Text className="text-blue-100 text-sm">
              Controle seus dados conforme a LGPD
            </Text>
          </View>
        </View>
      </View>

      {/* Info Banner */}
      <View className="bg-blue-50 border-l-4 border-blue-500 p-4 mx-4 mt-4 rounded-lg">
        <Text className="text-sm text-blue-900 leading-5">
          <Text className="font-semibold">Seus direitos:</Text> Você pode acessar, corrigir, excluir seus dados, solicitar portabilidade e revogar consentimentos a qualquer momento, conforme a Lei Geral de Proteção de Dados (LGPD).
        </Text>
      </View>

      {/* Consent Toggles */}
      <View className="px-4 py-6">
        <Text className="text-lg font-bold text-neutral-900 mb-1">
          Permissões de Dados
        </Text>
        <Text className="text-sm text-neutral-600 mb-4">
          Ative ou desative cada tipo de coleta de dados individualmente
        </Text>

        <View className="space-y-3">
          {(Object.keys(CONSENT_INFO) as ConsentType[]).map((type) => {
            const info = CONSENT_INFO[type];
            const consent = consents[type];
            const isGranted = hasConsent(type);
            const IconComponent = CONSENT_ICONS[type];
            const isProcessing = processing === type;

            return (
              <View
                key={type}
                className={`
                  bg-white border-2 rounded-xl p-4
                  ${isGranted ? 'border-blue-500 bg-blue-50/50' : 'border-neutral-200'}
                `}
              >
                <View className="flex-row items-start">
                  {/* Icon */}
                  <View
                    className={`
                      p-2 rounded-full mr-3
                      ${isGranted ? 'bg-blue-100' : 'bg-neutral-100'}
                    `}
                  >
                    <IconComponent
                      size={20}
                      color={isGranted ? '#3B82F6' : '#6B7280'}
                    />
                  </View>

                  {/* Content */}
                  <View className="flex-1 mr-3">
                    <View className="flex-row items-center mb-1">
                      <Text className="text-base font-semibold text-neutral-900 mr-2">
                        {info.title}
                      </Text>
                      {info.essential && (
                        <View className="bg-orange-100 px-2 py-0.5 rounded">
                          <Text className="text-xs font-medium text-orange-700">
                            Essencial
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-sm text-neutral-600 leading-5 mb-2">
                      {info.description}
                    </Text>

                    {/* Status */}
                    <View className="flex-row items-center">
                      <View
                        className={`
                          w-2 h-2 rounded-full mr-2
                          ${isGranted ? 'bg-green-500' : 'bg-neutral-400'}
                        `}
                      />
                      <Text className="text-xs text-neutral-500">
                        {isGranted
                          ? `Ativo desde ${formatDate(consent.grantedAt)}`
                          : consent.revokedAt
                          ? `Revogado em ${formatDate(consent.revokedAt)}`
                          : 'Nunca concedido'}
                      </Text>
                    </View>
                  </View>

                  {/* Toggle */}
                  <Switch
                    value={isGranted}
                    onValueChange={() => handleToggleConsent(type, isGranted)}
                    disabled={isProcessing}
                    trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                    thumbColor={isGranted ? '#3B82F6' : '#F3F4F6'}
                    ios_backgroundColor="#D1D5DB"
                    accessibilityLabel={`${info.title}: ${isGranted ? 'Ativado' : 'Desativado'}`}
                    accessibilityHint={`Toque para ${isGranted ? 'desativar' : 'ativar'}`}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Actions Section */}
      <View className="px-4 pb-6">
        <Text className="text-lg font-bold text-neutral-900 mb-4">
          Seus Dados (LGPD Art. 18)
        </Text>

        {/* Export Data - Portabilidade */}
        <View className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-3">
          <View className="flex-row items-start mb-3">
            <View className="bg-blue-100 p-2 rounded-full mr-3">
              <Download size={20} color="#2563EB" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-neutral-900 mb-1">
                Exportar Meus Dados
              </Text>
              <Text className="text-sm text-neutral-600 leading-5">
                Baixe uma cópia de todos os seus dados em formato JSON. Conforme LGPD Art. 18, você tem direito à portabilidade dos seus dados.
              </Text>
            </View>
          </View>
          <Button
            onPress={handleExportData}
            variant="primary"
            size="md"
            fullWidth
            icon={Download}
            loading={exporting}
            disabled={exporting}
            accessibilityLabel="Exportar meus dados"
            accessibilityHint="Baixa todos os seus dados em formato JSON"
          >
            {exporting ? 'Exportando...' : 'Exportar Dados'}
          </Button>
        </View>

        {/* Delete Account - Direito ao Esquecimento */}
        <View className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-3">
          <View className="flex-row items-start mb-3">
            <View className="bg-red-100 p-2 rounded-full mr-3">
              <UserX size={20} color="#DC2626" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-neutral-900 mb-1">
                Excluir Minha Conta
              </Text>
              <Text className="text-sm text-neutral-600 leading-5">
                Exclua permanentemente sua conta e todos os dados associados. Conforme LGPD Art. 18, você tem direito ao esquecimento.
              </Text>
            </View>
          </View>
          <Button
            onPress={handleDeleteAccount}
            variant="danger"
            size="md"
            fullWidth
            icon={UserX}
            loading={deleting}
            disabled={deleting}
            accessibilityLabel="Excluir minha conta"
            accessibilityHint="Remove permanentemente sua conta e todos os dados"
          >
            {deleting ? 'Excluindo...' : 'Excluir Conta'}
          </Button>
        </View>

        <Text className="text-lg font-bold text-neutral-900 mb-4 mt-6">
          Ações Rápidas
        </Text>

        {/* Revoke All */}
        <View className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-3">
          <View className="flex-row items-start mb-3">
            <View className="bg-red-100 p-2 rounded-full mr-3">
              <Trash2 size={20} color="#DC2626" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-neutral-900 mb-1">
                Revogar Todos os Dados
              </Text>
              <Text className="text-sm text-neutral-600 leading-5">
                Revogue todos os consentimentos de uma vez. Conforme LGPD Art. 18, você tem o direito de revogar seu consentimento a qualquer momento.
              </Text>
            </View>
          </View>
          <Button
            onPress={handleRevokeAll}
            variant="danger"
            size="md"
            fullWidth
            icon={Trash2}
            accessibilityLabel="Revogar todos os consentimentos"
            accessibilityHint="Remove todas as permissões de coleta de dados"
          >
            Revogar Todos
          </Button>
        </View>

        {/* Privacy Policy */}
        <Pressable
          onPress={openPrivacyPolicy}
          className="flex-row items-center justify-between bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-3"
          accessibilityRole="button"
          accessibilityLabel="Ver Política de Privacidade"
        >
          <View className="flex-row items-center flex-1">
            <View className="bg-neutral-200 p-2 rounded-full mr-3">
              <Shield size={20} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-neutral-900 mb-0.5">
                Política de Privacidade
              </Text>
              <Text className="text-sm text-neutral-600">
                Saiba como tratamos seus dados
              </Text>
            </View>
          </View>
          <ExternalLink size={20} color="#6B7280" />
        </Pressable>

        {/* Terms of Use */}
        <Pressable
          onPress={openTerms}
          className="flex-row items-center justify-between bg-neutral-50 border border-neutral-200 rounded-xl p-4"
          accessibilityRole="button"
          accessibilityLabel="Ver Termos de Uso"
        >
          <View className="flex-row items-center flex-1">
            <View className="bg-neutral-200 p-2 rounded-full mr-3">
              <ExternalLink size={20} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-neutral-900 mb-0.5">
                Termos de Uso
              </Text>
              <Text className="text-sm text-neutral-600">
                Leia os termos de serviço
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#6B7280" />
        </Pressable>
      </View>

      {/* LGPD Information */}
      <View className="bg-neutral-100 p-6 mb-6 mx-4 rounded-xl">
        <Text className="text-sm font-semibold text-neutral-900 mb-2">
          Sobre a LGPD
        </Text>
        <Text className="text-xs text-neutral-700 leading-5">
          A Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) garante maior controle sobre seus dados pessoais. No Kourt, respeitamos seus direitos e oferecemos total transparência sobre como coletamos, usamos e compartilhamos suas informações.
        </Text>
        <Text className="text-xs text-neutral-700 leading-5 mt-3">
          Suas escolhas aqui são armazenadas de forma segura e podem ser alteradas a qualquer momento. Para exercer outros direitos previstos na LGPD, entre em contato através do email: privacy@kourt.app
        </Text>
      </View>
    </ScrollView>
  );
}
