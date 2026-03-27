// ─────────────────────────────────────────────────────────────────────────────
// Types correspondant EXACTEMENT aux réponses du backend (Report.service.js)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Document brut retourné par Mongoose (getAllReports, getReportById).
 * Ces fonctions font un .select("-__v") sur le document — _id est présent.
 */
export interface Report {
  _id: string;
  versionLabel: number;
  notes: string;
  filePath: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/**
 * Réponse de createReport — le backend retourne `reportId` (pas `_id`),
 * et inclut createdAt + updatedAt.
 */
export interface CreatedReport {
  reportId: string;
  versionLabel: number;
  notes: string;
  filePath: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Réponse de updateReport — le backend retourne `reportId` (pas `_id`),
 * sans createdAt.
 */
export interface UpdatedReport {
  reportId: string;
  versionLabel: number;
  notes: string;
  filePath: string;
  projectId: string;
  updatedAt: string;
}