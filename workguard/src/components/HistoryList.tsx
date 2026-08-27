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

interface PeriodGroup {
    id: string;
    title: string;
    subtitle: string;
    totalHours: number;
    logsCount: number;
    months: Record<string, Log[]>;
}

export const HistoryList = ({ logs, onDelete }: HistoryListProps) => {
    // Helper to format short date
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    const formatPeriodDate = (d: Date) => {
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Build 1-year periods from chronological logs
    const periods: PeriodGroup[] = React.useMemo(() => {
        if (logs.length === 0) return [];

        const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));
        const groups: PeriodGroup[] = [];

        let currentPeriod: PeriodGroup | null = null;
        let pEnd: Date | null = null;

        for (const log of sortedLogs) {
            const logDate = new Date(log.date + 'T00:00:00');

            if (!currentPeriod || !pEnd || logDate > pEnd) {
                const pStart = new Date(logDate);
                pEnd = new Date(pStart);
                pEnd.setFullYear(pEnd.getFullYear() + 1);

                const startYear = pStart.getFullYear();
                const endYear = pEnd.getFullYear();
                const title = startYear === endYear ? `Période ${startYear}` : `Période ${startYear} - ${endYear}`;
                const subtitle = `${formatPeriodDate(pStart)} → ${formatPeriodDate(pEnd)}`;

                currentPeriod = {
                    id: `period_${log.date}`,
                    title,
                    subtitle,
                    totalHours: 0,
                    logsCount: 0,
                    months: {}
                };
                groups.push(currentPeriod);
            }

            currentPeriod.totalHours += log.hours;
            currentPeriod.logsCount += 1;

            const monthKey = log.date.substring(0, 7); // YYYY-MM
            if (!currentPeriod.months[monthKey]) {
                currentPeriod.months[monthKey] = [];
            }
            currentPeriod.months[monthKey].push(log);
        }

        return groups.reverse(); // Newest periods first
    }, [logs]);

    // Track expanded periods and months
    const [expandedPeriods, setExpandedPeriods] = useState<Record<string, boolean>>(() => {
        if (periods.length === 0) return {};
        return { [periods[0].id]: true };
    });

    const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>(() => {
        if (periods.length === 0) return {};
        const firstPeriod = periods[0];
        const monthKeys = Object.keys(firstPeriod.months).sort().reverse();
        if (monthKeys.length === 0) return {};
        return { [`${firstPeriod.id}_${monthKeys[0]}`]: true };
    });

    const togglePeriodExpand = (periodId: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedPeriods(prev => ({
            ...prev,
            [periodId]: !prev[periodId]
        }));
    };

    const toggleMonthExpand = (key: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedMonths(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const getMonthLabel = (monthKey: string) => {
        const [year, month] = monthKey.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
    };

    if (logs.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Historique</Text>
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>Aucune entrée enregistrée</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Historique</Text>

            {periods.map((period) => {
                const isPeriodExpanded = expandedPeriods[period.id];
                const monthKeys = Object.keys(period.months).sort().reverse();

                return (
                    <View key={period.id} style={styles.periodCard}>
                        {/* Period Header */}
                        <TouchableOpacity
                            style={styles.periodHeader}
                            onPress={() => togglePeriodExpand(period.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.periodHeaderLeft}>
                                <View style={styles.periodBadge}>
                                    <Ionicons name="calendar" size={16} color="white" />
                                </View>
                                <View>
                                    <Text style={styles.periodTitle}>{period.title}</Text>
                                    <Text style={styles.periodSubtitle}>{period.subtitle}</Text>
                                </View>
                            </View>

                            <View style={styles.periodHeaderRight}>
                                <Text style={styles.periodTotalHours}>{period.totalHours}h</Text>
                                <Ionicons
                                    name={isPeriodExpanded ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={Colors.primary}
                                />
                            </View>
                        </TouchableOpacity>

                        {/* Months inside Period */}
                        {isPeriodExpanded && (
                            <View style={styles.monthsContainer}>
                                {monthKeys.map((monthKey) => {
                                    const monthLogs = period.months[monthKey].sort((a, b) => b.date.localeCompare(a.date));
                                    const monthTotalHours = monthLogs.reduce((acc, log) => acc + log.hours, 0);
                                    const monthStateKey = `${period.id}_${monthKey}`;
                                    const isMonthExpanded = expandedMonths[monthStateKey];

                                    return (
                                        <View key={monthKey} style={styles.monthCard}>
                                            {/* Month Header */}
                                            <TouchableOpacity
                                                style={styles.monthHeader}
                                                onPress={() => toggleMonthExpand(monthStateKey)}
                                                activeOpacity={0.7}
                                            >
                                                <View style={styles.monthHeaderLeft}>
                                                    <Text style={styles.monthName}>{getMonthLabel(monthKey)}</Text>
                                                    <Text style={styles.monthCount}>({monthLogs.length})</Text>
                                                </View>

                                                <View style={styles.monthHeaderRight}>
                                                    <Text style={styles.monthTotalHours}>{monthTotalHours}h</Text>
                                                    <Ionicons
                                                        name={isMonthExpanded ? "chevron-up" : "chevron-down"}
                                                        size={18}
                                                        color={Colors.textSecondary}
                                                    />
                                                </View>
                                            </TouchableOpacity>

                                            {/* Days list inside Month */}
                                            {isMonthExpanded && (
                                                <View style={styles.daysList}>
                                                    {monthLogs.map((log) => (
                                                        <View key={log.id} style={styles.dayItem}>
                                                            <View style={styles.dayItemLeft}>
                                                                <View style={[styles.dot, { backgroundColor: log.type === 'manual' ? Colors.warning : Colors.primary }]} />
                                                                <View>
                                                                    <Text style={styles.dateText}>{formatDate(log.date)}</Text>
                                                                    {log.type === 'manual' && <Text style={styles.manualLabel}>(manuel)</Text>}
                                                                </View>
                                                            </View>
                                                            <View style={styles.dayItemRight}>
                                                                <Text style={styles.hoursText}>{log.hours}h</Text>
                                                                <TouchableOpacity
                                                                    onPress={() => onDelete(log.id)}
                                                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                                >
                                                                    <Ionicons name="trash-outline" size={18} color={Colors.danger} />
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
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    periodCard: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    periodHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F8FAFC',
    },
    periodHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    periodBadge: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    periodTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
    },
    periodSubtitle: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    periodHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    periodTotalHours: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    monthsContainer: {
        padding: 12,
        backgroundColor: Colors.card,
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    monthCard: {
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: '#FAFAFA',
    },
    monthHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
    },
    monthName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
        textTransform: 'capitalize',
    },
    monthCount: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    monthHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    monthTotalHours: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    daysList: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        backgroundColor: Colors.card,
    },
    dayItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dayItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    dateText: {
        fontSize: 14,
        color: Colors.text,
        textTransform: 'capitalize',
    },
    manualLabel: {
        fontSize: 11,
        color: Colors.textSecondary,
    },
    dayItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    hoursText: {
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
