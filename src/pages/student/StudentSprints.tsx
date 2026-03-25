import { useState } from "react";
import { mockSprints, mockUserStories, mockTasks } from "@/data/mockdata";
import {
  SprintStatusBadge,
  PriorityBadge,
  ProgressBar,
} from "@/components/ui/badges";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Target,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Plus,
} from "lucide-react";

export default function StudentSprints() {
  const [expandedSprints, setExpandedSprints] = useState<Set<string>>(
    new Set(["sprint-2"]),
  );

  const toggleSprint = (id: string) => {
    setExpandedSprints((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Sprints</h2>
          <p className="text-sm text-muted-foreground">
            {mockSprints.length} sprint(s) — {mockUserStories.length} user
            stories
          </p>
        </div>
        <Button size="sm">
          <Plus className="size-4 mr-1" />
          Nouveau sprint
        </Button>
      </div>

      <div className="space-y-3">
        {mockSprints.map((sprint) => {
          const stories = mockUserStories.filter(
            (us) => us.sprintId === sprint.id,
          );
          const sprintTasks = mockTasks.filter((t) => t.sprintId === sprint.id);
          const done = sprintTasks.filter((t) => t.status === "Done").length;
          const pct =
            sprintTasks.length > 0
              ? Math.round((done / sprintTasks.length) * 100)
              : 0;
          const isExpanded = expandedSprints.has(sprint.id);

          return (
            <div
              key={sprint.id}
              className="rounded-xl border bg-card overflow-hidden"
            >
              {/* Sprint header */}
              <button
                className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
                onClick={() => toggleSprint(sprint.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm">
                      {sprint.title}
                    </span>
                    <SprintStatusBadge status={sprint.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{sprint.goal}</p>
                </div>
                <div className="shrink-0 text-right space-y-1 min-w-[80px]">
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {done}/{sprintTasks.length} tâches
                  </p>
                  <ProgressBar value={pct} size="sm" showLabel={false} />
                </div>
              </button>

              {/* Sprint details */}
              {isExpanded && (
                <div className="border-t px-4 pb-4 pt-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(sprint.startDate).toLocaleDateString(
                        "fr-FR",
                      )} →{" "}
                      {new Date(sprint.endDate).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  {/* User stories */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <BookOpen className="size-4 text-muted-foreground" />
                      User Stories ({stories.length})
                    </span>
                    <Button size="sm" variant="outline">
                      <Plus className="size-3 mr-1" />
                      Ajouter
                    </Button>
                  </div>

                  {stories.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      Aucune user story
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {stories.map((us) => {
                        const usTasks = mockTasks.filter(
                          (t) => t.userStoryId === us.id,
                        );
                        const usDone = usTasks.filter(
                          (t) => t.status === "Done",
                        ).length;
                        return (
                          <div
                            key={us.id}
                            className="rounded-lg border p-3 space-y-2"
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium leading-tight">
                                  {us.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {us.description}
                                </p>
                              </div>
                              <PriorityBadge priority={us.priority} />
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Target className="size-3" />
                                {us.estimatedPoints} pts
                              </span>
                              <span>
                                {usDone}/{usTasks.length} tâches
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
