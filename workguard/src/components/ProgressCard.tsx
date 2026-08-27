import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface ProgressCardProps {
    year?: number;
    currentHours: number;
    maxHours: number;
}

export const ProgressCard = ({ currentHours, maxHours }: ProgressCardProps) => {
    const progress = Math.min(Math.max(currentHours / maxHours, 0), 1);
    const isExceeded = currentHours > maxHours;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1}>Progression du quota</Text>
                <Text style={[styles.value, isExceeded && { color: Colors.primary }]} numberOfLines={1}>
                    {currentHours} / {maxHours} h
                </Text>
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
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    value: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.text,
    },
    track: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        backgroundColor: Colors.success,
        borderRadius: 4,
    },
});
