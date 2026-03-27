
const API_BASE = import.meta.env.VITE_API_BASE;

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


// ── Auth helpers ──────────────────────────────────────────────────────────────

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Pas de Content-Type : le navigateur pose automatiquement le boundary multipart
const getAuthHeadersMultipart = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── Helper erreur ─────────────────────────────────────────────────────────────

const extractError = (result: Record<string, unknown>, fallback: string): string => {
  if (result.message && typeof result.message === "string") {
    const details = Array.isArray(result.details)
      ? (result.details as string[]).join(", ")
      : null;
    return details ? `${result.message}: ${details}` : result.message;
  }
  return fallback;
};

// ─── GET /report ──────────────────────────────────────────────────────────────
// Retourne les documents Mongoose bruts → champ _id standard
export async function getAllReports(): Promise<Report[]> {
  const response = await fetch(`${API_BASE}/report`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(extractError(result, "Failed to fetch reports"));
  return result.data ?? [];
}

// ─── GET /report/:id ──────────────────────────────────────────────────────────
// Retourne le document Mongoose brut → champ _id standard
export async function getReportById(reportId: string): Promise<Report> {
  const response = await fetch(`${API_BASE}/report/${reportId}`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(extractError(result, "Failed to fetch report"));
  return result.data;
}

// ─── POST /report ─────────────────────────────────────────────────────────────
// multipart/form-data : file (binary) + versionLabel (int) + notes (string)
// Le backend retourne { reportId, versionLabel, notes, filePath, projectId, createdAt, updatedAt }
export async function createReport(
  file: File,
  versionLabel: number,
  notes: string
): Promise<CreatedReport> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("versionLabel", String(versionLabel));
  formData.append("notes", notes);

  const response = await fetch(`${API_BASE}/report`, {
    method: "POST",
    headers: getAuthHeadersMultipart(),
    credentials: "include",
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(extractError(result, "Failed to create report"));
  return result.data;
}

// ─── PATCH /report/:id ────────────────────────────────────────────────────────
// Seules les notes peuvent être modifiées.
// Le backend retourne { reportId, versionLabel, notes, filePath, projectId, updatedAt }
export async function updateReport(
  reportId: string,
  notes: string
): Promise<UpdatedReport> {
  const response = await fetch(`${API_BASE}/report/${reportId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({ notes }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(extractError(result, "Failed to update report"));
  return result.data;
}

// ─── DELETE /report/:id ───────────────────────────────────────────────────────
export async function deleteReport(reportId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/report/${reportId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(extractError(result, "Failed to delete report"));
}

// ─── GET /report/:id/download ─────────────────────────────────────────────────
// Le backend streame le fichier réel ; on déclenche un téléchargement via Blob.
// `filename` = nom suggéré au navigateur (ex: "report_v1.pdf").
export async function downloadReport(reportId: string, filename: string): Promise<void> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/report/${reportId}/download`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({})) as Record<string, unknown>;
    throw new Error(extractError(result, "Failed to download report"));
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  // Délai avant révocation pour laisser Safari démarrer le téléchargement
  setTimeout(() => URL.revokeObjectURL(url), 200);
}

// ─── GET /report/companysup/:projectID ───────────────────────────────────────
// Retourne les documents Mongoose bruts → champ _id standard
export async function getAllReportsForCompanySupervisor(
  projectId: string
): Promise<Report[]> {
  const response = await fetch(`${API_BASE}/report/companysup/${projectId}`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(extractError(result, "Failed to fetch reports"));
  return result.data ?? [];
}

// ─── GET /report/unisup/:projectID ───────────────────────────────────────────
// Retourne les documents Mongoose bruts → champ _id standard
export async function getAllReportsForUniSupervisor(
  projectId: string
): Promise<Report[]> {
  const response = await fetch(`${API_BASE}/report/unisup/${projectId}`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(extractError(result, "Failed to fetch reports"));
  return result.data ?? [];
}