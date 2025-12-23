import { View, Text, Pressable } from 'react-native';

interface Tab {
    id: string;
    label: string;
}

interface ProfileTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export function ProfileTabs({ tabs, activeTab, onTabChange }: ProfileTabsProps) {
    return (
        <View className="flex-row items-center justify-center p-2 bg-white border-b border-slate-50 gap-2">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <Pressable
                        key={tab.id}
                        onPress={() => onTabChange(tab.id)}
                        className={`px-6 py-2 rounded-full transition-all active:scale-95 ${isActive ? 'bg-slate-900 shadow-xl shadow-slate-900/20' : 'bg-transparent'}`}
                    >
                        <Text className={`font-bold text-sm ${isActive ? 'text-white' : 'text-slate-500'}`}>
                            {tab.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
