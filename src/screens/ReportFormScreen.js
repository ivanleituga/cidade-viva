// src/screens/ReportFormScreen.js
// Formulário reaproveitado para CRIAR (sem reportId) e EDITAR (com reportId).
// Implementa validação básica, seleção visual de categoria/severidade/status,
// e anexo de foto via expo-image-picker.

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';

import {
  createReport,
  updateReport,
  getReportById,
} from '../database/db';
import { CATEGORIES, SEVERITIES, STATUSES } from '../utils/categories';
import { colors, spacing, radius } from '../theme/colors';

const INITIAL = {
  title: '',
  category: 'buraco',
  description: '',
  location: '',
  severity: 'media',
  status: 'aberto',
  photo_uri: null,
  reporter_name: '',
};

export default function ReportFormScreen({ navigation, route }) {
  const reportId = route.params?.reportId;
  const isEditing = !!reportId;

  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Carrega dados se for edição
  useFocusEffect(
    useCallback(() => {
      if (!isEditing) {
        setForm(INITIAL);
        return;
      }
      (async () => {
        const r = await getReportById(reportId);
        if (r) {
          setForm({
            title: r.title,
            category: r.category,
            description: r.description ?? '',
            location: r.location ?? '',
            severity: r.severity ?? 'media',
            status: r.status ?? 'aberto',
            photo_uri: r.photo_uri,
            reporter_name: r.reporter_name ?? '',
          });
        }
      })();
    }, [isEditing, reportId])
  );

  const update = (key) => (value) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Informe um título';
    else if (form.title.trim().length < 5)
      e.title = 'Mínimo 5 caracteres';
    if (!form.category) e.category = 'Escolha uma categoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEditing) {
        await updateReport(reportId, form);
      } else {
        await createReport(form);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar o registro.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita o acesso às fotos para anexar uma imagem.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      update('photo_uri')(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita o acesso à câmera para tirar uma foto.'
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      update('photo_uri')(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Título */}
        <Field
          label="Título *"
          error={errors.title}
        >
          <TextInput
            value={form.title}
            onChangeText={update('title')}
            placeholder="Ex: Buraco grande na esquina"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
          />
        </Field>

        {/* Categoria */}
        <Field label="Categoria *" error={errors.category}>
          <View style={styles.grid}>
            {CATEGORIES.map((c) => {
              const active = form.category === c.id;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => update('category')(c.id)}
                  style={[
                    styles.categoryItem,
                    active && { borderColor: c.color, backgroundColor: c.color + '12' },
                  ]}
                >
                  <Ionicons
                    name={c.icon}
                    size={20}
                    color={active ? c.color : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      active && { color: c.color, fontWeight: '700' },
                    ]}
                    numberOfLines={2}
                  >
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Field>

        {/* Severidade */}
        <Field label="Gravidade">
          <View style={styles.severityRow}>
            {SEVERITIES.map((s) => {
              const active = form.severity === s.id;
              return (
                <Pressable
                  key={s.id}
                  onPress={() => update('severity')(s.id)}
                  style={[
                    styles.severityBtn,
                    active && { backgroundColor: s.color, borderColor: s.color },
                  ]}
                >
                  <Text
                    style={[
                      styles.severityText,
                      active && { color: '#FFF' },
                    ]}
                  >
                    {s.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Field>

        {/* Status — só em edição */}
        {isEditing && (
          <Field label="Status">
            <View style={styles.severityRow}>
              {STATUSES.map((s) => {
                const active = form.status === s.id;
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => update('status')(s.id)}
                    style={[
                      styles.severityBtn,
                      active && { backgroundColor: s.color, borderColor: s.color },
                    ]}
                  >
                    <Text
                      style={[
                        styles.severityText,
                        active && { color: '#FFF' },
                      ]}
                    >
                      {s.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>
        )}

        {/* Localização */}
        <Field label="Localização">
          <TextInput
            value={form.location}
            onChangeText={update('location')}
            placeholder="Ex: R. Voluntários da Pátria, 250 — Botafogo"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
          />
        </Field>

        {/* Descrição */}
        <Field label="Descrição">
          <TextInput
            value={form.description}
            onChangeText={update('description')}
            placeholder="Detalhe o problema, tamanho, há quanto tempo está assim..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.inputMultiline]}
          />
        </Field>

        {/* Quem registrou (opcional) */}
        <Field label="Seu nome (opcional)">
          <TextInput
            value={form.reporter_name}
            onChangeText={update('reporter_name')}
            placeholder="Como você quer ser identificado"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
          />
        </Field>

        {/* Foto */}
        <Field label="Foto (opcional)">
          {form.photo_uri ? (
            <View style={styles.photoWrap}>
              <Image source={{ uri: form.photo_uri }} style={styles.photo} />
              <Pressable
                style={styles.photoRemove}
                onPress={() => update('photo_uri')(null)}
              >
                <Ionicons name="close" size={18} color="#FFF" />
              </Pressable>
            </View>
          ) : (
            <View style={styles.photoButtons}>
              <Pressable style={styles.photoBtn} onPress={takePhoto}>
                <Ionicons name="camera" size={20} color={colors.primary} />
                <Text style={styles.photoBtnText}>Câmera</Text>
              </Pressable>
              <Pressable style={styles.photoBtn} onPress={pickImage}>
                <Ionicons name="image" size={20} color={colors.primary} />
                <Text style={styles.photoBtnText}>Galeria</Text>
              </Pressable>
            </View>
          )}
        </Field>

        {/* Botões de ação */}
        <View style={styles.actions}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.actionBtn, styles.actionSecondary]}
          >
            <Text style={styles.actionSecondaryText}>Cancelar</Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={[styles.actionBtn, styles.actionPrimary, saving && { opacity: 0.7 }]}
          >
            <Ionicons name="save" size={18} color="#FFF" />
            <Text style={styles.actionPrimaryText}>
              {saving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, error, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },

  field: { marginBottom: spacing.lg },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  fieldError: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    fontWeight: '600',
  },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryItem: {
    width: '31%',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    gap: 6,
    minHeight: 80,
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },

  severityRow: { flexDirection: 'row', gap: spacing.sm },
  severityBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  severityText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  photoButtons: { flexDirection: 'row', gap: spacing.md },
  photoBtn: {
    flex: 1,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  photoBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  photoWrap: { position: 'relative' },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: radius.md,
    backgroundColor: colors.divider,
  },
  photoRemove: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  actionPrimary: { backgroundColor: colors.primary },
  actionSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionPrimaryText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  actionSecondaryText: { color: colors.textSecondary, fontSize: 15, fontWeight: '600' },
});
