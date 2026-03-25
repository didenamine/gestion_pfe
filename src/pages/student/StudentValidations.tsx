import { mockValidations } from "@/data/mockdata";
import { ValidationBadge } from "@/components/ui/badges";
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  Link2,
} from "lucide-react";

const iconByStatus = {
  approved: <CheckCircle2 className="size-4 text-emerald-500" />,
  rejected: <XCircle className="size-4 text-red-500" />,
  pending: <Clock className="size-4 text-amber-500" />,
};

export default function StudentValidations() {
  const pending = mockValidations.filter((v) => v.status === "pending");
  const approved = mockValidations.filter((v) => v.status === "approved");
  const rejected = mockValidations.filter((v) => v.status === "rejected");

  const Section = ({
    title,
    items,
  }: {
    title: string;
    items: typeof mockValidations;
  }) => (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((val) => (
          <div key={val.id} className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{iconByStatus[val.status]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-medium text-sm">{val.taskTitle}</span>
                  <ValidationBadge status={val.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <User className="size-3" />
                    {val.validatorName}
                    <span className="text-muted-foreground/60">
                      (
                      {val.validatorRole === "UniSupervisor"
                        ? "Encadrant univ."
                        : "Encadrant ent."}
                      )
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(val.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                  {val.meetingTitle && (
                    <span className="flex items-center gap-1">
                      <Link2 className="size-3" />
                      {val.meetingTitle}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {val.comment && (
              <div className="ml-7 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                "{val.comment}"
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Validations</h2>
        <p className="text-sm text-muted-foreground">
          {pending.length} en attente · {approved.length} approuvée(s) ·{" "}
          {rejected.length} rejetée(s)
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border bg-amber-50 border-amber-200 p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{pending.length}</p>
          <p className="text-xs text-amber-600 mt-0.5">En attente</p>
        </div>
        <div className="rounded-xl border bg-emerald-50 border-emerald-200 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">
            {approved.length}
          </p>
          <p className="text-xs text-emerald-600 mt-0.5">Approuvées</p>
        </div>
        <div className="rounded-xl border bg-red-50 border-red-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{rejected.length}</p>
          <p className="text-xs text-red-600 mt-0.5">Rejetées</p>
        </div>
      </div>

      {pending.length > 0 && (
        <Section title={`⏳ En attente (${pending.length})`} items={pending} />
      )}
      {rejected.length > 0 && (
        <Section title={`✗ Rejetées (${rejected.length})`} items={rejected} />
      )}
      {approved.length > 0 && (
        <Section title={`✓ Approuvées (${approved.length})`} items={approved} />
      )}
    </div>
  );
}
