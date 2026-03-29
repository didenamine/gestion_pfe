// src/pages/student/meetings/meeting-detail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { getMeetingById } from "@/services/meetings";
import type { Meeting } from "@/types";
import { Button } from "@/components/ui/button";
import { MdArrowBack } from "react-icons/md";

export default function MeetingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;
//     // getMeetingById(id)
//       .then(setMeeting)
//       .finally(() => setLoading(false));
//   }, [id]);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!meeting) return <p className="text-muted-foreground">Meeting not found.</p>;

  return (
    <div className="space-y-6 max-w-2xl">
        <p>test</p>
      {/* Back */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <MdArrowBack /> Back
      </Button>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold">{meeting.agenda}</h1>
        <p className="text-sm text-muted-foreground mt-1">Meeting Details</p>
      </div>

      {/* Info card */}
      <div className="rounded-xl border bg-card p-6 space-y-4">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Scheduled Date
            </p>
            <p className="font-medium">
              {new Date(meeting.scheduledDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* {meeting.scheduledTime && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Time
              </p>
              <p className="font-medium">{meeting.scheduledTime}</p>
            </div>
          )} */}

          {meeting.actualMinutes && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Duration
              </p>
              <p className="font-medium">{meeting.actualMinutes} min</p>
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Reference Type
            </p>
            <p className="font-medium capitalize">
              {meeting.referenceType.replace("_", " ")}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Reference ID
            </p>
            <p className="font-medium truncate">{meeting.referenceId}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Created At
            </p>
            <p className="font-medium">
              {new Date(meeting.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}