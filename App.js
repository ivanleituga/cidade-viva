// App.js
// Entry point do app.
// Responsabilidades:
//   - Inicializar o banco SQLite uma única vez
//   - (Opcional) popular dados de exemplo na primeira execução
//   - Renderizar o navegador de telas

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase, seedSampleData } from './src/database/db';
import { colors } from './src/theme/colors';

// Mude para `false` antes de entregar se não quiser dados de exemplo iniciais.
const SEED_SAMPLE_DATA = true;

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await initDatabase();
        if (SEED_SAMPLE_DATA) await seedSampleData();
        setReady(true);
      } catch (e) {
        console.error('Falha ao inicializar o banco:', e);
        setError(e.message || 'Erro desconhecido');
      }
    })();
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Erro ao iniciar</Text>
        <Text style={styles.errorMsg}>{error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Preparando o aplicativo...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={colors.primary} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  loadingText: { marginTop: 12, color: colors.textSecondary },
  errorTitle: { fontSize: 18, fontWeight: '700', color: colors.error, marginBottom: 8 },
  errorMsg: { color: colors.textSecondary, textAlign: 'center' },
});
