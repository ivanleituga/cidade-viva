// src/screens/StatsScreen.js
// Tela de estatísticas: total, distribuição por status, por categoria e por gravidade.
// Usa barras horizontais simples (sem libs externas) para deixar o app leve.

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { getStats } from '../database/db';
import {
  CATEGORIES,
  STATUSES,
  SEVERITIES,
  getCategory,
  getStatus,
  getSeverity,
} from '../utils/categories';
import EmptyState from '../components/EmptyState';
import { colors, spacing, radius } from '../theme/colors';

export default function StatsScreen() {
  const [stats, setStats] = useState({ total: 0, byStatus: [], byCategory: [], bySeverity: [] });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const s = await getStats();
    setStats(s);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const max = (arr) => arr.reduce((m, x) => Math.max(m, x.c), 0) || 1;

  if (stats.total === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <EmptyState
          icon="stats-chart-outline"
          title="Sem dados para mostrar"
          message="Cadastre alguns registros e volte aqui para acompanhar a evolução."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor={colors.primary}
          />
        }
      >
        {/* Card total */}
        <View style={styles.totalCard}>
          <View style={styles.totalIcon}>
            <Ionicons name="document-text" size={28} color="#FFF" />
          </View>
          <View>
            <Text style={styles.totalValue}>{stats.total}</Text>
            <Text style={styles.totalLabel}>registros no total</Text>
          </View>
        </View>

        {/* Status */}
        <Section title="Por status">
          {STATUSES.map((s) => {
            const count = stats.byStatus.find((b) => b.status === s.id)?.c ?? 0;
            return (
              <BarRow
                key={s.id}
                label={s.label}
                value={count}
                max={stats.total}
                color={s.color}
                icon={s.icon}
              />
            );
          })}
        </Section>

        {/* Categoria */}
        <Section title="Por categoria">
          {stats.byCategory.map((row) => {
            const cat = getCategory(row.category);
            return (
              <BarRow
                key={cat.id}
                label={cat.label}
                value={row.c}
                max={max(stats.byCategory)}
                color={cat.color}
                icon={cat.icon}
              />
            );
          })}
        </Section>

        {/* Gravidade */}
        <Section title="Por gravidade">
          {SEVERITIES.map((s) => {
            const count = stats.bySeverity.find((b) => b.severity === s.id)?.c ?? 0;
            return (
              <BarRow
                key={s.id}
                label={s.label}
                value={count}
                max={stats.total}
                color={s.color}
              />
            );
          })}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function BarRow({ label, value, max, color, icon }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <View style={styles.barRow}>
      <View style={styles.barHeader}>
        <View style={styles.barLabelWrap}>
          {icon ? <Ionicons name={icon} size={14} color={color} /> : null}
          <Text style={styles.barLabel}>{label}</Text>
        </View>
        <Text style={[styles.barValue, { color }]}>{value}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },

  totalCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  totalIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalValue: { fontSize: 32, fontWeight: '800', color: '#FFF', lineHeight: 36 },
  totalLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },

  section: { marginBottom: spacing.xl },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },

  barRow: {},
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  barLabelWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  barLabel: { fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  barValue: { fontSize: 14, fontWeight: '700' },

  barTrack: {
    height: 8,
    backgroundColor: colors.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 4 },
});
