import { mockTaskHistory, mockTasks } from "@/data/mockdata";
import { TaskStatusBadge } from "@/components/ui/badges";
import { ArrowRight, Clock } from "lucide-react";

export default function StudentTaskHistory() {
  const history = [...mockTaskHistory].reverse();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Historique des statuts</h2>
        <p className="text-sm text-muted-foreground">
          {history.length} changement(s) enregistré(s)
        </p>
      </div>
      <div className="space-y-3">
        {history.map((entry) => {
          const task = mockTasks.find((t) => t.id === entry.taskId);
          return (
            <div
              key={entry.id}
              className="rounded-xl border bg-card p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">
                  {task?.title ?? entry.taskId}
                </p>
                <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                  <Clock className="size-3" />
                  {new Date(entry.changedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {entry.fromStatus ? (
                  <TaskStatusBadge status={entry.fromStatus} />
                ) : (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-slate-50 text-slate-600 border-slate-200">
                    Créée
                  </span>
                )}
                <ArrowRight className="size-3 text-muted-foreground" />
                <TaskStatusBadge status={entry.toStatus} />
              </div>
              {entry.comment && (
                <p className="text-xs text-muted-foreground italic bg-muted/50 rounded px-2 py-1">
                  "{entry.comment}"
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                par {entry.changedBy}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
