// src/utils/categories.js
// Categorias de problemas urbanos com ícone (Ionicons) e cor associada.

export const CATEGORIES = [
  {
    id: 'buraco',
    label: 'Buraco na via',
    icon: 'warning',
    color: '#DC2626',
  },
  {
    id: 'iluminacao',
    label: 'Iluminação pública',
    icon: 'bulb',
    color: '#F59E0B',
  },
  {
    id: 'dengue',
    label: 'Foco de dengue',
    icon: 'bug',
    color: '#7C3AED',
  },
  {
    id: 'lixo',
    label: 'Lixo / Entulho',
    icon: 'trash',
    color: '#854D0E',
  },
  {
    id: 'agua',
    label: 'Vazamento de água',
    icon: 'water',
    color: '#0284C7',
  },
  {
    id: 'arvore',
    label: 'Árvore / Poda',
    icon: 'leaf',
    color: '#16A34A',
  },
  {
    id: 'sinalizacao',
    label: 'Sinalização',
    icon: 'speedometer',
    color: '#0F766E',
  },
  {
    id: 'outro',
    label: 'Outro',
    icon: 'alert-circle',
    color: '#64748B',
  },
];

export const SEVERITIES = [
  { id: 'baixa', label: 'Baixa', color: '#10B981' },
  { id: 'media', label: 'Média', color: '#F59E0B' },
  { id: 'alta', label: 'Alta', color: '#EF4444' },
];

export const STATUSES = [
  { id: 'aberto', label: 'Aberto', color: '#EF4444', icon: 'time' },
  { id: 'analise', label: 'Em análise', color: '#F59E0B', icon: 'eye' },
  { id: 'resolvido', label: 'Resolvido', color: '#10B981', icon: 'checkmark-circle' },
];

export const getCategory = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

export const getSeverity = (id) =>
  SEVERITIES.find((s) => s.id === id) || SEVERITIES[1];

export const getStatus = (id) =>
  STATUSES.find((s) => s.id === id) || STATUSES[0];

export const formatDate = (isoDate) => {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

export const formatDateShort = (isoDate) => {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}`;
};
