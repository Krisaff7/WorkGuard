import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface ActionButtonsProps {
    onAddToday: () => void;
    onAddMissed: () => void;
    onAddManual: () => void;
}

export const ActionButtons = ({ onAddToday, onAddMissed, onAddManual }: ActionButtonsProps) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.mainButton} onPress={onAddToday}>
                <View style={styles.iconCircle}>
                    <Ionicons name="time-outline" size={24} color="white" />
                </View>
                <View style={styles.mainContent}>
                    <Text style={styles.mainTitle}>J'ai travaillé aujourd'hui</Text>
                    <Text style={styles.mainSubtitle}>+12 heures</Text>
                </View>
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={onAddMissed}>
                <Ionicons name="calendar-outline" size={20} color={Colors.text} style={styles.icon} />
                <Text style={styles.secondaryText}>Ajouter un jour oublié (+12h)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={onAddManual}>
                <Ionicons name="add-circle-outline" size={20} color={Colors.text} style={styles.icon} />
                <Text style={styles.secondaryText}>Ajouter des heures manuellement</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    mainButton: {
        backgroundColor: '#2563EB', // Bright blue from mockup
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    mainContent: {
        flex: 1,
    },
    mainTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    mainSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    secondaryButton: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    secondaryText: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '500',
    },
    icon: {
        marginRight: 8,
    },
});
