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
                <Text style={styles.value}>{monthTotal}</Text>
                <Text style={styles.label}>{monthName.toUpperCase()}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.value}>{yearTotal}</Text>
                <Text style={styles.label}>TOTAL 2026</Text>
            </View>
            <View style={styles.card}>
                <Text style={[styles.value, { color: Colors.success }]}>{remaining}</Text>
                <Text style={styles.label}>RESTANTES</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    card: {
        flex: 1,
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 4,
    },
    label: {
        fontSize: 10,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
});
