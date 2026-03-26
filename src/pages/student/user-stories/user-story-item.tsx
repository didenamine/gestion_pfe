import { ProgressBar } from "@/components/ui/badges";
import { getStoriesBySprint, getTasksBySprint } from "@/services/sprints";
import type { Sprint, Task, UserStory } from "@/types";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

interface SprintItemProps {
  sprint: Sprint;
  handleEdit: () => void;
  handleDelete: () => void;
}

export function SprintItem({
  sprint,
  handleEdit,
  handleDelete,
}: SprintItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isExpanded || loaded) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [tasksData, storiesData] = await Promise.all([
          getTasksBySprint(sprint.id),
          getStoriesBySprint(sprint.id),
        ]);

        setTasks(tasksData);
        setStories(storiesData);
        setLoaded(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isExpanded, loaded, sprint.id]);

  const sprintTasks = tasks;
  const done = sprintTasks.filter((t) => t.status === "Done").length;
  const pct =
    sprintTasks.length > 0 ? Math.round((done / sprintTasks.length) * 100) : 0;

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
                {sprint.title}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {sprint.goal}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(sprint.startDate).toLocaleDateString("fr-FR")} →{" "}
              {new Date(sprint.endDate).toLocaleDateString("fr-FR")}
            </p>
          </div>

          {/* RIGHT */}
          <div className="shrink-0 text-right space-y-1 min-w-30">
            <p className="text-xs text-muted-foreground tabular-nums">
              {done}/{sprintTasks.length} tasks
            </p>
            <ProgressBar value={pct} size="sm" showLabel={false} />

            {/* ACTIONS */}
            <div
              className="flex gap-1 justify-end mt-1"
              onClick={(e) => e.stopPropagation()}
            >
              {/* EDIT */}
              <Button size="icon" variant="ghost" onClick={handleEdit}>
                <MdEdit />
              </Button>

              {/* DELETE */}
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
          {/* dates */}
          <p className="text-xs text-muted-foreground">
            {new Date(sprint.startDate).toLocaleDateString("fr-FR")} →{" "}
            {new Date(sprint.endDate).toLocaleDateString("fr-FR")}
          </p>

          {/* loading */}
          {loading && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Loading...
            </p>
          )}

          {/* stories */}
          {!loading && (
            <>
              <div className="flex justify-between">
                <span className="text-sm font-medium">
                  User Stories ({stories.length})
                </span>
                <Button size="sm" variant="outline">
                  Ajouter
                </Button>
              </div>

              {stories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune user story
                </p>
              ) : (
                <div className="space-y-2">
                  {stories.map((us) => {
                    const usTasks = tasks.filter(
                      (t) => t.userStoryId === us.id,
                    );
                    const usDone = usTasks.filter(
                      (t) => t.status === "Done",
                    ).length;

                    return (
                      <div key={us.id} className="border rounded p-3">
                        <p className="font-medium text-sm">{us.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {us.description}
                        </p>

                        <p className="text-xs mt-1">
                          {usDone}/{usTasks.length} tâches
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
