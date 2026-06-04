// src/screens/ReportDetailScreen.js
// Tela de detalhe: mostra todas as infos, permite mudar status rapidamente,
// editar (vai para o form) e deletar com confirmação.

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import {
  getReportById,
  deleteReport,
  updateReportStatus,
} from '../database/db';
import CategoryBadge from '../components/CategoryBadge';
import { StatusBadge, SeverityDot } from '../components/StatusBadge';
import { STATUSES, formatDate } from '../utils/categories';
import { colors, spacing, radius } from '../theme/colors';

export default function ReportDetailScreen({ navigation, route }) {
  const { reportId } = route.params;
  const [report, setReport] = useState(null);

  const load = useCallback(async () => {
    const r = await getReportById(reportId);
    setReport(r);
  }, [reportId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (!report) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Excluir registro',
      'Tem certeza que deseja excluir este registro? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteReport(reportId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleChangeStatus = async (newStatus) => {
    if (newStatus === report.status) return;
    await updateReportStatus(reportId, newStatus);
    await load();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Foto (se houver) */}
        {report.photo_uri ? (
          <Image source={{ uri: report.photo_uri }} style={styles.heroPhoto} />
        ) : (
          <View style={[styles.heroPhoto, styles.heroPlaceholder]}>
            <Ionicons name="image-outline" size={48} color={colors.textTertiary} />
          </View>
        )}

        <View style={styles.body}>
          {/* Badges */}
          <View style={styles.badgesRow}>
            <CategoryBadge categoryId={report.category} />
            <StatusBadge statusId={report.status} />
          </View>

          {/* Título */}
          <Text style={styles.title}>{report.title}</Text>

          {/* Meta info */}
          <View style={styles.metaCard}>
            {report.location ? (
              <MetaRow icon="location" label="Localização" value={report.location} />
            ) : null}
            <MetaRow
              icon="alert-circle"
              label="Gravidade"
              valueComponent={<SeverityDot severityId={report.severity} />}
            />
            <MetaRow
              icon="calendar"
              label="Registrado em"
              value={formatDate(report.created_at)}
            />
            {report.updated_at !== report.created_at && (
              <MetaRow
                icon="refresh"
                label="Atualizado em"
                value={formatDate(report.updated_at)}
              />
            )}
            {report.reporter_name ? (
              <MetaRow icon="person" label="Por" value={report.reporter_name} />
            ) : null}
          </View>

          {/* Descrição */}
          {report.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.description}>{report.description}</Text>
            </View>
          ) : null}

          {/* Atalho de status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Atualizar status</Text>
            <View style={styles.statusRow}>
              {STATUSES.map((s) => {
                const active = report.status === s.id;
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => handleChangeStatus(s.id)}
                    style={[
                      styles.statusBtn,
                      active && { backgroundColor: s.color, borderColor: s.color },
                    ]}
                  >
                    <Ionicons
                      name={s.icon}
                      size={14}
                      color={active ? '#FFF' : s.color}
                    />
                    <Text
                      style={[
                        styles.statusBtnText,
                        active && { color: '#FFF' },
                        !active && { color: s.color },
                      ]}
                    >
                      {s.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Ações finais */}
          <View style={styles.actions}>
            <Pressable
              style={[styles.actionBtn, styles.editBtn]}
              onPress={() =>
                navigation.navigate('ReportForm', { reportId: report.id })
              }
            >
              <Ionicons name="create" size={18} color="#FFF" />
              <Text style={styles.actionText}>Editar</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={handleDelete}
            >
              <Ionicons name="trash" size={18} color="#FFF" />
              <Text style={styles.actionText}>Excluir</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetaRow({ icon, label, value, valueComponent }) {
  return (
    <View style={styles.metaRow}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <View style={{ flex: 1 }}>
        <Text style={styles.metaLabel}>{label}</Text>
        {valueComponent || <Text style={styles.metaValue}>{value}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: colors.textSecondary },

  scroll: { paddingBottom: spacing.xxl },

  heroPhoto: {
    width: '100%',
    height: 240,
    backgroundColor: colors.divider,
  },
  heroPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: { padding: spacing.lg },

  badgesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    lineHeight: 28,
  },

  metaCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 19,
  },

  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  description: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statusBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },

  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  editBtn: { backgroundColor: colors.primary },
  deleteBtn: { backgroundColor: colors.error },
  actionText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
