import { ProgressBar } from "@/components/ui/badges";
import type { Sprint, Task, UserStory } from "@/types";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useToast } from "@/context/toast-context";
import { getStoriesBySprint } from "@/services/user-stories";

interface SprintItemProps {
  sprint: Sprint;
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
export function SprintItem({
  sprint,
  handleEdit,
  handleDelete,
}: SprintItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // const [tasks, setTasks] = useState<Task[]>([]);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (!isExpanded || loaded) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const storiesData = await getStoriesBySprint(sprint.id);

        // setTasks(tasksData);
        setStories(storiesData);
        setLoaded(true);
      } catch (err) {
        console.error("this is the err:", err);
        showToast({
          type: "error",
          message:
            err instanceof Error
              ? err.message
              : "Failed to fetch sprint details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isExpanded, loaded, sprint.id]);

  const sprintUserStories = stories;
  const high = sprintUserStories.filter((t) => t.priority === "high").length;
  const pct =
    sprintUserStories.length > 0
      ? Math.round((high / sprintUserStories.length) * 100)
      : 0;

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
                <div className="flex items-center justify-between gap-4 min-w-0 w-full">
                  {/* LEFT */}
                  <span className="text-sm font-medium whitespace-nowrap">
                    User Stories ({sprintUserStories.length})
                  </span>

                  {/* RIGHT */}
                  <div className="flex items-center gap-3 min-w-0">
                    <p className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                      {high > 0 && `${high} high / `}
                      {sprintUserStories.length}
                    </p>

                    <ProgressBar
                      className="w-32"
                      value={pct}
                      size="sm"
                      showLabel={false}
                    />
                  </div>
                </div>
              </div>
              {stories.map((us) => (
                <div key={us.id} className="border rounded p-3">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-lg truncate">
                        {us.title}
                      </span>

                      <span
                        className={`text-xs font-medium capitalize ${
                          PRIORITY_COLOR[us.priority]
                        }`}
                      >
                        {us.priority}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {us.description}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {new Date(us.startDate).toLocaleDateString("fr-FR")} →{" "}
                      {new Date(us.endDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
