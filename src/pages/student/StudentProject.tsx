import {
  mockProject,
  mockSprints,
  mockTasks,
  mockUserStories,
} from "@/data/mockdata";
import { SprintStatusBadge, ProgressBar } from "@/components/ui/badges";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  Target,
  ArrowRight,
  BookOpen,
  CheckSquare,
} from "lucide-react";

export default function StudentProject() {
  const activeSprint = mockSprints.find((s) => s.status === "active");
  const activeStories = mockUserStories.filter(
    (us) => us.sprintId === activeSprint?.id,
  );
  const activeTasks = mockTasks.filter((t) => t.sprintId === activeSprint?.id);
  const doneActiveTasks = activeTasks.filter((t) => t.status === "Done").length;
  const activeProgress =
    activeTasks.length > 0
      ? Math.round((doneActiveTasks / activeTasks.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Project header */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold">{mockProject.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mockProject.description}
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center rounded-full border bg-emerald-50 border-emerald-200 text-emerald-700 px-2.5 py-0.5 text-xs font-medium">
            Actif
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Étudiant</p>
              <p className="font-medium">{mockProject.studentName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">
                Encadrant universitaire
              </p>
              <p className="font-medium">{mockProject.uniSupervisorName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Target className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">
                Encadrant entreprise
              </p>
              <p className="font-medium">{mockProject.compSupervisorName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active sprint */}
      {activeSprint && (
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Sprint actif</h3>
              <SprintStatusBadge status={activeSprint.status} />
            </div>
            <Link to="/student/tasks">
              <Button variant="outline" size="sm">
                Voir kanban <ArrowRight className="size-3 ml-1" />
              </Button>
            </Link>
          </div>
          <p className="text-lg font-medium mb-1">{activeSprint.title}</p>

          <p className="text-sm text-muted-foreground mb-3">
            {activeSprint.goal}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {new Date(activeSprint.startDate).toLocaleDateString(
                "fr-FR",
              )} → {new Date(activeSprint.endDate).toLocaleDateString("fr-FR")}
            </span>
            <span className="flex items-center gap-1">
              <CheckSquare className="size-3" />
              {doneActiveTasks}/{activeTasks.length} tâches
            </span>
          </div>
          <ProgressBar value={activeProgress} size="md" />
        </div>
      )}

      {/* Sprints list */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Tous les sprints</h3>
          <Link to="/student/sprints">
            <Button variant="outline" size="sm">
              Gérer <ArrowRight className="size-3 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {mockSprints.map((sprint) => {
            const sprintTasks = mockTasks.filter(
              (t) => t.sprintId === sprint.id,
            );
            const done = sprintTasks.filter((t) => t.status === "Done").length;
            const pct =
              sprintTasks.length > 0
                ? Math.round((done / sprintTasks.length) * 100)
                : 0;
            return (
              <div
                key={sprint.id}
                className="flex items-center gap-4 rounded-lg border p-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium truncate">
                      {sprint.title}
                    </span>
                    <SprintStatusBadge status={sprint.status} />
                  </div>
                  <ProgressBar value={pct} size="sm" showLabel={false} />
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium tabular-nums">
                    {done}/{sprintTasks.length}
                  </p>
                  <p className="text-xs text-muted-foreground">{pct}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
