import { useEffect, useState, useCallback } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  getPendingValidationMeetings,
  getMeetingsByProject,
  validateMeeting,
} from "@/services/meetings";
import { getSupervisorProjects } from "@/services/supervisor";

// FIX: interface locale au lieu d'importer Project depuis @/types
// pour éviter le conflit id vs _id
interface ProjectItem {
  _id: string;
  title: string;
}

interface MeetingItem {
  _id: string;
  agenda: string;
  scheduledDate: string;
  actualMinutes?: string;
  validationStatus: "pending" | "valid" | "invalid";
  referenceType?: "user_story" | "task" | "report";
  projectId?: string | { _id: string; title: string };
  createdBy?: { _id?: string; fullName?: string; email?: string };
}

type FilterTab = "all" | "pending" | "valid" | "invalid";

const navData = {
  navMain: [
    { title: "Dashboard",    url: "/uni/dashboard"    },
    { title: "Projects",     url: "/uni/projects"     },
    { title: "Sprints",      url: "/uni/sprints"      },
    { title: "User Stories", url: "/uni/user-stories" },
    { title: "Meetings",     url: "/uni/meetings"     },
  ],
};

function fmt(date: string | Date) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function fmtTime(date: string | Date) {
  return new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit", minute: "2-digit",
  });
}

const STATUS_CFG = {
  pending: {
    label: "En attente",
    dot:   "bg-amber-400",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    border:"border-l-amber-400",
  },
  valid: {
    label: "Acceptée",
    dot:   "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    border:"border-l-emerald-400",
  },
  invalid: {
    label: "Refusée",
    dot:   "bg-red-500",
    badge: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    border:"border-l-red-400",
  },
} as const;

const REF_LABELS: Record<string, string> = {
  user_story: "User Story",
  task: "Tâche",
  report: "Rapport",
};

const TABS: { key: FilterTab; label: string }[] = [
  { key: "pending", label: "En attente" },
  { key: "valid",   label: "Acceptées"  },
  { key: "invalid", label: "Refusées"   },
  { key: "all",     label: "Toutes"     },
];

function Spinner() {
  return (
    <div className="flex justify-center py-14">
      <div className="h-6 w-6 rounded-full border-2 border-muted border-t-primary animate-spin" />
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg className="h-10 w-10 text-muted-foreground/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p className="text-sm text-muted-foreground">{msg}</p>
    </div>
  );
}

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3 shadow-xl text-sm font-medium text-white ${
      type === "success" ? "bg-emerald-600" : "bg-red-600"
    }`}>
      {type === "success"
        ? <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
      }
      {msg}
    </div>
  );
}

interface ConfirmModalProps {
  action: "valid" | "invalid";
  meeting: MeetingItem;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function ConfirmModal({ action, meeting, onConfirm, onCancel, loading }: ConfirmModalProps) {
  const isAccept = action === "valid";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-background border shadow-2xl p-6">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${
          isAccept ? "bg-emerald-100 dark:bg-emerald-950/40" : "bg-red-100 dark:bg-red-950/40"
        }`}>
          {isAccept
            ? <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            : <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          }
        </div>
        <h3 className="text-lg font-semibold mb-1">
          {isAccept ? "Accepter la réunion" : "Refuser la réunion"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {isAccept
            ? "Confirmez-vous l'acceptation de cette réunion ?"
            : "Confirmez-vous le refus de cette réunion ?"}
        </p>
        <div className="rounded-xl bg-muted/50 px-4 py-3 mb-5 space-y-0.5">
          <p className="text-sm font-medium">{meeting.agenda || "Sans agenda"}</p>
          <p className="text-xs text-muted-foreground">
            {fmt(meeting.scheduledDate)} à {fmtTime(meeting.scheduledDate)}
          </p>
          {meeting.createdBy && (
            <p className="text-xs text-muted-foreground">
              Par {meeting.createdBy.fullName ?? meeting.createdBy.email ?? "—"}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2 ${
              isAccept ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading && <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
            {isAccept ? "Accepter" : "Refuser"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface MeetingCardProps {
  meeting: MeetingItem;
  onAction: (id: string, action: "valid" | "invalid") => void;
}

function MeetingCard({ meeting, onAction }: MeetingCardProps) {
  const status = meeting.validationStatus ?? "pending";
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.pending;
  const isPast = new Date(meeting.scheduledDate) < new Date();

  const projectTitle =
    meeting.projectId && typeof meeting.projectId === "object"
      ? (meeting.projectId as { _id: string; title: string }).title
      : null;

  return (
    <div className={`rounded-2xl bg-background border border-border/60 border-l-4 ${cfg.border} shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col gap-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-snug line-clamp-2">
            {meeting.agenda || "Sans agenda"}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full px-2.5 py-0.5 ${cfg.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />
              {cfg.label}
            </span>
            {meeting.referenceType && (
              <span className="text-[11px] text-muted-foreground bg-muted rounded-full px-2.5 py-0.5">
                {REF_LABELS[meeting.referenceType] ?? meeting.referenceType}
              </span>
            )}
            {isPast && status === "pending" && (
              <span className="text-[11px] text-muted-foreground bg-muted rounded-full px-2.5 py-0.5">Passée</span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs font-medium">{fmt(meeting.scheduledDate)}</p>
          <p className="text-xs text-muted-foreground">{fmtTime(meeting.scheduledDate)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {meeting.createdBy && (
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {meeting.createdBy.fullName ?? meeting.createdBy.email ?? "—"}
          </span>
        )}
        {projectTitle && (
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {projectTitle}
          </span>
        )}
      </div>

      {meeting.actualMinutes && (
        <div className="rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Compte-rendu : </span>
          {meeting.actualMinutes}
        </div>
      )}

      {status === "pending" && (
        <div className="flex gap-2 pt-1 border-t border-border/40 mt-auto">
          <button
            onClick={() => onAction(meeting._id, "invalid")}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 py-2 text-xs font-semibold transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Refuser
          </button>
          <button
            onClick={() => onAction(meeting._id, "valid")}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-semibold transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Accepter
          </button>
        </div>
      )}

      {status !== "pending" && (
        <div className={`flex items-center gap-1.5 pt-1 border-t border-border/40 text-xs font-medium ${
          status === "valid" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
        }`}>
          {status === "valid"
            ? <><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>Réunion acceptée</>
            : <><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>Réunion refusée</>
          }
        </div>
      )}
    </div>
  );
}

function MeetingsContent() {
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  // FIX: utiliser ProjectItem (avec _id) au lieu de Project (avec id)
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [filter, setFilter] = useState<FilterTab>("pending");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pendingAction, setPendingAction] = useState<{
    id: string;
    action: "valid" | "invalid";
    meeting: MeetingItem;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    getSupervisorProjects()
      // FIX: normaliser les projets pour garantir _id
      .then((data: any[]) => {
        const normalized: ProjectItem[] = (Array.isArray(data) ? data : []).map((p) => ({
          _id: p._id ?? p.id ?? "",
          title: p.title ?? "",
        }));
        setProjects(normalized);
      })
      .catch(() => {});
  }, []);

  const loadMeetings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: MeetingItem[];
      if (selectedProject === "all") {
        data = await getPendingValidationMeetings();
      } else {
        data = await getMeetingsByProject(selectedProject);
      }
      // FIX: getPendingValidationMeetings et getMeetingsByProject retournent
      // maintenant toujours un tableau ([] au lieu de null)
      setMeetings(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message ?? "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  useEffect(() => { loadMeetings(); }, [loadMeetings]);

  const handleAction = (id: string, action: "valid" | "invalid") => {
    const meeting = meetings.find((m) => m._id === id);
    if (!meeting) return;
    setPendingAction({ id, action, meeting });
  };

  const handleConfirm = async () => {
    if (!pendingAction) return;
    setActionLoading(true);
    try {
      await validateMeeting(pendingAction.id, pendingAction.action);
      setMeetings((prev) =>
        prev.map((m) =>
          m._id === pendingAction.id
            ? { ...m, validationStatus: pendingAction.action }
            : m
        )
      );
      setToast({
        msg: pendingAction.action === "valid"
          ? "Réunion acceptée avec succès"
          : "Réunion refusée avec succès",
        type: "success",
      });
    } catch (err: any) {
      setToast({ msg: err.message ?? "Une erreur est survenue", type: "error" });
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  };

  const displayed = meetings.filter((m) => {
    const matchFilter = filter === "all" || m.validationStatus === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (m.agenda ?? "").toLowerCase().includes(q) ||
      (m.createdBy?.fullName ?? "").toLowerCase().includes(q) ||
      (m.createdBy?.email ?? "").toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const counts = {
    all:     meetings.length,
    pending: meetings.filter((m) => m.validationStatus === "pending").length,
    valid:   meetings.filter((m) => m.validationStatus === "valid").length,
    invalid: meetings.filter((m) => m.validationStatus === "invalid").length,
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Gestion des réunions</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Acceptez ou refusez les réunions soumises par les étudiants
          </p>
        </div>
        <select
          value={selectedProject}
          onChange={(e) => { setSelectedProject(e.target.value); setFilter("pending"); }}
          className="text-sm border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">Toutes (en attente)</option>
          {/* FIX: utiliser p._id au lieu de p.id */}
          {projects.map((p) => (
            <option key={p._id} value={p._id}>{p.title}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-1 rounded-xl bg-muted/60 p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filter === tab.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                tab.key === "pending" ? "bg-amber-100 text-amber-700"
                : tab.key === "valid" ? "bg-emerald-100 text-emerald-700"
                : tab.key === "invalid" ? "bg-red-100 text-red-700"
                : "bg-muted text-muted-foreground"
              }`}>
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Rechercher par agenda ou étudiant…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-9 py-2 text-sm border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {error}
          <button onClick={loadMeetings} className="ml-auto text-xs font-medium underline">Réessayer</button>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : displayed.length === 0 ? (
        <div className="rounded-xl bg-muted/50 min-h-[300px] flex items-center justify-center">
          <Empty msg={filter === "pending" ? "Aucune réunion en attente de validation" : "Aucune réunion trouvée"} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {displayed.map((m) => (
            <MeetingCard key={m._id} meeting={m} onAction={handleAction} />
          ))}
        </div>
      )}

      {pendingAction && (
        <ConfirmModal
          action={pendingAction.action}
          meeting={pendingAction.meeting}
          onConfirm={handleConfirm}
          onCancel={() => setPendingAction(null)}
          loading={actionLoading}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

export default function UniversitySupervisorMeetings() {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") ?? "{}"); }
    catch { return {}; }
  })();

  return (
    <SidebarProvider>
      <AppSidebar
        data={navData}
        userInfo={{ name: user.name ?? "Uni Supervisor", role: user.role ?? "UniSupervisor" }}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/uni/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Meetings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6">
          <MeetingsContent />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}