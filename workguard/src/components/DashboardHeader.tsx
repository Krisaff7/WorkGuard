import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface DashboardHeaderProps {
    onBack?: () => void;
}

export const DashboardHeader = ({ onBack }: DashboardHeaderProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                )}
                <View style={styles.centerBox}>
                    <View style={styles.iconBox}>
                        <Ionicons name="shield-outline" size={20} color="white" />
                    </View>
                    <Text style={styles.title}>WorkGuard</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        paddingTop: Platform.OS === 'ios' ? 56 : 48,
        paddingBottom: 24,
        paddingHorizontal: 20,
        marginHorizontal: -20,
        marginTop: -20,
        marginBottom: 20,
    },
    innerContainer: {
        width: '100%',
        maxWidth: 640,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    centerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        padding: 6,
        zIndex: 10,
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
        letterSpacing: 0.3,
    },
});
