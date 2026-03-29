import React, { useEffect, useState } from "react";
import { CalendarDays, Target, Loader2 } from "lucide-react";
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
import { getSupervisorProjects, getProjectSprints } from "@/services/supervisor";

const navData = {
  navMain: [
    { title: "Dashboard",    url: "/uni/dashboard"    },
    { title: "Projects",     url: "/uni/projects"     },
    { title: "Sprints",      url: "/uni/sprints"      },
    { title: "User Stories", url: "/uni/user-stories" },
  ],
};

function formatDate(date: string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getSprintStatus(sprint: any): { label: string; cls: string } {
  const now   = new Date();
  const start = new Date(sprint.startDate);
  const end   = new Date(sprint.endDate);
  if (now >= start && now <= end)
    return { label: "Active",    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
  if (now > end)
    return { label: "Completed", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
  return   { label: "Upcoming",  cls: "bg-muted text-muted-foreground" };
}

function SprintCard({ sprint, index }: { sprint: any; index: number }) {
  const { label, cls } = getSprintStatus(sprint);
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3 hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {index + 1}
          </span>
          <h4 className="font-semibold text-sm">{sprint.title}</h4>
        </div>
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
          {label}
        </span>
      </div>
      {sprint.goal && (
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Target className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>{sprint.goal}</span>
        </div>
      )}
      {sprint.progress !== undefined && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{sprint.progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(sprint.progress, 100)}%` }}
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
        <span>{formatDate(sprint.startDate)} → {formatDate(sprint.endDate)}</span>
      </div>
      {sprint.totalTasks !== undefined && (
        <p className="text-xs text-muted-foreground">
          {sprint.doneTasks ?? 0} / {sprint.totalTasks} tasks done
        </p>
      )}
      {sprint.userStories && sprint.userStories.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {sprint.userStories.length} user {sprint.userStories.length === 1 ? "story" : "stories"}
        </p>
      )}
    </div>
  );
}

function ProjectSprintsSection({ project }: { project: any }) {
  const [sprints, setSprints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const projectId = project._id ?? project.id;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getProjectSprints(projectId);
        setSprints(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load sprints");
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  const active    = sprints.filter(s => getSprintStatus(s).label === "Active").length;
  const completed = sprints.filter(s => getSprintStatus(s).label === "Completed").length;
  const upcoming  = sprints.filter(s => getSprintStatus(s).label === "Upcoming").length;

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="p-5 border-b bg-muted/20 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-base">{project.title}</h3>
          {project.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{project.description}</p>
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
        {!loading && !error && (
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {active > 0 && (
              <span className="text-xs rounded-full px-2.5 py-0.5 font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {active} Active
              </span>
            )}
            {upcoming > 0 && (
              <span className="text-xs rounded-full px-2.5 py-0.5 font-medium bg-muted text-muted-foreground">
                {upcoming} Upcoming
              </span>
            )}
            {completed > 0 && (
              <span className="text-xs rounded-full px-2.5 py-0.5 font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {completed} Completed
              </span>
            )}
            {sprints.length === 0 && (
              <span className="text-xs text-muted-foreground">No sprints</span>
            )}
          </div>
        )}
      </div>
      <div className="p-5">
        {loading && (
          <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading sprints…
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {!loading && !error && sprints.length === 0 && (
          <p className="text-sm text-muted-foreground py-2">No sprints found for this project.</p>
        )}
        {!loading && !error && sprints.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sprints.map((sprint, i) => (
              <SprintCard
                key={sprint._id ?? sprint.id ?? `sprint-${i}`}
                sprint={sprint}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SprintsContent() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const { showToast }           = useToast();

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
      <div className="flex justify-center items-center py-16">
        <div className="h-6 w-6 rounded-full border-2 border-muted border-t-primary animate-spin" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">No projects assigned</h2>
          <p className="text-muted-foreground text-sm">You have no student projects to supervise yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sprints</h1>
        <span className="text-sm text-muted-foreground">
          {projects.length} project{projects.length > 1 ? "s" : ""}
        </span>
      </div>
      {projects.map((project, i) => (
        <ProjectSprintsSection
          key={project._id ?? project.id ?? `project-${i}`}
          project={project}
        />
      ))}
    </div>
  );
}

export default function UniversitySupervisorSprints() {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") ?? "{}"); }
    catch { return {}; }
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
                  <BreadcrumbLink href="/uni/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Sprints</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <SprintsContent />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}