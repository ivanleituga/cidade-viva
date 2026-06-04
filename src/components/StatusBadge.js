// src/components/StatusBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStatus, getSeverity } from '../utils/categories';
import { radius } from '../theme/colors';

export function StatusBadge({ statusId }) {
  const st = getStatus(statusId);
  return (
    <View style={[styles.wrap, { backgroundColor: st.color }]}>
      <Ionicons name={st.icon} size={12} color="#FFF" />
      <Text style={styles.label}>{st.label}</Text>
    </View>
  );
}

export function SeverityDot({ severityId }) {
  const sv = getSeverity(severityId);
  return (
    <View style={styles.severityRow}>
      <View style={[styles.dot, { backgroundColor: sv.color }]} />
      <Text style={[styles.severityText, { color: sv.color }]}>{sv.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 4,
  },
  label: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  severityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
