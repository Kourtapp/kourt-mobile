import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import {
    MessageCircle,
    Trophy,
    User,
    CreditCard,
    FileText,
    Bell,
    HelpCircle,
    LogOut,
    ChevronRight,
    Star,
    Calendar,
    Building2,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface MaisTabProps {
    hostName: string;
    hostAvatar?: string;
    hostSince?: string;
    totalRating?: number;
    totalBookings?: number;
    totalCourts?: number;
    unreadMessages?: number;
    onMessagesPress: () => void;
    onTournamentsPress: () => void;
    onEditProfilePress: () => void;
    onBankDetailsPress: () => void;
    onDocumentsPress: () => void;
    onNotificationsPress: () => void;
    onHelpPress: () => void;
    onLogout: () => void;
}

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    description?: string;
    badge?: number;
    onPress: () => void;
    danger?: boolean;
}

function MenuItem({ icon, label, description, badge, onPress, danger }: MenuItemProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center py-4 border-b border-gray-50"
        >
            <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                danger ? 'bg-red-50' : 'bg-gray-100'
            }`}>
                {icon}
            </View>
            <View className="flex-1">
                <Text className={`text-base font-medium ${danger ? 'text-red-500' : 'text-gray-800'}`}>
                    {label}
                </Text>
                {description && (
                    <Text className="text-sm text-gray-500">{description}</Text>
                )}
            </View>
            {badge !== undefined && badge > 0 && (
                <View className="bg-red-500 rounded-full px-2 py-0.5 mr-2">
                    <Text className="text-xs font-semibold text-white">{badge}</Text>
                </View>
            )}
            <ChevronRight size={18} color="#9CA3AF" />
        </TouchableOpacity>
    );
}

export function MaisTab({
    hostName,
    hostAvatar,
    hostSince,
    totalRating = 0,
    totalBookings = 0,
    totalCourts = 0,
    unreadMessages = 0,
    onMessagesPress,
    onTournamentsPress,
    onEditProfilePress,
    onBankDetailsPress,
    onDocumentsPress,
    onNotificationsPress,
    onHelpPress,
    onLogout,
}: MaisTabProps) {
    return (
        <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
        >
            <View className="px-4 py-4">
                {/* Host Profile Card */}
                <Animated.View
                    entering={FadeInDown.duration(400)}
                    className="bg-white rounded-2xl border border-gray-100 p-5 mb-5"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.03,
                        shadowRadius: 8,
                        elevation: 1,
                    }}
                >
                    <View className="flex-row items-center mb-4">
                        <Image
                            source={{ uri: hostAvatar || 'https://i.pravatar.cc/100' }}
                            className="w-16 h-16 rounded-full bg-gray-200"
                        />
                        <View className="ml-4 flex-1">
                            <Text className="text-xl font-bold text-gray-900">
                                {hostName}
                            </Text>
                            <Text className="text-sm text-gray-500">
                                Host desde {hostSince || '2024'}
                            </Text>
                        </View>
                    </View>

                    {/* Stats */}
                    <View className="flex-row pt-4 border-t border-gray-100">
                        <View className="flex-1 items-center">
                            <View className="flex-row items-center">
                                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                                <Text className="text-lg font-bold text-gray-900 ml-1">
                                    {totalRating.toFixed(1)}
                                </Text>
                            </View>
                            <Text className="text-xs text-gray-500">Avaliação</Text>
                        </View>
                        <View className="flex-1 items-center border-x border-gray-100">
                            <View className="flex-row items-center">
                                <Calendar size={16} color="#3B82F6" />
                                <Text className="text-lg font-bold text-gray-900 ml-1">
                                    {totalBookings}
                                </Text>
                            </View>
                            <Text className="text-xs text-gray-500">Reservas</Text>
                        </View>
                        <View className="flex-1 items-center">
                            <View className="flex-row items-center">
                                <Building2 size={16} color="#22C55E" />
                                <Text className="text-lg font-bold text-gray-900 ml-1">
                                    {totalCourts}
                                </Text>
                            </View>
                            <Text className="text-xs text-gray-500">Quadras</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Features Section */}
                <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-5">
                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                        Recursos
                    </Text>
                    <View className="bg-white rounded-2xl border border-gray-100 px-4">
                        <MenuItem
                            icon={<MessageCircle size={20} color="#3B82F6" />}
                            label="Mensagens"
                            description="Conversas com clientes"
                            badge={unreadMessages}
                            onPress={onMessagesPress}
                        />
                        <MenuItem
                            icon={<Trophy size={20} color="#F59E0B" />}
                            label="Torneios"
                            description="Gerencie seus torneios"
                            onPress={onTournamentsPress}
                        />
                    </View>
                </Animated.View>

                {/* Account Section */}
                <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-5">
                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                        Conta
                    </Text>
                    <View className="bg-white rounded-2xl border border-gray-100 px-4">
                        <MenuItem
                            icon={<User size={20} color="#6B7280" />}
                            label="Editar perfil"
                            onPress={onEditProfilePress}
                        />
                        <MenuItem
                            icon={<CreditCard size={20} color="#6B7280" />}
                            label="Dados bancários"
                            description="Conta para recebimentos"
                            onPress={onBankDetailsPress}
                        />
                        <MenuItem
                            icon={<FileText size={20} color="#6B7280" />}
                            label="Documentos fiscais"
                            onPress={onDocumentsPress}
                        />
                        <MenuItem
                            icon={<Bell size={20} color="#6B7280" />}
                            label="Notificações"
                            onPress={onNotificationsPress}
                        />
                    </View>
                </Animated.View>

                {/* Support Section */}
                <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-5">
                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                        Suporte
                    </Text>
                    <View className="bg-white rounded-2xl border border-gray-100 px-4">
                        <MenuItem
                            icon={<HelpCircle size={20} color="#6B7280" />}
                            label="Central de ajuda"
                            description="Dúvidas e tutoriais"
                            onPress={onHelpPress}
                        />
                    </View>
                </Animated.View>

                {/* Logout */}
                <Animated.View entering={FadeInDown.delay(400).duration(400)}>
                    <View className="bg-white rounded-2xl border border-gray-100 px-4">
                        <MenuItem
                            icon={<LogOut size={20} color="#EF4444" />}
                            label="Sair do modo anfitrião"
                            onPress={onLogout}
                            danger
                        />
                    </View>
                </Animated.View>
            </View>
        </ScrollView>
    );
}
