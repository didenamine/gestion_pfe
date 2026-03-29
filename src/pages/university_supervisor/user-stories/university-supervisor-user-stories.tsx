import React, { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Flag,
  Loader2,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/context/toast-context";
import { getSupervisorProjects } from "@/services/supervisor";
import { getProgress } from "@/services/dahsboardSupervisors"; 

// ─── nav ──────────────────────────────────────────────────────────────────────

const navData = {
  navMain: [
    { title: "Dashboard",    url: "/uni/dashboard"    },
    { title: "Projects",     url: "/uni/projects"     },
    { title: "Sprints",      url: "/uni/sprints"      },
    { title: "User Stories", url: "/uni/user-stories" },
                { title: "Reports",      url: "/uni/reports"      },

  ],
};

// ─── types ────────────────────────────────────────────────────────────────────

interface UserStory {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  sprintTitle?: string;
  totalTasks?: number;
  doneTasks?: number;
  progress?: number;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDate(date?: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const PRIORITY_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  critical: {
    label: "Critical",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    dot: "bg-red-500",
  },
  high: {
    label: "High",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    dot: "bg-orange-500",
  },
  medium: {
    label: "Medium",
    badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    dot: "bg-yellow-400",
  },
  low: {
    label: "Low",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    dot: "bg-sky-400",
  },
};

function getPriorityCfg(p?: string) {
  return (
    PRIORITY_CONFIG[p?.toLowerCase() ?? ""] ?? {
      label: p ?? "—",
      badge: "bg-muted text-muted-foreground",
      dot: "bg-muted-foreground",
    }
  );
}

// ─── UserStoryCard ────────────────────────────────────────────────────────────

function UserStoryCard({ story }: { story: UserStory }) {
  const cfg = getPriorityCfg(story.priority);

  return (
    <div className="rounded-xl border bg-card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
          </div>
          <h4 className="font-semibold text-sm leading-snug">{story.title}</h4>
        </div>
        {story.priority && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${cfg.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        )}
      </div>

      {story.description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {story.description}
        </p>
      )}

      {/* progress bar (si disponible) */}
      {story.progress !== undefined && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{story.doneTasks ?? 0} / {story.totalTasks ?? 0} tasks</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(story.progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1 border-t">
        {story.sprintTitle && (
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground font-medium">
            <Flag className="h-3 w-3" />
            {story.sprintTitle}
          </span>
        )}
        {(story.startDate || story.endDate) && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <CalendarDays className="h-3 w-3 shrink-0" />
            {formatDate(story.startDate)} → {formatDate(story.endDate)}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── ProjectUserStoriesSection ────────────────────────────────────────────────

function ProjectUserStoriesSection({ project }: { project: any }) {
  const [stories, setStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");

  const projectId = project._id ?? project.id;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getProgress(projectId);
        const sprints = result.data?.sprints ?? [];

        const allStories: UserStory[] = [];
        sprints.forEach((sprint: any) => {
          const sprintTitle = sprint.title;
          (sprint.userStories ?? []).forEach((story: any) => {
            allStories.push({
              ...story,
              id: story._id ?? story.id,
              sprintTitle,
            });
          });
        });

        setStories(allStories);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load user stories"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  const filtered = stories.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      (s.description ?? "").toLowerCase().includes(q);
    const matchPriority =
      filterPriority === "all" ||
      (s.priority ?? "").toLowerCase() === filterPriority;
    return matchSearch && matchPriority;
  });

  const counts = stories.reduce<Record<string, number>>((acc, s) => {
    const p = (s.priority ?? "none").toLowerCase();
    acc[p] = (acc[p] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* project header */}
      <div className="p-5 border-b bg-muted/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="font-bold text-base">{project.title}</h3>
            {project.description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {project.description}
              </p>
            )}
            {(project.contributors ?? []).length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Students:{" "}
                {project.contributors
                  .map((c: any) =>
                    typeof c === "object" ? (c.fullName ?? c.email ?? "—") : String(c)
                  )
                  .join(", ")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {!loading && !error && (
              <>
                <span className="text-xs rounded-full px-2.5 py-0.5 font-medium bg-primary/10 text-primary">
                  {stories.length} stor{stories.length !== 1 ? "ies" : "y"}
                </span>
                {Object.entries(counts)
                  .filter(([p]) => p !== "none")
                  .map(([p, n]) => {
                    const cfg = getPriorityCfg(p);
                    return (
                      <span
                        key={p}
                        className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${cfg.badge}`}
                      >
                        {n} {cfg.label}
                      </span>
                    );
                  })}
              </>
            )}
            <button
              onClick={() => setExpanded((v) => !v)}
              className="ml-1 rounded-md p-1.5 hover:bg-muted transition-colors"
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* body */}
      {expanded && (
        <div className="p-5 space-y-4">
          {loading && (
            <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading user stories…
            </div>
          )}

          {!loading && error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {!loading && !error && stories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <BookOpen className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No user stories found for this project.
              </p>
            </div>
          )}

          {!loading && !error && stories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search stories…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border bg-background pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="relative">
                <SlidersHorizontal className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="rounded-lg border bg-background pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
                >
                  <option value="all">All priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          )}

          {!loading && !error && stories.length > 0 && filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No stories match your search.
            </p>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((story, idx) => (
                <UserStoryCard
                  key={story.id ?? story._id ?? `story-${projectId}-${idx}`}
                  story={story}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── page content ─────────────────────────────────────────────────────────────

function UserStoriesContent() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await getSupervisorProjects();
        setProjects(result ?? []);
      } catch (err) {
        showToast({
          type: "error",
          message: err instanceof Error ? err.message : "Failed to load projects",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-6 w-6 rounded-full border-2 border-muted border-t-primary animate-spin" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-28">
        <div className="text-center space-y-2">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h2 className="text-xl font-bold">No projects assigned</h2>
          <p className="text-muted-foreground text-sm">
            You have no student projects to supervise yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Stories</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            All user stories across your supervised projects.
          </p>
        </div>
        <span className="text-sm text-muted-foreground">
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </span>
      </div>

      {projects.map((project, i) => (
        <ProjectUserStoriesSection
          key={project._id ?? project.id ?? `project-${i}`}
          project={project}
        />
      ))}
    </div>
  );
}

// ─── page layout ──────────────────────────────────────────────────────────────

export default function UniversitySupervisorUserStories() {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") ?? "{}");
    } catch {
      return {};
    }
  })();

  return (
    <SidebarProvider>
      <AppSidebar
        data={navData}
        userInfo={{
          name: user.name ?? "University Supervisor",
          role: user.role ?? "UniSupervisor",
        }}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/uni/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>User Stories</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <UserStoriesContent />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}