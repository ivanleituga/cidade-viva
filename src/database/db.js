// src/database/db.js
// Camada de acesso ao banco SQLite usando expo-sqlite (API async).
// Toda interação com o banco passa por aqui (separação de responsabilidades).

import * as SQLite from 'expo-sqlite';

const DB_NAME = 'cidadeviva.db';
let dbInstance = null;

/**
 * Abre (ou cria) o banco e retorna a instância única.
 * Padrão singleton para evitar múltiplas conexões.
 */
async function getDb() {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbInstance;
}

/**
 * Inicializa o schema. Chamada uma vez na inicialização do app.
 * Cria a tabela `reports` se ainda não existir.
 */
export async function initDatabase() {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      location TEXT,
      severity TEXT DEFAULT 'media',
      status TEXT DEFAULT 'aberto',
      photo_uri TEXT,
      reporter_name TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

/**
 * CREATE — Insere um novo registro.
 * Retorna o id gerado pelo SQLite.
 */
export async function createReport(report) {
  const db = await getDb();
  const now = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO reports
      (title, category, description, location, severity, status, photo_uri, reporter_name, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      report.title,
      report.category,
      report.description ?? '',
      report.location ?? '',
      report.severity ?? 'media',
      report.status ?? 'aberto',
      report.photo_uri ?? null,
      report.reporter_name ?? '',
      now,
      now,
    ]
  );
  return result.lastInsertRowId;
}

/**
 * READ — Lista todos os registros (mais recentes primeiro).
 * Aceita filtros opcionais por categoria e/ou status.
 */
export async function listReports({ category, status } = {}) {
  const db = await getDb();
  const wheres = [];
  const params = [];
  if (category) {
    wheres.push('category = ?');
    params.push(category);
  }
  if (status) {
    wheres.push('status = ?');
    params.push(status);
  }
  const whereSql = wheres.length ? `WHERE ${wheres.join(' AND ')}` : '';
  const rows = await db.getAllAsync(
    `SELECT * FROM reports ${whereSql} ORDER BY datetime(created_at) DESC`,
    params
  );
  return rows;
}

/**
 * READ — Busca um registro pelo id.
 */
export async function getReportById(id) {
  const db = await getDb();
  const row = await db.getFirstAsync(`SELECT * FROM reports WHERE id = ?`, [id]);
  return row || null;
}

/**
 * UPDATE — Atualiza um registro existente.
 */
export async function updateReport(id, report) {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.runAsync(
    `UPDATE reports SET
       title = ?,
       category = ?,
       description = ?,
       location = ?,
       severity = ?,
       status = ?,
       photo_uri = ?,
       reporter_name = ?,
       updated_at = ?
     WHERE id = ?`,
    [
      report.title,
      report.category,
      report.description ?? '',
      report.location ?? '',
      report.severity ?? 'media',
      report.status ?? 'aberto',
      report.photo_uri ?? null,
      report.reporter_name ?? '',
      now,
      id,
    ]
  );
}

/**
 * UPDATE — Atualiza somente o status (atalho do detalhe).
 */
export async function updateReportStatus(id, status) {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.runAsync(
    `UPDATE reports SET status = ?, updated_at = ? WHERE id = ?`,
    [status, now, id]
  );
}

/**
 * DELETE — Remove um registro.
 */
export async function deleteReport(id) {
  const db = await getDb();
  await db.runAsync(`DELETE FROM reports WHERE id = ?`, [id]);
}

/**
 * Agregações para a tela de estatísticas.
 */
export async function getStats() {
  const db = await getDb();
  const total = (await db.getFirstAsync(`SELECT COUNT(*) as c FROM reports`))?.c ?? 0;
  const byStatus = await db.getAllAsync(
    `SELECT status, COUNT(*) as c FROM reports GROUP BY status`
  );
  const byCategory = await db.getAllAsync(
    `SELECT category, COUNT(*) as c FROM reports GROUP BY category ORDER BY c DESC`
  );
  const bySeverity = await db.getAllAsync(
    `SELECT severity, COUNT(*) as c FROM reports GROUP BY severity`
  );
  return { total, byStatus, byCategory, bySeverity };
}

/**
 * Utilitário para popular o banco com alguns exemplos (apenas dev/demo).
 */
export async function seedSampleData() {
  const db = await getDb();
  const existing = await db.getFirstAsync(`SELECT COUNT(*) as c FROM reports`);
  if ((existing?.c ?? 0) > 0) return;
  const samples = [
    {
      title: 'Buraco grande na Rua Voluntários da Pátria',
      category: 'buraco',
      description: 'Buraco profundo na faixa da direita, próximo ao número 250. Já causou estouro de pneu em pelo menos um carro.',
      location: 'R. Voluntários da Pátria, 250 — Botafogo',
      severity: 'alta',
      status: 'aberto',
    },
    {
      title: 'Poste apagado há mais de uma semana',
      category: 'iluminacao',
      description: 'Toda a esquina está no escuro à noite, área comercial fica perigosa.',
      location: 'Av. N. S. de Copacabana esq. com R. Constante Ramos',
      severity: 'media',
      status: 'analise',
    },
    {
      title: 'Pneus acumulando água no terreno',
      category: 'dengue',
      description: 'Terreno baldio com pneus velhos e poças paradas. Risco alto agora no verão.',
      location: 'R. das Laranjeiras, fundos do 480',
      severity: 'alta',
      status: 'aberto',
    },
    {
      title: 'Entulho de obra descartado na calçada',
      category: 'lixo',
      description: 'Pilha de tijolos e sacos de cimento bloqueando a calçada há 3 dias.',
      location: 'R. Pinheiro Machado, 88 — Laranjeiras',
      severity: 'baixa',
      status: 'resolvido',
    },
  ];
  for (const s of samples) {
    await createReport(s);
  }
}
