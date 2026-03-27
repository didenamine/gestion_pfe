import { useEffect, useState, useCallback } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  getAllProjects,
  getProgress,
  getSupervisorTimeline,
  getSupervisorPendingValidations,
  getSupervisorLatestMeetings,
} from  "../../services/dahsboardSupervisors";
import type {
  Project,
  ProgressData,
  TimelineEvent,
  PendingValidationTask,
  Meeting,
} from "../../types/dashboard.ts";

const now = new Date();

const navData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/uni/dashboard",
      items: [],
    },
  ],
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmt(date: string | Date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtTime(date: string | Date) {
  return new Date(date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const EVENT_COLORS: Record<string, string> = {
  meeting: "#6366f1",
  report: "#10b981",
  status_change: "#f59e0b",
  validation: "#3b82f6",
};

const EVENT_LABELS: Record<string, string> = {
  meeting: "Meeting",
  report: "Report",
  status_change: "Status",
  validation: "Validation",
};

// ─── small reusable UI ────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="h-6 w-6 rounded-full border-2 border-muted border-t-primary animate-spin" />
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return <p className="text-sm text-muted-foreground text-center py-6">{msg}</p>;
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 rounded-full bg-muted overflow-hidden flex-1">
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

// ─── dashboard content (rendered inside the original layout) ──────────────────

function UniDashboardContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [validations, setValidations] = useState<PendingValidationTask[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [loadingTimeline, setLoadingTimeline] = useState(false);
  const [loadingValidations, setLoadingValidations] = useState(false);
  const [loadingMeetings, setLoadingMeetings] = useState(false);

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  useEffect(() => {
    setLoadingProjects(true);
    getAllProjects()
      .then((r) => {
        setProjects(r.data);
        if (r.data.length > 0) setSelectedId(r.data[0]._id);
      })
      .finally(() => setLoadingProjects(false));
  }, []);

  const loadTimeline = useCallback(() => {
    setLoadingTimeline(true);
    getSupervisorTimeline(month, year)
      .then((r) => setTimeline(r.data))
      .finally(() => setLoadingTimeline(false));
  }, [month, year]);

  useEffect(() => { loadTimeline(); }, [loadTimeline]);

  useEffect(() => {
    if (!selectedId) return;

    setLoadingProgress(true);
    getProgress(selectedId)
      .then((r) => setProgress(r.data))
      .finally(() => setLoadingProgress(false));

    setLoadingValidations(true);
    getSupervisorPendingValidations(selectedId)
      .then((r) => setValidations(r.data))
      .finally(() => setLoadingValidations(false));

    setLoadingMeetings(true);
    getSupervisorLatestMeetings(selectedId)
      .then((r) => setMeetings(r.data))
      .finally(() => setLoadingMeetings(false));
  }, [selectedId]);

  const selectedProject = projects.find((p) => p._id === selectedId) ?? null;

  return (
    <div className="flex flex-col gap-4">

      {/* top 3 stat cards — same grid as original */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">

        <div className="aspect-video rounded-xl bg-muted/50 p-5 flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Projects</p>
          {loadingProjects ? <Spinner /> : (
            <div>
              <p className="text-4xl font-bold">{projects.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {projects.reduce((a, p) => a + p.contributors.length, 0)} students total
              </p>
            </div>
          )}
        </div>

        <div className="aspect-video rounded-xl bg-muted/50 p-5 flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pending Validations</p>
          {loadingValidations ? <Spinner /> : (
            <div>
              <p className="text-4xl font-bold">{validations.length}</p>
              <p className="text-xs text-muted-foreground mt-1">tasks awaiting review</p>
            </div>
          )}
        </div>

        <div className="aspect-video rounded-xl bg-muted/50 p-5 flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Progress</p>
          {loadingProgress || !progress ? <Spinner /> : (
            <div>
              <p className="text-4xl font-bold">{progress.projectProgress.progress}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                {progress.projectProgress.doneTasks}/{progress.projectProgress.totalTasks} tasks done
              </p>
            </div>
          )}
        </div>
      </div>

      {/* big main block — same as original min-h block */}
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6 flex flex-col gap-6">

        {/* project selector */}
        <div>
          <p className="text-sm font-semibold mb-3">Select Project</p>
          {loadingProjects ? <Spinner /> : projects.length === 0 ? (
            <Empty msg="No projects assigned yet." />
          ) : (
            <div className="flex flex-wrap gap-2">
              {projects.map((p) => (
                <button
                  key={p._id}
                  onClick={() => setSelectedId(p._id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    selectedId === p._id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary"
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* sprint progress */}
          <div>
            <p className="text-sm font-semibold mb-3">
              Sprint Progress{selectedProject ? ` — ${selectedProject.title}` : ""}
            </p>
            {loadingProgress ? <Spinner /> : !progress ? (
              <Empty msg="Select a project." />
            ) : progress.sprints.length === 0 ? (
              <Empty msg="No sprints found." />
            ) : (
              <div className="flex flex-col gap-4">
                {progress.sprints.map((sprint) => (
                  <div key={sprint.id}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{sprint.title}</span>
                      <span className="text-muted-foreground text-xs">
                        {sprint.doneTasks}/{sprint.totalTasks} · {sprint.progress}%
                      </span>
                    </div>
                    <ProgressBar value={sprint.progress} />
                    {sprint.userStories.map((us) => (
                      <div key={us._id} className="flex items-center gap-2 mt-1.5 pl-3">
                        <span className="text-xs text-muted-foreground w-28 truncate shrink-0">{us.title}</span>
                        <ProgressBar value={us.progress} />
                        <span className="text-xs text-muted-foreground w-8 text-right shrink-0">{us.progress}%</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* students */}
          <div>
            <p className="text-sm font-semibold mb-3">
              Students{selectedProject ? ` — ${selectedProject.title}` : ""}
            </p>
            {!selectedProject ? <Empty msg="Select a project." /> : selectedProject.contributors.length === 0 ? (
              <Empty msg="No students." />
            ) : (
              <div className="flex flex-col gap-2">
                {selectedProject.contributors.map((c) => (
                  <div key={c._id} className="flex items-center gap-3 p-2 rounded-lg bg-background/60">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                      {c.fullName?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{c.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* pending validations */}
          <div>
            <p className="text-sm font-semibold mb-3">Pending Validations</p>
            {loadingValidations ? <Spinner /> : validations.length === 0 ? (
              <Empty msg="No pending validations." />
            ) : (
              <div className="flex flex-col gap-2">
                {validations.map((t) => (
                  <div key={t._id} className="rounded-lg border-l-2 border-yellow-400 bg-background/60 px-3 py-2">
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.userStoryId?.title ?? "—"}</p>
                    {t.lastValidation && (
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-full px-2 py-0.5">
                        {t.lastValidation.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* latest meetings */}
          <div>
            <p className="text-sm font-semibold mb-3">Latest Meetings</p>
            {loadingMeetings ? <Spinner /> : meetings.length === 0 ? (
              <Empty msg="No meetings found." />
            ) : (
              <div className="flex flex-col gap-2">
                {meetings.map((m) => (
                  <div key={m.id} className="rounded-lg border-l-2 border-blue-400 bg-background/60 px-3 py-2">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm font-medium">{m.agenda || "No Agenda"}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {fmt(m.scheduledDate)} · {fmtTime(m.scheduledDate)}
                      </span>
                    </div>
                    {m.createdBy && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        By {m.createdBy.fullName ?? m.createdBy.email ?? "—"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* timeline */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Timeline</p>
            <div className="flex gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="text-xs border rounded-md px-2 py-1 bg-background"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i).toLocaleString("en", { month: "long" })}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="text-xs border rounded-md px-2 py-1 bg-background"
              >
                {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          {loadingTimeline ? <Spinner /> : timeline.length === 0 ? (
            <Empty msg="No events this month." />
          ) : (
            <div className="relative pl-5">
              <div className="absolute left-1.5 top-1 bottom-1 w-px bg-border" />
              <div className="flex flex-col gap-4">
                {timeline.map((ev, i) => (
                  <div key={i} className="relative">
                    <div
                      className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full border-2 border-background"
                      style={{ background: EVENT_COLORS[ev.type] ?? "#94a3b8" }}
                    />
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span
                        className="text-[10px] font-bold rounded-full px-2 py-0.5"
                        style={{
                          color: EVENT_COLORS[ev.type] ?? "#94a3b8",
                          background: (EVENT_COLORS[ev.type] ?? "#94a3b8") + "20",
                        }}
                      >
                        {EVENT_LABELS[ev.type] ?? ev.type}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{fmt(ev.date)}</span>
                      {ev.projectName && (
                        <span className="text-[10px] text-muted-foreground">· {ev.projectName}</span>
                      )}
                    </div>
                    <p className="text-sm font-medium">{ev.title}</p>
                    <p className="text-xs text-muted-foreground">{ev.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── layout — identique à l'original ─────────────────────────────────────────

export default function UniversitySupervisorDashboard() {
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
          name: user.name ?? "Uni Supervisor",
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
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <UniDashboardContent />
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}