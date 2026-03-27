import {
  CheckSquare,
  Clock,
  AlertTriangle,
  CalendarDays,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  FolderOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ProgressBar, MeetingStatusBadge } from "@/components/ui/badges";
import { Button } from "@/components/ui/button";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { useEffect, useState } from "react";
import { getProject } from "@/services/projects";
import type { Project } from "@/types";
import { useToast } from "@/context/toast-context";

// ─── Helpers localStorage ─────────────────────────────────────────────────────

function getUserData() {
  try {
    return JSON.parse(localStorage.getItem("user") ?? "{}");
  } catch {
    return {};
  }
}

function getProjectId(): string | null {
  const user = getUserData();
  if (!user.project) return null;
  return typeof user.project === "object" ? user.project._id : user.project;
}

function getProjectTitle(): string {
  const user = getUserData();
  if (!user.project) return "Mon Projet PFE";
  return typeof user.project === "object"
    ? user.project.title
    : (user.projectTitle ?? "Mon Projet PFE");
}

// ─── Sous-composants ──────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 flex items-start gap-4">
      <div className={`mt-0.5 rounded-lg p-2.5 ${color}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
      <AlertCircle className="size-5 text-destructive shrink-0" />
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
}

function NoProjectState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
      <div className="relative">
        <div className="size-20 rounded-2xl bg-muted flex items-center justify-center">
          <FolderOpen className="size-10 text-muted-foreground/40" />
        </div>
        <div className="absolute -top-1 -right-1 size-6 rounded-full bg-orange-100 flex items-center justify-center">
          <AlertTriangle className="size-3.5 text-orange-500" />
        </div>
      </div>

      <div className="space-y-2 max-w-sm">
        <h3 className="font-semibold text-base">Aucun projet assigné</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Vous n'êtes pas encore rattaché à un projet PFE. Contactez votre
          encadrant pour être ajouté à un projet.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-lg px-4 py-3 max-w-sm">
        <Clock className="size-4 shrink-0" />
        <span>En attente d'assignation par votre superviseur</span>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function StudentOverview() {
  const [project, setProject] = useState<Project | null>(null);
  const { showToast } = useToast();
  useEffect(() => {
    (async () => {
      try {
        const fetchedProject = await getProject();
        if (fetchedProject) setProject(fetchedProject);
        console.log("Fetched project on mount:", fetchedProject);
      } catch (err) {
        console.error(err);
        showToast({
          type: "error",
          message:
            err instanceof Error ? err.message : "Failed to load project",
        });
      }
    })();
  }, []);

  const { progress, standbyTasks, meetings, loading, error } =
    useStudentDashboard(project?.id || "");

  if (!project) return <NoProjectState />;
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  // ─── Calculs ────────────────────────────────────────────────────────────────
  const pp = progress?.projectProgress;
  const totalTasks = pp?.totalTasks ?? 0;
  const doneTasks = pp?.doneTasks ?? 0;
  const progressPercent = pp?.progress ?? 0;
  const standbyCount = standbyTasks.length;

  const notDoneCount =
    progress?.sprints.reduce((acc, sprint) => {
      return (
        acc +
        sprint.userStories.reduce((a, us) => {
          return a + (us.totalTasks - us.doneTasks);
        }, 0)
      );
    }, 0) ?? 0;

  const inProgressCount = Math.max(0, notDoneCount - standbyCount);

  return (
    <div className="space-y-6">
      {/* ── En-tête projet ── */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Projet actif
            </p>
            <h2 className="text-lg font-semibold">{project?.title}</h2>
          </div>
          <Link to="/student/project">
            <Button variant="outline" size="sm">
              Voir les détails
              <ArrowRight className="size-3 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progression globale</span>
            <span className="text-sm font-bold">{progressPercent}%</span>
          </div>
          <ProgressBar value={progressPercent} size="lg" showLabel={false} />
        </div>
      </div>

      {/* ── Stats tâches ── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Terminées"
          value={doneTasks}
          icon={CheckSquare}
          color="bg-emerald-50 text-emerald-600"
          sub={`/ ${totalTasks} total`}
        />
        <StatCard
          label="En cours"
          value={inProgressCount}
          icon={Clock}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="En attente"
          value={standbyCount}
          icon={AlertTriangle}
          color="bg-orange-50 text-orange-600"
        />
        <StatCard
          label="Validations"
          value="—"
          icon={ShieldCheck}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* ── Progression sprints ── */}
      {progress && progress.sprints.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Progression des Sprints</h3>
            <Link
              to="/student/sprints"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              Voir tout <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="space-y-4">
            {progress.sprints.map((sprint) => (
              <div key={sprint._id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {sprint.title}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {sprint.doneTasks}/{sprint.totalTasks}
                  </span>
                </div>
                <ProgressBar value={sprint.progress} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Réunions + Standby ── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Réunions récentes */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Réunions récentes</h3>
            <Link
              to="/student/meetings"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              Voir tout <ArrowRight className="size-3" />
            </Link>
          </div>
          {meetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CalendarDays className="size-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">Aucune réunion</p>
            </div>
          ) : (
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <div
                  key={meeting._id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">
                      {meeting.agenda || "Réunion"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(meeting.scheduledDate).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                  <MeetingStatusBadge status={meeting.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tâches Standby */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Tâches en attente</h3>
            <Link
              to="/student/tasks"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              Voir tout <ArrowRight className="size-3" />
            </Link>
          </div>
          {standbyTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckSquare className="size-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                Aucune tâche en attente
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {standbyTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <AlertTriangle className="size-4 text-orange-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {task.userStoryId?.title ?? "—"}
                    </p>
                  </div>
                  {task.userStoryId?.priority && (
                    <span className="ml-auto text-xs rounded-full bg-muted px-2 py-0.5 shrink-0">
                      {task.userStoryId.priority}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
