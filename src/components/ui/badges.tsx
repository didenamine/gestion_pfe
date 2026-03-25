import { cn } from "@/lib/utils";
import type { TaskStatus, ValidationStatus } from "@/types";

// ─── Task Status Badge ────────────────────────────────────────────────────────
const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  ToDo: {
    label: "À faire",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  InProgress: {
    label: "En cours",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  Standby: {
    label: "Bloquée",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  Done: {
    label: "Terminée",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

export function TaskStatusBadge({
  status,
  className,
}: {
  status: TaskStatus;
  className?: string;
}) {
  const cfg = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cfg.className,
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "ToDo" && "bg-slate-400",
          status === "InProgress" && "bg-blue-500",
          status === "Standby" && "bg-orange-500",
          status === "Done" && "bg-emerald-500",
        )}
      />
      {cfg.label}
    </span>
  );
}

// ─── Validation Badge ─────────────────────────────────────────────────────────
const validationConfig: Record<
  ValidationStatus,
  { label: string; className: string }
> = {
  approved: {
    label: "Approuvée",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Rejetée",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  pending: {
    label: "En attente",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

export function ValidationBadge({
  status,
  className,
}: {
  status: ValidationStatus;

  className?: string;
}) {
  const cfg = validationConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cfg.className,
        className,
      )}
    >
      {cfg.label}
    </span>
  );
}

// ─── Priority Badge ───────────────────────────────────────────────────────────
const priorityConfig = {
  low: {
    label: "Basse",
    className: "bg-slate-50 text-slate-600 border-slate-200",
  },
  medium: {
    label: "Moyenne",
    className: "bg-blue-50 text-blue-600 border-blue-200",
  },
  high: {
    label: "Haute",
    className: "bg-orange-50 text-orange-600 border-orange-200",
  },
  critical: {
    label: "Critique",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export function PriorityBadge({
  priority,
  className,
}: {
  priority: "low" | "medium" | "high" | "critical";
  className?: string;
}) {
  const cfg = priorityConfig[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cfg.className,
        className,
      )}
    >
      {cfg.label}
    </span>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export function ProgressBar({
  value,
  className,
  showLabel = true,
  size = "md",
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const heights = { sm: "h-1", md: "h-2", lg: "h-3" };
  const color =
    value >= 80
      ? "bg-emerald-500"
      : value >= 50
        ? "bg-blue-500"
        : value >= 25
          ? "bg-amber-500"
          : "bg-red-500";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex-1 rounded-full bg-muted overflow-hidden",
          heights[size],
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            color,
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>

      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground tabular-nums w-9 text-right">
          {value}%
        </span>
      )}
    </div>
  );
}

// ─── Sprint Status Badge ──────────────────────────────────────────────────────
const sprintStatusConfig = {
  planned: {
    label: "Planifié",
    className: "bg-slate-50 text-slate-600 border-slate-200",
  },
  active: {
    label: "En cours",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  completed: {
    label: "Terminé",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

export function SprintStatusBadge({
  status,
  className,
}: {
  status: "planned" | "active" | "completed";
  className?: string;
}) {
  const cfg = sprintStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cfg.className,
        className,
      )}
    >
      {cfg.label}
    </span>
  );
}

// ─── Meeting Status Badge ─────────────────────────────────────────────────────
const meetingStatusConfig = {
  planned: {
    label: "Planifiée",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  completed: {
    label: "Complétée",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Annulée",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export function MeetingStatusBadge({
  status,
  className,
}: {
  status: "planned" | "completed" | "cancelled";
  className?: string;
}) {
  const cfg = meetingStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cfg.className,
        className,
      )}
    >
      {cfg.label}
    </span>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground">
        {icon}
      </div>
      <h3 className="mb-1 text-sm font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mb-4 text-sm text-muted-foreground max-w-xs">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
