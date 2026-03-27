import type { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { MdDelete, MdEdit } from "react-icons/md";

interface TaskItemProps {
  task: Task;
  handleEdit: () => void;
  handleDelete: () => void;
}

const PRIORITY_COLOR: Record<Task["priority"], string> = {
  high: "text-orange-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
};

const STATUS_COLOR: Record<Task["status"], string> = {
  todo: "text-gray-500",
  inprogress: "text-blue-500",
  standby: "text-yellow-500",
  done: "text-green-500",
};

export function TaskItem({ task, handleEdit, handleDelete }: TaskItemProps) {
  return (
    <div className="rounded-lg border bg-card p-4 flex items-start justify-between gap-4 hover:shadow-sm transition">
      {/* LEFT */}
      <div className="space-y-1 min-w-0">
        <p className="font-medium text-sm truncate">{task.title}</p>

        <div className="flex items-center gap-3 text-xs">
          {/* STATUS */}
          <span className={`font-medium ${STATUS_COLOR[task.status]}`}>
            {task.status}
          </span>

          {/* PRIORITY */}
          <span
            className={`capitalize font-medium ${PRIORITY_COLOR[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>

        {/* DATES */}
        <p className="text-xs text-muted-foreground">
          Created: {new Date(task.createdAt).toLocaleDateString("fr-FR")}
        </p>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex gap-1 shrink-0">
        <Button size="icon" variant="ghost" onClick={handleEdit}>
          <MdEdit />
        </Button>

        <Button size="icon" variant="ghost" onClick={handleDelete}>
          <MdDelete />
        </Button>
      </div>
    </div>
  );
}
