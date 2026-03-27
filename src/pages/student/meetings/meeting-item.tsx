// meeting-item.tsx
import type { Meeting } from "@/types";
import { Button } from "@/components/ui/button";
import { MdDelete, MdEdit } from "react-icons/md";

interface MeetingItemProps {
  meeting: Meeting;
  handleEdit: () => void;
  handleDelete: () => void;
}

export function MeetingItem({
  meeting,
  handleEdit,
  handleDelete,
}: MeetingItemProps) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* HEADER */}
      <div className="w-full flex items-center gap-3 p-4">
        <div className="flex flex-1 items-start justify-between gap-4">
          {/* LEFT */}
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-lg truncate">
                {meeting.agenda}
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              {new Date(meeting.scheduledDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {" for "}
              {meeting.actualMinutes} minutes
            </p>

            {meeting.agenda && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {meeting.referenceType}
              </p>
            )}
          </div>

          {/* RIGHT */}
          <div className="shrink-0 text-right space-y-1 min-w-30">
            <div className="flex gap-1 justify-end mt-1">
              {/* EDIT */}
              <Button size="icon" variant="ghost" onClick={handleEdit}>
                <MdEdit />
              </Button>

              {/* DELETE */}
              <Button size="icon" variant="ghost" onClick={handleDelete}>
                <MdDelete />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
