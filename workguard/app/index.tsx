import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '../src/constants/Colors';
import { getAnnualTotal, getMonthlyStats, addLog, getLogs, deleteLog, initDB } from '../src/db/db';
import { DashboardHeader } from '../src/components/DashboardHeader';
import { ProgressCard } from '../src/components/ProgressCard';
import { StatsRow } from '../src/components/StatsRow';
import { ActionButtons } from '../src/components/ActionButtons';
import { HistoryList } from '../src/components/HistoryList';

const ANNUAL_CAP = 964;

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [annualTotal, setAnnualTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [logs, setLogs] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      await initDB();
      const now = new Date();
      const year = now.getFullYear();

      // Annual Stats
      const annual = await getAnnualTotal(year);
      setAnnualTotal(annual);

      // Monthly Stats
      const monthIndex = now.getMonth(); // 0-11
      const monthStats = await getMonthlyStats(year);

      const currentMonthStr = (monthIndex + 1).toString().padStart(2, '0');
      const currentMonthStat = monthStats.find((s: any) => s.month === currentMonthStr);
      setMonthlyTotal(currentMonthStat?.total || 0);

      // Logs
      const recentLogs = await getLogs(year);
      setLogs(recentLogs);

    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleAddToday = async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await addLog(todayStr, 12, 'standard');
      await loadData();
      Alert.alert('Succès', '12 heures ajoutées pour aujourd\'hui !');
    } catch (e) {
      Alert.alert('Erreur', 'Impossible d\'ajouter les heures');
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Supprimer",
      "Voulez-vous vraiment supprimer cette entrée ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await deleteLog(id);
            await loadData();
          }
        }
      ]
    );
  };

  if (loading && annualTotal === 0) {
    return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  const currentYear = new Date().getFullYear();
  const currentMonthName = new Date().toLocaleString('fr-FR', { month: 'long' });
  const remaining = Math.max(0, ANNUAL_CAP - annualTotal);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <DashboardHeader />

      <ProgressCard
        year={currentYear}
        currentHours={annualTotal}
        maxHours={ANNUAL_CAP}
      />

      <StatsRow
        monthName={currentMonthName}
        monthTotal={monthlyTotal}
        yearTotal={annualTotal}
        remaining={remaining}
      />

      <ActionButtons
        onAddToday={handleAddToday}
        onAddMissed={() => router.push('/add' as any)}
        onAddManual={() => router.push('/add' as any)}
      />

      <HistoryList
        logs={logs}
        onDelete={handleDelete}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
});
