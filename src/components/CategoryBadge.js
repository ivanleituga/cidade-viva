// src/components/CategoryBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategory } from '../utils/categories';
import { radius, spacing } from '../theme/colors';

export default function CategoryBadge({ categoryId, size = 'md' }) {
  const cat = getCategory(categoryId);
  const isSm = size === 'sm';
  return (
    <View style={[styles.wrap, { backgroundColor: cat.color + '1A' }, isSm && styles.sm]}>
      <Ionicons name={cat.icon} size={isSm ? 12 : 14} color={cat.color} />
      <Text style={[styles.label, { color: cat.color }, isSm && styles.labelSm]} numberOfLines={1}>
        {cat.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 4,
  },
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  labelSm: {
    fontSize: 11,
  },
});
