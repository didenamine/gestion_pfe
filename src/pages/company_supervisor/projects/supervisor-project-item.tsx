import React, { useState } from "react";
import { ChevronDown, ChevronUp, CalendarDays, Target, Loader2 } from "lucide-react";
import { getProjectSprints } from "@/services/supervisor";

interface SupervisorProjectCardProps {
  project: any;
}

function formatDate(date: string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SprintStatusBadge({ sprint }: { sprint: any }) {
  const now = new Date();
  const start = new Date(sprint.startDate);
  const end = new Date(sprint.endDate);

  let label = "Upcoming";
  let cls = "bg-muted text-muted-foreground";

  if (now >= start && now <= end) {
    label = "Active";
    cls = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  } else if (now > end) {
    label = "Completed";
    cls = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

function SprintCard({ sprint, index }: { sprint: any; index: number }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {index + 1}
          </span>
          <h4 className="font-semibold text-sm">{sprint.title}</h4>
        </div>
        <SprintStatusBadge sprint={sprint} />
      </div>

      {/* Progress bar */}
      {sprint.progress !== undefined && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{sprint.progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${sprint.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
        <span>
          {formatDate(sprint.startDate)} → {formatDate(sprint.endDate)}
        </span>
      </div>

      {sprint.totalTasks !== undefined && (
        <div className="text-xs text-muted-foreground">
          {sprint.doneTasks ?? 0} / {sprint.totalTasks} tasks done
        </div>
      )}

      {sprint.userStories && sprint.userStories.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {sprint.userStories.length} user{" "}
          {sprint.userStories.length === 1 ? "story" : "stories"}
        </div>
      )}
    </div>
  );
}

export const SupervisorProjectCard: React.FC<SupervisorProjectCardProps> = ({ project }) => {
  const contributors = project.contributors ?? [];
  const [open, setOpen] = useState(false);
  const [sprints, setSprints] = useState<any[]>([]);
  const [loadingSprints, setLoadingSprints] = useState(false);
  const [sprintsError, setSprintsError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  const projectId = project._id ?? project.id;

  const handleToggle = async () => {
    const next = !open;
    setOpen(next);

    if (next && !fetched) {
      setLoadingSprints(true);
      setSprintsError(null);
      try {
        const data = await getProjectSprints(projectId);
        setSprints(data);
        setFetched(true);
      } catch (err) {
        setSprintsError(
          err instanceof Error ? err.message : "Failed to load sprints"
        );
      } finally {
        setLoadingSprints(false);
      }
    }
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* ── Main card info ── */}
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-bold">{project.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {project.description ?? "—"}
          </p>
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <p className="text-xs text-muted-foreground">Student(s)</p>
          {contributors.length === 0 ? (
            <p className="font-medium">—</p>
          ) : (
            contributors.map((c: any, i: number) => (
              <p key={`contributor-${i}`} className="font-medium">
                {typeof c === "object"
                  ? (c.fullName ?? c.email ?? c._id ?? "—")
                  : String(c)}
              </p>
            ))
          )}
        </div>

        {(project.uniSupervisorName || project.uniSupervisor) && (
          <div className="flex flex-col text-sm">
            <p className="text-xs text-muted-foreground">University Supervisor</p>
            <p className="font-medium">
              {project.uniSupervisorName ??
                (typeof project.uniSupervisor === "object"
                  ? project.uniSupervisor?.fullName ?? project.uniSupervisor?.email ?? "—"
                  : "—")}
            </p>
          </div>
        )}

        {(project.compSupervisorName || project.compSupervisor) && (
          <div className="flex flex-col text-sm">
            <p className="text-xs text-muted-foreground">Company Supervisor</p>
            <p className="font-medium">
              {project.compSupervisorName ??
                (typeof project.compSupervisor === "object"
                  ? project.compSupervisor?.fullName ?? project.compSupervisor?.email ?? "—"
                  : "—")}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground">Start Date</p>
            <p className="font-medium">{formatDate(project.startDate)}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground">End Date</p>
            <p className="font-medium">{formatDate(project.endDate)}</p>
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={handleToggle}
          className="flex w-full items-center justify-between rounded-lg border border-dashed px-4 py-2.5 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <span>
            {open ? "Hide Sprints" : "View Sprints"}
            {fetched && sprints.length > 0 && (
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-semibold">
                {sprints.length}
              </span>
            )}
          </span>
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* ── Sprints panel ── */}
      {open && (
        <div className="border-t bg-muted/20 px-6 py-4 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Sprints
          </h3>

          {loadingSprints && (
            <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading sprints…
            </div>
          )}

          {sprintsError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {sprintsError}
            </div>
          )}

          {!loadingSprints && !sprintsError && fetched && sprints.length === 0 && (
            <p className="text-sm text-muted-foreground py-2">
              No sprints found for this project.
            </p>
          )}

          {!loadingSprints &&
            !sprintsError &&
            sprints.map((sprint, i) => (
              <SprintCard
                key={sprint._id ?? `sprint-${i}`}
                sprint={sprint}
                index={i}
              />
            ))}
        </div>
      )}
    </div>
  );
};