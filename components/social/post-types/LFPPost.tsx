import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Search, MapPin, Clock, CircleDot } from 'lucide-react-native';

export function LFPPost({ data }: { data: any }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Search size={20} color="black" />
                </View>
                <View>
                    <Text style={styles.title}>{data.type}</Text>
                    <Text style={styles.subtitle}>Misto · Intermediário</Text>
                </View>
                <View style={styles.liveBadge}>
                    <View style={styles.liveContent}>
                        <CircleDot size={8} color="#22c55e" fill="#22c55e" />
                        <Text style={styles.liveText}>Ao Vivo</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.description}>
                Falta 1 jogador pra fechar dupla! Quem topa?
            </Text>

            <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                    <MapPin size={16} color="#666" />
                    <Text style={styles.infoText}>{data.location}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Clock size={16} color="#666" />
                    <Text style={styles.timeText}>{data.time.split(', ')[1]}</Text>
                </View>
            </View>

            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Eu topo!</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F5F5F5',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        backgroundColor: '#F3F4F6',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight: 'bold',
        color: '#000000',
        fontSize: 16,
    },
    subtitle: {
        fontSize: 12,
        color: '#737373',
    },
    liveBadge: {
        marginLeft: 'auto',
        backgroundColor: '#000000',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    liveContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    liveText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    description: {
        fontSize: 14,
        color: '#000000',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    infoRow: {
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#525252',
    },
    timeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000000',
    },
    button: {
        width: '100%',
        backgroundColor: '#000000',
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
