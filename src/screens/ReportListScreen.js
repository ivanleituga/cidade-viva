// src/screens/ReportListScreen.js
// Lista todos os registros com filtros horizontais por categoria e status.

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { listReports } from '../database/db';
import ReportCard from '../components/ReportCard';
import EmptyState from '../components/EmptyState';
import { CATEGORIES, STATUSES } from '../utils/categories';
import { colors, spacing, radius } from '../theme/colors';

export default function ReportListScreen({ navigation }) {
  const [reports, setReports] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  const load = useCallback(async () => {
    const data = await listReports({
      category: categoryFilter,
      status: statusFilter,
    });
    setReports(data);
  }, [categoryFilter, statusFilter]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const clearFilters = () => {
    setCategoryFilter(null);
    setStatusFilter(null);
  };

  const hasFilter = !!(categoryFilter || statusFilter);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Filtros de status */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Status</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <FilterChip
            label="Todos"
            active={!statusFilter}
            onPress={() => setStatusFilter(null)}
          />
          {STATUSES.map((s) => (
            <FilterChip
              key={s.id}
              label={s.label}
              color={s.color}
              active={statusFilter === s.id}
              onPress={() => setStatusFilter(s.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Filtros de categoria */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Categoria</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <FilterChip
            label="Todas"
            active={!categoryFilter}
            onPress={() => setCategoryFilter(null)}
          />
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              label={c.label}
              color={c.color}
              icon={c.icon}
              active={categoryFilter === c.id}
              onPress={() => setCategoryFilter(c.id)}
            />
          ))}
        </ScrollView>
      </View>

      {hasFilter && (
        <Pressable onPress={clearFilters} style={styles.clearBtn}>
          <Ionicons name="close-circle" size={14} color={colors.primary} />
          <Text style={styles.clearText}>Limpar filtros</Text>
        </Pressable>
      )}

      {/* Lista */}
      <FlatList
        data={reports}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={
          reports.length === 0 ? styles.emptyContainer : styles.list
        }
        renderItem={({ item }) => (
          <ReportCard
            report={item}
            onPress={() =>
              navigation.navigate('ReportDetail', { reportId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="Nenhum registro encontrado"
            message={
              hasFilter
                ? 'Tente limpar os filtros ou criar um novo registro.'
                : 'Crie o primeiro registro tocando no botão +.'
            }
          />
        }
      />

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
        onPress={() => navigation.navigate('ReportForm')}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </Pressable>
    </SafeAreaView>
  );
}

function FilterChip({ label, color, icon, active, onPress }) {
  const bg = active ? color || colors.primary : colors.surface;
  const fg = active ? '#FFF' : colors.textSecondary;
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: bg, borderColor: active ? bg : colors.border },
      ]}
    >
      {icon ? <Ionicons name={icon} size={13} color={fg} /> : null}
      <Text style={[styles.chipText, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  filterSection: {
    paddingTop: spacing.md,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  filterRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },

  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    gap: 4,
  },
  clearText: { color: colors.primary, fontSize: 13, fontWeight: '600' },

  list: { padding: spacing.lg, paddingBottom: 100 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center' },

  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
