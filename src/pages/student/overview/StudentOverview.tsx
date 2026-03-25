import {
  CheckSquare,
  Clock,
  AlertTriangle,
  CalendarDays,
  FileText,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  mockDashboardStats,
  mockJournalEvents,
  mockProject,
} from "@/data/mockdata";
import { ProgressBar } from "@/components/ui/badges";
import { MeetingStatusBadge } from "@/components/ui/badges";
import { Button } from "@/components/ui/button";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 flex items-start gap-4">
      <div className={`mt-0.5 rounded-lg p-2.5 ${color}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
const eventIcons: Record<string, React.ElementType> = {
  task_status_change: Clock,
  validation: ShieldCheck,
  meeting_planned: CalendarDays,
  meeting_completed: CalendarDays,
  report_uploaded: FileText,
  sprint_started: TrendingUp,
  sprint_completed: CheckSquare,
};

export default function StudentOverview() {
  const stats = mockDashboardStats;
  const recentEvents = mockJournalEvents.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {renderProjectHeader()}
      {renderTaskStats()}
      {/* <div className="grid gap-4 md:grid-cols-2">
        {sprintProgress()}
        {renderRecentEvents()}
      </div> */}

      {/* Upcoming meetings + last report */}
      {renderRecentReports()}
    </div>
  );

  function renderRecentReports() {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {renderRecentMeetings()}

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Last Report</h3>
            <Link
              to="/student/reports"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              Manage <ArrowRight className="size-3" />
            </Link>
          </div>
          {stats.lastReportVersion ? (
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {stats.lastReportVersion.fileName}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-full bg-muted px-2 py-0.5 font-medium">
                  {stats.lastReportVersion.version}
                </span>

                <span>
                  {new Date(
                    stats.lastReportVersion.uploadedAt,
                  ).toLocaleDateString("fr-FR")}
                </span>
                <span>{stats.lastReportVersion.fileSize}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.lastReportVersion.notes}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="size-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                No report submitted
              </p>
              <Link to="/student/reports">
                <Button size="sm" variant="outline" className="mt-3">
                  Submit a report
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderRecentMeetings() {
    return (
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Recent Meetings</h3>
          <Link
            to="/student/meetings"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            View all <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {stats.lastMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{meeting.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(meeting.scheduledDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <MeetingStatusBadge status={meeting.status} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderRecentEvents() {
    return (
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Journal récent</h3>
          <Link
            to="/student/journal"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            Voir tout <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentEvents.map((event) => {
            const Icon = eventIcons[event.type] ?? Clock;
            return (
              <div key={event.id} className="flex gap-3">
                <div className="mt-0.5 rounded-md bg-muted p-1.5 shrink-0">
                  <Icon className="size-3 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {event.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(event.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderSprintProgress() {
    return (
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Sprint Progress</h3>
          <Link
            to="/student/sprints"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            Voir tout <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="space-y-4">
          {stats.sprintProgress.map((sp) => (
            <div key={sp.sprintId}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {sp.sprintTitle.split("–")[1]?.trim() ?? sp.sprintTitle}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {sp.doneTasks}/{sp.totalTasks}
                </span>
              </div>
              <ProgressBar value={sp.percent} size="sm" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderTaskStats() {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Done"
          value={stats.tasksDone}
          icon={CheckSquare}
          color="bg-emerald-50 text-emerald-600"
          sub={`/ ${stats.totalTasks} total`}
        />
        <StatCard
          label="In Progress"
          value={stats.tasksInProgress}
          icon={Clock}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Standby"
          value={stats.tasksStandby}
          icon={AlertTriangle}
          color="bg-orange-50 text-orange-600"
        />
        <StatCard
          label="Pending Validations"
          value={stats.pendingValidations}
          icon={ShieldCheck}
          color="bg-amber-50 text-amber-600"
        />
      </div>
    );
  }

  function renderProjectHeader() {
    return (
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Active Project
            </p>
            <h2 className="text-lg font-semibold">{mockProject.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mockProject.description}
            </p>
          </div>
          <Link to="/student/project">
            <Button variant="outline" size="sm">
              See Details
              <ArrowRight className="size-3 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall progress</span>
            <span className="text-sm font-bold text-foreground">
              {stats.progressPercent}%
            </span>
          </div>
          <ProgressBar
            value={stats.progressPercent}
            size="lg"
            showLabel={false}
          />
        </div>
      </div>
    );
  }
}
