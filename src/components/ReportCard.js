// src/components/ReportCard.js
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CategoryBadge from './CategoryBadge';
import { StatusBadge, SeverityDot } from './StatusBadge';
import { colors, spacing, radius } from '../theme/colors';
import { formatDateShort } from '../utils/categories';

export default function ReportCard({ report, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      android_ripple={{ color: colors.divider }}
    >
      {report.photo_uri ? (
        <Image source={{ uri: report.photo_uri }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.photoPlaceholder]}>
          <Ionicons name="image-outline" size={28} color={colors.textTertiary} />
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <CategoryBadge categoryId={report.category} size="sm" />
          <StatusBadge statusId={report.status} />
        </View>

        <Text style={styles.title} numberOfLines={2}>{report.title}</Text>

        {report.location ? (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={colors.textTertiary} />
            <Text style={styles.location} numberOfLines={1}>{report.location}</Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <SeverityDot severityId={report.severity} />
          <Text style={styles.date}>{formatDateShort(report.created_at)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  photo: {
    width: 100,
    height: '100%',
    minHeight: 120,
  },
  photoPlaceholder: {
    backgroundColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    padding: spacing.md,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
  },
});
