import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../src/constants/Colors';
import { addLog } from '../src/db/db';
import { DashboardHeader } from '../src/components/DashboardHeader';

export default function AddScreen() {
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [hours, setHours] = useState('12');

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleSave = async () => {
        const hoursNum = parseFloat(hours);
        if (isNaN(hoursNum) || hoursNum <= 0) {
            Alert.alert("Erreur", "Veuillez entrer un nombre d'heures valide.");
            return;
        }

        try {
            const dateStr = date.toISOString().split('T')[0];
            await addLog(dateStr, hoursNum, 'manual');
            Alert.alert("Succès", "Heures ajoutées avec succès !", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (e) {
            console.error('Error saving log:', e);
            Alert.alert("Erreur", "Impossible d'enregistrer.");
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <DashboardHeader onBack={() => router.back()} />

            <View style={styles.formContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Ajouter des heures</Text>
                </View>

                <View style={styles.group}>
                    <Text style={styles.label}>Date</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                        <Text style={styles.inputText}>{date.toLocaleDateString('fr-FR')}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                        />
                    )}
                </View>

                <View style={styles.group}>
                    <Text style={styles.label}>Heures</Text>
                    <TextInput
                        style={styles.input}
                        value={hours}
                        onChangeText={setHours}
                        keyboardType="numeric"
                        placeholder="Ex: 12"
                    />
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: Colors.primary }]} onPress={handleSave}>
                        <Text style={styles.buttonText}>Enregistrer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { backgroundColor: Colors.textSecondary }]} onPress={() => router.back()}>
                        <Text style={styles.buttonText}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    formContainer: {
        paddingTop: 10,
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    group: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    input: {
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        color: Colors.text,
    },
    inputText: {
        fontSize: 16,
        color: Colors.text,
    },
    buttonRow: {
        gap: 12,
        marginTop: 10,
    },
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
