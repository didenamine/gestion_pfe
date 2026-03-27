"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  Download,
  Clock,
  Tag,
  Trash2,
  Pencil,
  X,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  getAllReports,
  createReport,
  updateReport,
  deleteReport,
  downloadReport,
} from "../../services/report";
import type { Report, CreatedReport, UpdatedReport } from "../../types/report.ts";

// ── Helper : nom lisible depuis filePath ──────────────────────────────────────
// filePath = "/uploads/reports/1712345678901_mon_rapport.pdf"
// → retire le préfixe timestamp ajouté par le backend
function friendlyName(filePath: string): string {
  const basename = filePath.split("/").pop() ?? filePath;
  return basename.replace(/^\d+_/, "");
}

// ── Helper : convertir CreatedReport → Report ─────────────────────────────────
// createReport retourne { reportId, ... } au lieu de { _id, ... }.
// On normalise pour pouvoir l'insérer dans le state Report[].
function normalizeCreated(data: CreatedReport, existingCreatedAt?: string): Report {
  return {
    _id: data.reportId,
    versionLabel: data.versionLabel,
    notes: data.notes,
    filePath: data.filePath,
    projectId: data.projectId,
    createdAt: data.createdAt ?? existingCreatedAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt,
    deletedAt: null,
  };
}

// ── Helper : appliquer UpdatedReport → Report partiel ────────────────────────
// updateReport retourne { reportId, notes, ... } — on patch le report existant.
function applyUpdate(existing: Report, updated: UpdatedReport): Report {
  return {
    ...existing,
    notes: updated.notes,
    filePath: updated.filePath,
    updatedAt: updated.updatedAt,
  };
}

export default function StudentReports() {
  // Tous les rapports affichés viennent de getAllReports → type Report (_id standard)
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Upload state ──────────────────────────────────────────────────────────
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [versionLabel, setVersionLabel] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Inline edit state ─────────────────────────────────────────────────────
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);

  // ── Delete / download state ───────────────────────────────────────────────
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  // getAllReports → documents Mongoose bruts → _id standard → type Report ✓
  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllReports();
      // Le backend trie déjà par versionLabel desc, on garde quand même le tri
      setReports([...data].sort((a, b) => b.versionLabel - a.versionLabel));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Impossible de charger les rapports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ── Upload ────────────────────────────────────────────────────────────────
  const handleUpload = async () => {
    setUploadError(null);

    if (!selectedFile) {
      setUploadError("Veuillez sélectionner un fichier.");
      return;
    }
    const version = parseInt(versionLabel, 10);
    if (!version || version < 1) {
      setUploadError("Le numéro de version doit être un entier >= 1.");
      return;
    }
    if (!notes || notes.trim().length < 3) {
      setUploadError("Les notes doivent contenir au moins 3 caractères.");
      return;
    }

    setUploading(true);
    try {
      // createReport retourne CreatedReport { reportId, ... } — pas _id
      const created: CreatedReport = await createReport(selectedFile, version, notes.trim());

      // On normalise CreatedReport → Report pour l'insérer dans le state
      const normalized = normalizeCreated(created);

      setReports((prev) =>
        [normalized, ...prev].sort((a, b) => b.versionLabel - a.versionLabel)
      );

      // Reset form
      setSelectedFile(null);
      setVersionLabel("");
      setNotes("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Erreur lors de l'envoi");
    } finally {
      setUploading(false);
    }
  };

  // ── Download ──────────────────────────────────────────────────────────────
  // GET /report/:id/download — le backend streame le fichier réel
  const handleDownload = async (report: Report) => {
    setDownloadingId(report._id);
    try {
      const filename = friendlyName(report.filePath) || `rapport_v${report.versionLabel}.pdf`;
      await downloadReport(report._id, filename);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erreur lors du téléchargement");
    } finally {
      setDownloadingId(null);
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const startEdit = (report: Report) => {
    setEditingId(report._id);
    setEditNotes(report.notes);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNotes("");
  };

  const saveEdit = async (reportId: string) => {
    if (editNotes.trim().length < 3) return;
    setSavingId(reportId);
    try {
      // updateReport retourne UpdatedReport { reportId, notes, ... } — pas _id
      const updated: UpdatedReport = await updateReport(reportId, editNotes.trim());

      // On patch le report existant avec les champs retournés
      setReports((prev) =>
        prev.map((r) =>
          r._id === reportId ? applyUpdate(r, updated) : r
        )
      );
      setEditingId(null);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erreur lors de la mise à jour");
    } finally {
      setSavingId(null);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (reportId: string) => {
    if (!confirm("Supprimer ce rapport ?")) return;
    setDeletingId(reportId);
    try {
      await deleteReport(reportId);
      setReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Drag & drop ───────────────────────────────────────────────────────────
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Rapports</h2>
          <p className="text-sm text-muted-foreground">
            {reports.length} version(s) déposée(s)
          </p>
        </div>
      </div>

      {/* ── Upload zone ─────────────────────────────────────────────────── */}
      <div
        className="rounded-xl border-2 border-dashed border-muted p-8 text-center hover:border-muted-foreground/30 transition-colors cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
        />
        <Upload className="size-8 text-muted-foreground/50 mx-auto mb-3" />
        {selectedFile ? (
          <p className="text-sm font-medium text-blue-600">{selectedFile.name}</p>
        ) : (
          <>
            <p className="text-sm font-medium">Glisser-déposer un PDF ici</p>
            <p className="text-xs text-muted-foreground mt-1">
              ou cliquez pour sélectionner un fichier (.pdf, .doc, .docx — 10 Mo max)
            </p>
          </>
        )}
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Choisir un fichier
        </Button>
      </div>

      {/* Upload form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Numéro de version <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={versionLabel}
            onChange={(e) => setVersionLabel(e.target.value)}
            placeholder="Ex : 1"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">
            Notes <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Décrivez ce que couvre cette version…"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {uploadError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          <AlertCircle className="size-4 shrink-0" />
          {uploadError}
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        className="w-full sm:w-auto"
      >
        {uploading ? (
          <>
            <Loader2 className="size-4 mr-2 animate-spin" />
            Envoi en cours…
          </>
        ) : (
          <>
            <Upload className="size-4 mr-1" />
            Déposer cette version
          </>
        )}
      </Button>

      {/* ── Report list ─────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-medium mb-3">Historique des versions</h3>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="size-5 animate-spin mr-2" />
            Chargement des rapports…
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="size-4 shrink-0" />
            {error}
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-red-700 hover:text-red-900"
              onClick={fetchReports}
            >
              Réessayer
            </Button>
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            Aucun rapport déposé pour ce projet.
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((rep, idx) => (
              <div
                key={rep._id}
                className="rounded-xl border bg-card p-4 flex items-start gap-4"
              >
                {/* Icône */}
                <div className="rounded-lg bg-muted p-2.5 shrink-0">
                  <FileText className="size-5 text-muted-foreground" />
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-sm truncate">
                      {friendlyName(rep.filePath)}
                    </span>
                    {idx === 0 && (
                      <span className="inline-flex items-center rounded-full border bg-blue-50 border-blue-200 text-blue-700 px-2 py-0.5 text-xs font-medium whitespace-nowrap">
                        Dernière version
                      </span>
                    )}
                  </div>

                  {/* Notes — édition inline ou lecture */}
                  {editingId === rep._id ? (
                    <div className="flex items-start gap-2 mb-2">
                      <textarea
                        rows={2}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="flex-1 rounded-lg border bg-background px-2 py-1 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(rep._id)}
                        disabled={
                          savingId === rep._id || editNotes.trim().length < 3
                        }
                        className="text-green-600 hover:text-green-800 disabled:opacity-40 mt-0.5"
                        title="Enregistrer"
                      >
                        {savingId === rep._id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Check className="size-4" />
                        )}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-muted-foreground hover:text-foreground mt-0.5"
                        title="Annuler"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {rep.notes}
                    </p>
                  )}

                  {/* Méta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Tag className="size-3" />
                      v{rep.versionLabel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(rep.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {editingId !== rep._id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => startEdit(rep)}
                      title="Modifier les notes"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                  )}

                  {/* Téléchargement — blob authentifié via GET /report/:id/download */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(rep)}
                    disabled={downloadingId === rep._id}
                    title="Télécharger"
                  >
                    {downloadingId === rep._id ? (
                      <Loader2 className="size-3 mr-1 animate-spin" />
                    ) : (
                      <Download className="size-3 mr-1" />
                    )}
                    Télécharger
                  </Button>

                  {/* Suppression douce */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-red-600"
                    onClick={() => handleDelete(rep._id)}
                    disabled={deletingId === rep._id}
                    title="Supprimer"
                  >
                    {deletingId === rep._id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}