import { useState } from "react";
import { mockTasks, mockSprints, mockUserStories } from "@/data/mockdata";
import type { Task, TaskStatus } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Clock,
  AlertTriangle,
  CheckSquare,
  ListTodo,
  ChevronRight,
} from "lucide-react";

const COLUMNS: {
  status: TaskStatus;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  { status: "ToDo", label: "À faire", icon: ListTodo, color: "text-slate-500" },
  {
    status: "InProgress",
    label: "En cours",
    icon: Clock,
    color: "text-blue-500",
  },
  {
    status: "Standby",
    label: "Bloquée",
    icon: AlertTriangle,
    color: "text-orange-500",
  },
  {
    status: "Done",
    label: "Terminée",
    icon: CheckSquare,
    color: "text-emerald-500",
  },
];

function TaskCard({ task }: { task: Task }) {
  const story = mockUserStories.find((us) => us.id === task.userStoryId);
  const sprint = mockSprints.find((s) => s.id === task.sprintId);

  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer space-y-2">
      <p className="text-sm font-medium leading-tight">{task.title}</p>
      {story && (
        <p className="text-xs text-muted-foreground truncate">{story.title}</p>
      )}
      <div className="flex items-center justify-between gap-2">
        {sprint && (
          <span className="text-xs text-muted-foreground truncate max-w-[120px]">
            {sprint.title.split("–")[0].trim()}
          </span>
        )}
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {task.estimatedHours}h
        </span>
      </div>
    </div>
  );
}

export default function StudentTasks() {
  const [selectedSprint, setSelectedSprint] = useState<string>("all");
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const filteredTasks =
    selectedSprint === "all"
      ? tasks
      : tasks.filter((t) => t.sprintId === selectedSprint);

  const getTasksByStatus = (status: TaskStatus) =>
    filteredTasks.filter((t) => t.status === status);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
          : t,
      ),
    );
  };

  return (
    <div className="space-y-4">
      {/* Sprint filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Sprint :</span>
        <Button
          variant={selectedSprint === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedSprint("all")}
        >
          Tous
        </Button>
        {mockSprints.map((sprint) => (
          <Button
            key={sprint.id}
            variant={selectedSprint === sprint.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSprint(sprint.id)}
          >
            {sprint.title.split("–")[0].trim()}
          </Button>
        ))}
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map(({ status, label, icon: Icon, color }) => {
          const colTasks = getTasksByStatus(status);
          return (
            <div key={status} className="flex flex-col">
              <div className="flex items-center gap-2 mb-3 px-1">
                <Icon className={`size-4 ${color}`} />
                <span className="text-sm font-semibold">{label}</span>
                <span className="ml-auto inline-flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {colTasks.length}
                </span>
              </div>
              <div className="flex-1 rounded-xl border-2 border-dashed border-muted p-2 space-y-2 min-h-[200px]">
                {colTasks.map((task) => (
                  <div key={task.id} className="group relative">
                    <TaskCard task={task} />
                    {/* Quick status change menu */}
                    <div className="absolute top-2 right-2 hidden group-hover:flex flex-col gap-1 z-10">
                      {COLUMNS.filter((c) => c.status !== status).map((col) => (
                        <button
                          key={col.status}
                          onClick={() =>
                            handleStatusChange(task.id, col.status)
                          }
                          className="flex items-center gap-1 rounded bg-background border px-1.5 py-0.5 text-xs shadow-sm hover:bg-muted whitespace-nowrap"
                          title={`Déplacer vers ${col.label}`}
                        >
                          <ChevronRight className="size-3" />
                          {col.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
                    Aucune tâche
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
