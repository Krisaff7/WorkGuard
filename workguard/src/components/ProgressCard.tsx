import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface ProgressCardProps {
    year: number;
    currentHours: number;
    maxHours: number;
}

export const ProgressCard = ({ year, currentHours, maxHours }: ProgressCardProps) => {
    const progress = Math.min(Math.max(currentHours / maxHours, 0), 1);

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Progression annuelle {year}</Text>
                <Text style={styles.value}>{currentHours} / {maxHours} h</Text>
            </View>
            <View style={styles.track}>
                <View style={[styles.bar, { width: `${progress * 100}%` }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    title: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    value: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.text,
    },
    track: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        backgroundColor: Colors.success,
        borderRadius: 4,
    },
});
