import { mockJournalEvents } from "@/data/mockdata";
import {
  Clock,
  ShieldCheck,
  CalendarDays,
  FileText,
  TrendingUp,
  CheckSquare,
} from "lucide-react";

const eventConfig = {
  task_status_change: {
    icon: Clock,
    bg: "bg-blue-50",
    color: "text-blue-600",
    label: "Statut modifié",
  },
  validation: {
    icon: ShieldCheck,
    bg: "bg-emerald-50",
    color: "text-emerald-600",
    label: "Validation",
  },
  meeting_planned: {
    icon: CalendarDays,
    bg: "bg-violet-50",
    color: "text-violet-600",
    label: "Réunion planifiée",
  },
  meeting_completed: {
    icon: CalendarDays,
    bg: "bg-emerald-50",
    color: "text-emerald-600",
    label: "Réunion complétée",
  },
  report_uploaded: {
    icon: FileText,
    bg: "bg-amber-50",
    color: "text-amber-600",
    label: "Rapport déposé",
  },
  sprint_started: {
    icon: TrendingUp,
    bg: "bg-blue-50",
    color: "text-blue-600",
    label: "Sprint démarré",
  },
  sprint_completed: {
    icon: CheckSquare,
    bg: "bg-emerald-50",
    color: "text-emerald-600",
    label: "Sprint terminé",
  },
};

export default function StudentJournal() {
  const events = [...mockJournalEvents].reverse();

  // Group by date
  const grouped = events.reduce<Record<string, typeof events>>((acc, ev) => {
    const date = new Date(ev.createdAt).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(ev);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Journal de stage</h2>
        <p className="text-sm text-muted-foreground">
          {events.length} événement(s) enregistré(s)
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([date, dayEvents]) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {date}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="space-y-3">
              {dayEvents.map((ev) => {
                const cfg =
                  eventConfig[ev.type] ?? eventConfig.task_status_change;
                const Icon = cfg.icon;
                return (
                  <div key={ev.id} className="flex gap-3">
                    <div className={`rounded-lg p-2 shrink-0 h-fit ${cfg.bg}`}>
                      <Icon className={`size-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 rounded-xl border bg-card p-3">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-sm">{ev.title}</span>
                        <span
                          className={`text-xs rounded-full border px-2 py-0.5 ${cfg.bg} ${cfg.color}`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {ev.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {new Date(ev.createdAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        · {ev.actor}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
