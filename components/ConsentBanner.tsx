import React, { useState } from 'react';
import { View, Text, Modal, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { Shield, X, Check } from 'lucide-react-native';
import { Button } from './ui/Button';
import { useConsent, CONSENT_INFO, ConsentType } from '../hooks/useConsent';
import { logger } from '../utils/logger';

interface ConsentBannerProps {
  visible: boolean;
  onClose?: () => void;
}

export function ConsentBanner({ visible, onClose }: ConsentBannerProps) {
  const {
    grantAllConsents,
    acceptEssentialOnly,
    completeConsentOnboarding,
    grantConsent,
    revokeConsent,
  } = useConsent();

  const [showCustomize, setShowCustomize] = useState(false);
  const [customConsents, setCustomConsents] = useState<Record<ConsentType, boolean>>({
    location: false,
    camera: false,
    notifications: false,
    analytics: false,
    marketing: false,
  });

  const handleAcceptAll = async () => {
    try {
      await grantAllConsents();
      await completeConsentOnboarding();
      logger.log('[ConsentBanner] User accepted all consents');
      onClose?.();
    } catch (error) {
      logger.error('[ConsentBanner] Error accepting all:', error);
    }
  };

  const handleRejectNonEssential = async () => {
    try {
      await acceptEssentialOnly();
      await completeConsentOnboarding();
      logger.log('[ConsentBanner] User rejected non-essential consents');
      onClose?.();
    } catch (error) {
      logger.error('[ConsentBanner] Error rejecting non-essential:', error);
    }
  };

  const handleCustomize = () => {
    setShowCustomize(true);
  };

  const handleSaveCustom = async () => {
    try {
      for (const [type, granted] of Object.entries(customConsents)) {
        if (granted) {
          await grantConsent(type as ConsentType);
        } else {
          await revokeConsent(type as ConsentType);
        }
      }

      await completeConsentOnboarding();
      logger.log('[ConsentBanner] User saved custom consents');
      onClose?.();
    } catch (error) {
      logger.error('[ConsentBanner] Error saving custom consents:', error);
    }
  };

  const toggleConsent = (type: ConsentType) => {
    setCustomConsents(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView className="flex-1 bg-black/50">
        <View className="flex-1 justify-end">
          {/* Main Banner */}
          {!showCustomize ? (
            <View className="bg-white rounded-t-3xl p-6 pb-8">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className="bg-blue-100 p-2 rounded-full mr-3">
                    <Shield size={24} color="#3B82F6" />
                  </View>
                  <Text className="text-xl font-bold text-neutral-900">
                    Sua Privacidade
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text className="text-neutral-600 mb-6 leading-6">
                Valorizamos sua privacidade e seguimos a LGPD. Queremos sua permissão para coletar e usar alguns dados que melhoram sua experiência no Kourt.
              </Text>

              {/* Quick Info */}
              <View className="bg-neutral-50 rounded-xl p-4 mb-6">
                <Text className="text-sm text-neutral-700 mb-2">
                  <Text className="font-semibold">O que coletamos:</Text> Localização para encontrar quadras próximas, fotos para seu perfil, dados de uso para melhorias.
                </Text>
                <Text className="text-sm text-neutral-700">
                  <Text className="font-semibold">Seus direitos:</Text> Você pode alterar ou revogar suas permissões a qualquer momento nas configurações.
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="space-y-3">
                <Button
                  onPress={handleAcceptAll}
                  variant="primary"
                  size="lg"
                  fullWidth
                  accessibilityLabel="Aceitar todos os consentimentos"
                  accessibilityHint="Concede todas as permissões solicitadas"
                >
                  Aceitar Todos
                </Button>

                <Button
                  onPress={handleCustomize}
                  variant="outline"
                  size="lg"
                  fullWidth
                  accessibilityLabel="Personalizar consentimentos"
                  accessibilityHint="Escolha individualmente quais permissões conceder"
                >
                  Personalizar
                </Button>

                <Button
                  onPress={handleRejectNonEssential}
                  variant="ghost"
                  size="lg"
                  fullWidth
                  accessibilityLabel="Rejeitar consentimentos não-essenciais"
                  accessibilityHint="Concede apenas permissões essenciais para o funcionamento básico"
                >
                  Rejeitar Não-Essenciais
                </Button>
              </View>

              {/* Footer Note */}
              <Text className="text-xs text-neutral-500 text-center mt-4">
                Ao usar o Kourt, você concorda com nossa Política de Privacidade e Termos de Uso.
              </Text>
            </View>
          ) : (
            /* Customize View */
            <View className="bg-white rounded-t-3xl h-4/5">
              {/* Header */}
              <View className="flex-row items-center justify-between p-6 border-b border-neutral-200">
                <Text className="text-xl font-bold text-neutral-900">
                  Personalizar Consentimentos
                </Text>
                <Pressable
                  onPress={() => setShowCustomize(false)}
                  className="p-2"
                  accessibilityLabel="Voltar"
                  accessibilityRole="button"
                >
                  <X size={24} color="#6B7280" />
                </Pressable>
              </View>

              {/* Consent List */}
              <ScrollView className="flex-1 px-6 py-4">
                <Text className="text-sm text-neutral-600 mb-6">
                  Escolha quais dados você permite que o Kourt colete e use. Você pode alterar isso a qualquer momento.
                </Text>

                {(Object.keys(CONSENT_INFO) as ConsentType[]).map((type) => {
                  const info = CONSENT_INFO[type];
                  const isGranted = customConsents[type];

                  return (
                    <Pressable
                      key={type}
                      onPress={() => toggleConsent(type)}
                      className={`
                        flex-row items-start p-4 mb-3 rounded-xl border-2
                        ${isGranted ? 'bg-blue-50 border-blue-500' : 'bg-white border-neutral-200'}
                      `}
                      accessibilityLabel={`${info.title}: ${isGranted ? 'Ativado' : 'Desativado'}`}
                      accessibilityHint={`Toque para ${isGranted ? 'desativar' : 'ativar'} ${info.title}`}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isGranted }}
                    >
                      {/* Checkbox */}
                      <View
                        className={`
                          w-6 h-6 rounded-md mr-3 mt-0.5 items-center justify-center
                          ${isGranted ? 'bg-blue-500' : 'bg-white border-2 border-neutral-300'}
                        `}
                        accessibilityElementsHidden
                      >
                        {isGranted && <Check size={16} color="#FFFFFF" />}
                      </View>

                      {/* Content */}
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="text-base font-semibold text-neutral-900">
                            {info.title}
                          </Text>
                          {info.essential && (
                            <View className="bg-orange-100 px-2 py-1 rounded">
                              <Text className="text-xs font-medium text-orange-700">
                                Essencial
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-sm text-neutral-600 leading-5">
                          {info.description}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}

                {/* LGPD Info */}
                <View className="bg-neutral-100 p-4 rounded-xl mt-4 mb-6">
                  <Text className="text-xs text-neutral-700 leading-5">
                    <Text className="font-semibold">Seus direitos (LGPD):</Text> Você tem direito a acessar, corrigir, excluir seus dados, solicitar portabilidade e revogar consentimentos a qualquer momento. Acesse Configurações {'>'} Privacidade para gerenciar.
                  </Text>
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View className="p-6 border-t border-neutral-200 space-y-3">
                <Button
                  onPress={handleSaveCustom}
                  variant="primary"
                  size="lg"
                  fullWidth
                  accessibilityLabel="Salvar preferências de consentimento"
                >
                  Salvar Preferências
                </Button>
                <Button
                  onPress={() => setShowCustomize(false)}
                  variant="ghost"
                  size="md"
                  fullWidth
                  accessibilityLabel="Cancelar personalização"
                >
                  Cancelar
                </Button>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
