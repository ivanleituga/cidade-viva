// src/theme/colors.js
// Paleta inspirada em apps de utilidade pública: verde-azulado (confiança/cidadania)
// e tons quentes para sinalização de severidade.

export const colors = {
  // Cores primárias
  primary: '#0F766E',         // teal-700 — identidade do app
  primaryDark: '#134E4A',     // teal-900
  primaryLight: '#5EEAD4',    // teal-300
  primarySoft: '#CCFBF1',     // teal-100 — fundo de destaque

  // Neutros
  background: '#F8FAFC',      // slate-50
  surface: '#FFFFFF',
  border: '#E2E8F0',          // slate-200
  divider: '#F1F5F9',         // slate-100

  // Texto
  textPrimary: '#0F172A',     // slate-900
  textSecondary: '#475569',   // slate-600
  textTertiary: '#94A3B8',    // slate-400
  textInverse: '#FFFFFF',

  // Severidade
  severityLow: '#10B981',     // verde
  severityMedium: '#F59E0B',  // amarelo/laranja
  severityHigh: '#EF4444',    // vermelho

  // Status
  statusOpen: '#EF4444',      // aberto — vermelho
  statusInProgress: '#F59E0B',// em análise — laranja
  statusResolved: '#10B981',  // resolvido — verde

  // Feedback
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 26, fontWeight: '700' },
  h2: { fontSize: 20, fontWeight: '700' },
  h3: { fontSize: 17, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400' },
  bodyBold: { fontSize: 15, fontWeight: '600' },
  small: { fontSize: 13, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '500' },
};
