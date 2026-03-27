import { ProgressBar } from "@/components/ui/badges";
import type { Task, UserStory } from "@/types";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

interface UserStoryItemProps {
  userStory: UserStory;
  handleEdit: () => void;
  handleDelete: () => void;
}

const PRIORITY_COLOR: Record<UserStory["priority"], string> = {
  highest: "text-red-500",
  high: "text-orange-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
  lowest: "text-muted-foreground",
};

export function UserStoryItem({
  userStory,
  handleEdit,
  handleDelete,
}: UserStoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isExpanded || loaded) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        //const tasksData = await getTasksByUserStory(userStory.id);
        //setTasks(tasksData);
        setLoaded(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isExpanded, loaded, userStory.id]);

  const done = tasks.filter((t) => t.status === "Done").length;
  const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* HEADER */}
      <div
        className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="flex flex-1 items-start justify-between gap-4">
          {/* LEFT */}
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-lg truncate">
                {userStory.title}
              </span>
              <span
                className={`text-xs font-medium capitalize ${PRIORITY_COLOR[userStory.priority]}`}
              >
                {userStory.priority}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {userStory.description}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(userStory.startDate).toLocaleDateString("fr-FR")} →{" "}
              {new Date(userStory.endDate).toLocaleDateString("fr-FR")}
            </p>
          </div>

          {/* RIGHT */}
          <div className="shrink-0 text-right space-y-1 min-w-30">
            <p className="text-xs text-muted-foreground tabular-nums">
              {done}/{tasks.length} tasks
            </p>
            <ProgressBar value={pct} size="sm" showLabel={false} />

            {/* ACTIONS */}
            <div
              className="flex gap-1 justify-end mt-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Button size="icon" variant="ghost" onClick={handleEdit}>
                <MdEdit />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleDelete}>
                <MdDelete />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILS */}
      {isExpanded && (
        <div className="border-t px-4 pb-4 pt-3 space-y-3">
          {loading && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Loading...
            </p>
          )}

          {!loading && (
            <>
              <div className="flex justify-between">
                <span className="text-sm font-medium">
                  Tasks ({tasks.length})
                </span>
                <Button size="sm" variant="outline">
                  Add Task
                </Button>
              </div>

              {tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks yet
                </p>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div key={task.id} className="border rounded p-3">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.description}
                      </p>
                      <p className="text-xs mt-1">{task.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
