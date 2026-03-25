import { Link } from "react-router-dom";
import { useMemo } from "react";
import { mockMeetings } from "@/data/mockdata";
import { MeetingStatusBadge } from "@/components/ui/badges";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Clock } from "lucide-react";

export default function StudentMeetings() {
  const sortedMeetings = useMemo(() => {
    return [...mockMeetings].sort(
      (a, b) =>
        new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime(),
    );
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Réunions</h2>
          <p className="text-sm text-muted-foreground">
            {mockMeetings.length} réunion(s) disponible(s)
          </p>
        </div>

        <Button asChild size="sm">
          <Link to="/student/meetings/create" className="gap-1">
            <CalendarPlus className="size-4" />
            Créer
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {sortedMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="rounded-xl border bg-card p-4 flex items-start gap-4"
          >
            <div className="rounded-lg bg-muted p-2.5 shrink-0">
              <Clock className="size-5 text-muted-foreground" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-sm truncate">
                  {meeting.title}
                </p>
                <MeetingStatusBadge status={meeting.status} />
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                {new Date(meeting.scheduledDate).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              {meeting.agenda ? (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-3 whitespace-pre-line">
                  {meeting.agenda}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

