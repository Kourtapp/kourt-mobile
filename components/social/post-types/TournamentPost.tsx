import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Trophy } from 'lucide-react-native';

export function TournamentPost({ data }: { data: any }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Trophy size={16} color="white" />
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{data.badge}</Text>
                </View>
            </View>

            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.subtitle}>{data.subtitle}</Text>

            <View style={styles.prizeRow}>
                <Text style={styles.prize}>{data.prize}</Text>
                <Text style={styles.prizeLabel}>em prêmios</Text>
            </View>

            <View style={styles.infoRow}>
                <View>
                    <Text style={styles.infoValue}>{data.date}</Text>
                    <Text style={styles.infoLabel}>Data</Text>
                </View>
                <View>
                    <Text style={[styles.infoValue, { textAlign: 'right' }]}>{data.spots}</Text>
                    <Text style={[styles.infoLabel, { textAlign: 'right' }]}>Vagas</Text>
                </View>
            </View>

            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Inscrever-se · {data.price}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1f1f1f',
        borderRadius: 16,
        padding: 20,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subtitle: {
        color: '#A3A3A3',
        fontSize: 14,
        marginBottom: 16,
    },
    prizeRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 24,
    },
    prize: {
        fontSize: 30,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    prizeLabel: {
        color: '#A3A3A3',
        fontSize: 12,
        marginLeft: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    infoValue: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    infoLabel: {
        color: '#737373',
        fontSize: 10,
    },
    button: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
