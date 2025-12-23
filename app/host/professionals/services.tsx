import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, X, Trash2, Edit2 } from 'lucide-react-native';
import { useProfessionals, ServiceCategory, ProfessionalService } from '../../../hooks/useProfessionals';

const categoryLabels: Record<ServiceCategory, { label: string; icon: string }> = {
  personal_trainer: { label: 'Personal Trainer', icon: '💪' },
  sports_coach: { label: 'Treinador Esportivo', icon: '🎾' },
  nutritionist: { label: 'Nutricionista', icon: '🥗' },
  physiotherapist: { label: 'Fisioterapeuta', icon: '🏥' },
  masseuse: { label: 'Massagista', icon: '💆' },
};

export default function ProfessionalServices() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { professional, services, createService, updateService, deleteService, loading } = useProfessionals();
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<ProfessionalService | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [category, setCategory] = useState<ServiceCategory>('personal_trainer');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  const resetForm = () => {
    setCategory('personal_trainer');
    setTitle('');
    setDescription('');
    setPrice('');
    setDuration('');
    setEditingService(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (service: ProfessionalService) => {
    setEditingService(service);
    setCategory(service.category);
    setTitle(service.title);
    setDescription(service.description || '');
    setPrice((service.price_cents / 100).toString());
    setDuration(service.duration_minutes?.toString() || '');
    setShowModal(true);
  };

  const handleSaveService = async () => {
    if (!title.trim() || !price.trim()) return;

    try {
      setSaving(true);
      const priceInCents = Math.round(parseFloat(price.replace(',', '.')) * 100);
      const durationMins = duration ? parseInt(duration) : null;

      if (editingService) {
        await updateService(editingService.id, {
          category,
          title: title.trim(),
          description: description.trim() || null,
          price_cents: priceInCents,
          duration_minutes: durationMins,
        });
      } else {
        await createService({
          category,
          title: title.trim(),
          description: description.trim() || null,
          price_cents: priceInCents,
          duration_minutes: durationMins,
          is_active: true,
        });
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleFinish = () => {
    router.replace('/host/dashboard');
  };

  const specialties = professional?.specialties || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#F3F4F6',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '600',
            color: '#111827',
            marginRight: 40,
          }}
        >
          Meus Serviços
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
          Configure seus serviços
        </Text>
        <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 24 }}>
          Adicione os serviços que você oferece com preços e duração
        </Text>

        {/* Services List */}
        {services.length > 0 ? (
          <View style={{ gap: 16, marginBottom: 24 }}>
            {services.map((service) => {
              const catInfo = categoryLabels[service.category];
              return (
                <View
                  key={service.id}
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 32, marginRight: 12 }}>{catInfo.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase', marginBottom: 2 }}>
                        {catInfo.label}
                      </Text>
                      <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
                        {service.title}
                      </Text>
                      {service.description && (
                        <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>
                          {service.description}
                        </Text>
                      )}
                      <View style={{ flexDirection: 'row', gap: 16 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#059669' }}>
                          R$ {(service.price_cents / 100).toFixed(2).replace('.', ',')}
                        </Text>
                        {service.duration_minutes && (
                          <Text style={{ fontSize: 14, color: '#6B7280' }}>
                            {service.duration_minutes} min
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity
                        onPress={() => openEditModal(service)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: '#EFF6FF',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Edit2 size={16} color="#3B82F6" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteService(service.id)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: '#FEF2F2',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={16} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              backgroundColor: '#F9FAFB',
              borderRadius: 16,
              padding: 32,
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <Text style={{ fontSize: 48, marginBottom: 16 }}>📋</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
              Nenhum serviço cadastrado
            </Text>
            <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
              Adicione seus serviços para começar a receber clientes
            </Text>
          </View>
        )}

        {/* Add Service Button */}
        <TouchableOpacity
          onPress={openAddModal}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: '#3B82F6',
            borderStyle: 'dashed',
          }}
          activeOpacity={0.7}
        >
          <Plus size={20} color="#3B82F6" />
          <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '600', color: '#3B82F6' }}>
            Adicionar Serviço
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View
        style={{
          padding: 24,
          paddingBottom: 32,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: 'white',
        }}
      >
        <TouchableOpacity
          onPress={handleFinish}
          disabled={services.length === 0}
          style={{
            backgroundColor: services.length === 0 ? '#D1D5DB' : '#059669',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
            Finalizar Configuração
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add/Edit Service Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: '90%',
            }}
          >
            {/* Modal Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB',
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>
                {editingService ? 'Editar Serviço' : 'Novo Serviço'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
              {/* Category */}
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                Categoria
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {specialties.map((cat) => {
                    const catInfo = categoryLabels[cat as ServiceCategory];
                    if (!catInfo) return null;
                    const isSelected = category === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setCategory(cat as ServiceCategory)}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 20,
                          backgroundColor: isSelected ? '#3B82F6' : '#F3F4F6',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '500',
                            color: isSelected ? 'white' : '#374151',
                          }}
                        >
                          {catInfo.icon} {catInfo.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              {/* Title */}
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                Nome do Serviço *
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Aula de Tênis Individual"
                style={{
                  backgroundColor: '#F9FAFB',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 12,
                  padding: 14,
                  fontSize: 16,
                  color: '#111827',
                  marginBottom: 20,
                }}
                placeholderTextColor="#9CA3AF"
              />

              {/* Description */}
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                Descrição
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Descreva o que está incluso no serviço..."
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: '#F9FAFB',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 12,
                  padding: 14,
                  fontSize: 16,
                  color: '#111827',
                  marginBottom: 20,
                  minHeight: 80,
                  textAlignVertical: 'top',
                }}
                placeholderTextColor="#9CA3AF"
              />

              {/* Price and Duration */}
              <View style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                    Preço (R$) *
                  </Text>
                  <TextInput
                    value={price}
                    onChangeText={setPrice}
                    placeholder="150,00"
                    keyboardType="decimal-pad"
                    style={{
                      backgroundColor: '#F9FAFB',
                      borderWidth: 1,
                      borderColor: '#E5E7EB',
                      borderRadius: 12,
                      padding: 14,
                      fontSize: 16,
                      color: '#111827',
                    }}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                    Duração (min)
                  </Text>
                  <TextInput
                    value={duration}
                    onChangeText={setDuration}
                    placeholder="60"
                    keyboardType="number-pad"
                    style={{
                      backgroundColor: '#F9FAFB',
                      borderWidth: 1,
                      borderColor: '#E5E7EB',
                      borderRadius: 12,
                      padding: 14,
                      fontSize: 16,
                      color: '#111827',
                    }}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleSaveService}
                disabled={!title.trim() || !price.trim() || saving}
                style={{
                  backgroundColor: !title.trim() || !price.trim() ? '#D1D5DB' : '#3B82F6',
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 20,
                }}
                activeOpacity={0.8}
              >
                {saving ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                    {editingService ? 'Salvar Alterações' : 'Adicionar Serviço'}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
