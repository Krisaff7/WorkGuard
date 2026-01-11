import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

interface Log {
    id: number;
    date: string;
    hours: number;
    type: string;
}

interface HistoryListProps {
    logs: Log[];
    onDelete: (id: number) => void;
}

export const HistoryList = ({ logs, onDelete }: HistoryListProps) => {
    // State to track which months are expanded
    const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>(() => {
        // Expand the most recent month by default
        if (logs.length === 0) return {};
        const dates = logs.map(l => l.date).sort();
        const latestDate = dates[dates.length - 1];
        const monthKey = latestDate.substring(0, 7); // YYYY-MM
        return { [monthKey]: true };
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    const toggleExpand = (monthKey: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedMonths(prev => ({
            ...prev,
            [monthKey]: !prev[monthKey]
        }));
    };

    // Group logs by month (YYYY-MM)
    const groupedLogs = logs.reduce((acc, log) => {
        const monthKey = log.date.substring(0, 7); // YYYY-MM
        if (!acc[monthKey]) acc[monthKey] = [];
        acc[monthKey].push(log);
        return acc;
    }, {} as Record<string, Log[]>);

    // Get sorted month keys (descending)
    const monthKeys = Object.keys(groupedLogs).sort().reverse();

    const getMonthName = (monthKey: string) => {
        const [year, month] = monthKey.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleString('fr-FR', { month: 'long' });
    };

    const currentYear = new Date().getFullYear();

    if (logs.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Historique {currentYear}</Text>
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>Aucune entrée pour cette année</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Historique {currentYear}</Text>

            {monthKeys.map((monthKey) => {
                const monthLogs = groupedLogs[monthKey].sort((a, b) => b.date.localeCompare(a.date));
                const totalHours = monthLogs.reduce((acc, log) => acc + log.hours, 0);
                const isExpanded = expandedMonths[monthKey];

                return (
                    <View key={monthKey} style={styles.card}>
                        <TouchableOpacity
                            style={[styles.cardHeader, !isExpanded && { marginBottom: 0 }]}
                            onPress={() => toggleExpand(monthKey)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.headerLeft}>
                                <Text style={styles.monthName}>{getMonthName(monthKey)}</Text>
                                <Text style={styles.entryCount}>({monthLogs.length})</Text>
                            </View>
                            <View style={styles.headerRight}>
                                <Text style={styles.totalHours}>{totalHours}h</Text>
                                <Ionicons
                                    name={isExpanded ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={Colors.primary}
                                />
                            </View>
                        </TouchableOpacity>

                        {isExpanded && (
                            <View style={styles.list}>
                                {monthLogs.map((log) => (
                                    <View key={log.id} style={styles.item}>
                                        <View style={styles.itemLeft}>
                                            <View style={[styles.dot, { backgroundColor: log.type === 'manual' ? Colors.warning : Colors.primary }]} />
                                            <View>
                                                <Text style={styles.date}>{formatDate(log.date)}</Text>
                                                {log.type === 'manual' && <Text style={styles.manualLabel}>(manuel)</Text>}
                                            </View>
                                        </View>
                                        <View style={styles.itemRight}>
                                            <Text style={styles.hours}>{log.hours}h</Text>
                                            <TouchableOpacity onPress={() => onDelete(log.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 40,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: Colors.card,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    monthName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
        marginRight: 8,
        textTransform: 'capitalize',
    },
    entryCount: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalHours: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
        marginRight: 8,
    },
    list: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 12,
    },
    date: {
        fontSize: 14,
        color: Colors.text,
        textTransform: 'lowercase',
    },
    manualLabel: {
        fontSize: 10,
        color: Colors.textSecondary,
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    hours: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.text,
    },
    emptyCard: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderStyle: 'dashed',
    },
    emptyText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
});
