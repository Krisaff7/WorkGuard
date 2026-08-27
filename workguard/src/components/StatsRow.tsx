import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface StatsRowProps {
    monthName: string;
    monthTotal: number;
    yearTotal: number;
    remaining: number;
}

export const StatsRow = ({ monthName, monthTotal, yearTotal, remaining }: StatsRowProps) => {
    return (
        <View style={styles.row}>
            <View style={styles.card}>
                <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
                    {monthTotal}
                </Text>
                <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit>
                    {monthName.toUpperCase()}
                </Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
                    {yearTotal}
                </Text>
                <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit>
                    TOTAL PÉRIODE
                </Text>
            </View>
            <View style={styles.card}>
                <Text style={[styles.value, { color: Colors.success }]} numberOfLines={1} adjustsFontSizeToFit>
                    {remaining}
                </Text>
                <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit>
                    RESTANTES
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 10,
        width: '100%',
    },
    card: {
        flex: 1,
        backgroundColor: Colors.card,
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    value: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 4,
        textAlign: 'center',
    },
    label: {
        fontSize: 10,
        color: Colors.textSecondary,
        fontWeight: '700',
        letterSpacing: 0.4,
        textAlign: 'center',
    },
});
