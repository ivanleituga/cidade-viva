// src/screens/HomeScreen.js
// Dashboard inicial: saudação, contagem rápida, registros recentes e CTA para novo.

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { listReports, getStats } from '../database/db';
import ReportCard from '../components/ReportCard';
import EmptyState from '../components/EmptyState';
import { colors, spacing, radius } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const [recent, setRecent] = useState([]);
  const [stats, setStats] = useState({ total: 0, byStatus: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [all, s] = await Promise.all([listReports(), getStats()]);
    setRecent(all.slice(0, 3));
    setStats(s);
    setLoading(false);
    setRefreshing(false);
  }, []);

  // useFocusEffect garante que a tela recarrega ao voltar do form/detalhe
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const countByStatus = (id) =>
    stats.byStatus.find((b) => b.status === id)?.c ?? 0;

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, cidadão</Text>
          <Text style={styles.subtitle}>
            Registre problemas do seu bairro e acompanhe a evolução.
          </Text>
        </View>

        {/* CTA principal */}
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
          onPress={() => navigation.navigate('ReportForm')}
        >
          <View style={styles.ctaIcon}>
            <Ionicons name="add" size={28} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>Registrar novo problema</Text>
            <Text style={styles.ctaSubtitle}>
              Buraco, iluminação, foco de dengue...
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#FFF" />
        </Pressable>

        {/* Cards de contagem */}
        <View style={styles.statsRow}>
          <StatCard
            label="Total"
            value={stats.total}
            color={colors.primary}
            icon="document-text"
          />
          <StatCard
            label="Abertos"
            value={countByStatus('aberto')}
            color={colors.statusOpen}
            icon="time"
          />
          <StatCard
            label="Resolvidos"
            value={countByStatus('resolvido')}
            color={colors.statusResolved}
            icon="checkmark-circle"
          />
        </View>

        {/* Recentes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Registros recentes</Text>
            <Pressable onPress={() => navigation.navigate('ReportsTab')}>
              <Text style={styles.sectionLink}>Ver todos</Text>
            </Pressable>
          </View>

          {loading ? null : recent.length === 0 ? (
            <View style={styles.emptyWrap}>
              <EmptyState
                icon="map-outline"
                title="Nenhum registro ainda"
                message="Toque em “Registrar novo problema” para começar."
              />
            </View>
          ) : (
            recent.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                onPress={() =>
                  navigation.navigate('ReportDetail', { reportId: r.id })
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '1A' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },

  header: { marginBottom: spacing.lg },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },

  cta: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  ctaIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTitle: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  ctaSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 },

  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  section: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  sectionLink: { fontSize: 13, color: colors.primary, fontWeight: '600' },

  emptyWrap: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 200,
    justifyContent: 'center',
  },
});
