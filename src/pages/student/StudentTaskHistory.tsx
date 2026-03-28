import { useEffect, useState } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { TaskStatusBadge } from "@/components/ui/badges";
import { getAllTasks } from "@/services/tasks";
import { getTaskHistory, type TaskHistoryEntry } from "@/services/taskHistory";
import type { Task } from "@/types";
const getCurrentUserName = (): { id: string; name: string } | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    const u = JSON.parse(raw);
    return { id: u.id, name: u.fullName };
  } catch {
    return null;
  }
};
export default function StudentTaskHistory() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<TaskHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUserName();

  useEffect(() => {
    (async () => {
      try {
        const allTasks = await getAllTasks();
        setTasks(allTasks);

        const allHistory = await Promise.all(
          allTasks.map((task) => getTaskHistory(task.id)),
        );
        const flat = allHistory
          .flat()
          .sort(
            (a, b) =>
              new Date(b.modifiedAt).getTime() -
              new Date(a.modifiedAt).getTime(),
          );
        setHistory(flat);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>;
  }

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
          const task = tasks.find((t) => t.id === entry.taskId);
          return (
            <div
              key={entry._id}
              className="rounded-xl border bg-card p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">
                  {task?.title ?? entry.taskId}
                </p>
                <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                  <Clock className="size-3" />
                  {new Date(entry.modifiedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {entry.fieldChanged === "status" && (
                <div className="flex items-center gap-2">
                  {entry.oldValue?.status ? (
                    <TaskStatusBadge
                      status={entry.oldValue.status as Task["status"]}
                    />
                  ) : (
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-slate-50 text-slate-600 border-slate-200">
                      Créée
                    </span>
                  )}
                  <ArrowRight className="size-3 text-muted-foreground" />
                  <TaskStatusBadge
                    status={entry.newValue.status as Task["status"]}
                  />
                </div>
              )}

              {entry.fieldChanged !== "status" && (
                <p className="text-xs text-muted-foreground">
                  Champ modifié :{" "}
                  <span className="font-medium">{entry.fieldChanged}</span>
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                par{" "}
                {currentUser && entry.modifiedBy === currentUser.id
                  ? currentUser.name
                  : `Superviseur`}
              </p>
            </div>
          );
        })}

        {history.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            Aucun historique disponible.
          </p>
        )}
      </div>
    </div>
  );
}
