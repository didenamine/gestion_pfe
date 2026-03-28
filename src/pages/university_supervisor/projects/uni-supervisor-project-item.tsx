import React from "react";

interface UniSupervisorProjectCardProps {
  project: any;
}

function formatDate(date: string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const UniSupervisorProjectCard: React.FC<UniSupervisorProjectCardProps> = ({ project }) => {
  const contributors = project.contributors ?? [];

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      {/* Title & Description */}
      <div>
        <h2 className="text-xl font-bold">{project.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {project.description ?? "—"}
        </p>
      </div>

      {/* Students */}
      <div className="flex flex-col gap-1 text-sm">
        <p className="text-xs text-muted-foreground">Student(s)</p>
        {contributors.length === 0 ? (
          <p className="font-medium">—</p>
        ) : (
          contributors.map((c: any, i: number) => (
            <p key={i} className="font-medium">
              {typeof c === "object"
                ? (c.fullName ?? c.email ?? c._id ?? "—")
                : String(c)}
            </p>
          ))
        )}
      </div>

      {/* University Supervisor */}
      {(project.uniSupervisorName || project.uniSupervisor) && (
        <div className="flex flex-col text-sm">
          <p className="text-xs text-muted-foreground">University Supervisor</p>
          <p className="font-medium">
            {project.uniSupervisorName ??
              (typeof project.uniSupervisor === "object"
                ? project.uniSupervisor?.fullName ?? project.uniSupervisor?.email ?? "—"
                : "—")}
          </p>
        </div>
      )}

      {/* Company Supervisor */}
      {(project.compSupervisorName || project.compSupervisor) && (
        <div className="flex flex-col text-sm">
          <p className="text-xs text-muted-foreground">Company Supervisor</p>
          <p className="font-medium">
            {project.compSupervisorName ??
              (typeof project.compSupervisor === "object"
                ? project.compSupervisor?.fullName ?? project.compSupervisor?.email ?? "—"
                : "—")}
          </p>
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground">Start Date</p>
          <p className="font-medium">{formatDate(project.startDate)}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground">End Date</p>
          <p className="font-medium">{formatDate(project.endDate)}</p>
        </div>
      </div>
    </div>
  );
};