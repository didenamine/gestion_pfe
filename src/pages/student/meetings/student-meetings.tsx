import { MeetingStatusBadge } from "@/components/ui/badges";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toast-context";
import {
  createMeeting,
  deleteMeeting,
  getMeetings,
  updateMeeting,
} from "@/services/meetings";
import type { Meeting } from "@/types";
import { CalendarPlus, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { MeetingDialog } from "./meeting-dialog";
import { MeetingItem } from "./meeting-item";
type ReferenceType = "user_story" | "task" | "report";

interface MeetingForm {
  scheduledDate: string;
  agenda: string;
  actualMinutes: string;
  referenceType: ReferenceType;
  referenceId: string;
}

const DEFAULT_FORM: MeetingForm = {
  scheduledDate: "",
  agenda: "",
  actualMinutes: "",
  referenceType: "task",
  referenceId: "",
};

export default function StudentMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MeetingForm>(DEFAULT_FORM);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [actualMinutes, setActualMinutes] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      const data = await getMeetings();
      setMeetings(data);
    })();
  }, []);

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setScheduledDate(null);
    setActualMinutes(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      scheduledDate: scheduledDate?.toISOString() ?? "",
      actualMinutes: actualMinutes ?? "",
    };
    try {
      if (isEditing && editingId) {
        await updateMeeting(editingId, payload);
      } else {
        await createMeeting(payload);
      }
      const refreshed = await getMeetings();
      setMeetings(refreshed);
      setOpen(false);
      resetForm();
    } catch (err) {
      showToast({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  const handleEdit = (meeting: Meeting) => {
    setForm({
      scheduledDate: meeting.scheduledDate,
      agenda: meeting.agenda,
      actualMinutes: meeting.actualMinutes ?? "",
      referenceType: meeting.referenceType,
      referenceId: meeting.referenceId,
    });
    setScheduledDate(
      meeting.scheduledDate ? new Date(meeting.scheduledDate) : null,
    );
    setActualMinutes(meeting.actualMinutes ?? null);
    setEditingId(meeting.id);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMeeting(id);
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      showToast({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Meetings</h2>
          <p className="text-sm text-muted-foreground">
            {meetings.length} available meetings
          </p>
        </div>

        <Button size="sm" onClick={() => setOpen(true)} className="gap-1">
          <CalendarPlus className="size-4" />
          Create Meeting
        </Button>
      </div>

      <MeetingDialog
        open={open}
        setOpen={setOpen}
        isEditing={isEditing}
        form={form}
        setForm={setForm}
        scheduledDate={scheduledDate}
        setScheduledDate={setScheduledDate}
        actualMinutes={actualMinutes}
        setActualMinutes={setActualMinutes}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        resetForm={resetForm}
      />

      <div className="space-y-3">
        {meetings?.map((meeting) => (
          <MeetingItem
            key={meeting.id}
            meeting={meeting}
            handleEdit={() => handleEdit(meeting)}
            handleDelete={() => handleDelete(meeting.id)}
          />
        ))}
      </div>
    </div>
  );
}
