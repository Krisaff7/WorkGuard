import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface DashboardHeaderProps {
    onBack?: () => void;
}

export const DashboardHeader = ({ onBack }: DashboardHeaderProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                )}
                <View style={styles.iconBox}>
                    <Ionicons name="shield-outline" size={20} color="white" />
                </View>
                <Text style={styles.title}>WorkGuard</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        paddingTop: 60,
        paddingBottom: 30,
        alignItems: 'center',
        marginHorizontal: -20,
        marginTop: -20,
        marginBottom: 20,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        position: 'relative',
        width: '100%',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 20,
        padding: 8,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
});
