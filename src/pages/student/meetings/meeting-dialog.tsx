import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllTasks } from "@/services/tasks";
import { getUserStories } from "@/services/user-stories";
import { useEffect, useState } from "react";

const REFERENCE_TYPE_OPTIONS: { value: ReferenceType; label: string }[] = [
  { value: "user_story", label: "User Story" },
  { value: "task", label: "Task" },
  { value: "report", label: "Report" },
];

interface MeetingDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isEditing: boolean;
  form: MeetingForm;
  setForm: React.Dispatch<React.SetStateAction<MeetingForm>>;
  scheduledDate: Date | null;
  setScheduledDate: (date: Date) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetForm: () => void;
}

interface MeetingForm {
  scheduledDate: string;
  agenda: string;
  actualMinutes: string;
  referenceType: ReferenceType;
  referenceId: string;
}

type ReferenceType = "user_story" | "task" | "report";

type ReferenceItem = { id: string; title: string }; 

export function MeetingDialog({
  open,
  setOpen,
  isEditing,
  form,
  setForm,
  scheduledDate,
  setScheduledDate,
  handleSubmit,
  handleChange,
  resetForm,
}: MeetingDialogProps) {
  const [referenceItems, setReferenceItems] = useState<ReferenceItem[]>([]); // 👈 corrigé
  const [loadingRefs, setLoadingRefs] = useState(false);

  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadingRefs(true);
    setReferenceItems([]);

    switch (form.referenceType) {
      case "user_story":
        getUserStories().then((stories) => {
          if (!cancelled) {
            setReferenceItems(stories.map((s) => ({ id: s.id, title: s.title })));
            setLoadingRefs(false);
          }
        });
        break;
      case "task":
        getAllTasks().then((tasks) => {
          if (!cancelled) {
            setReferenceItems(tasks.map((t) => ({ id: t.id, title: t.title })));
            setLoadingRefs(false);
          }
        });
        break;
      case "report":
        // getReportVersions().then((reports) => {
        //   if (!cancelled) {
        //     setReferenceItems(reports.map((r) => ({ id: r.id, title: r.version })));
        //     setLoadingRefs(false);
        //   }
        // });
        break;
    }

    return () => {
      cancelled = true;
    };
  }, [open, form.referenceType]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        setOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit meeting" : "Create new meeting"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your meeting details."
                : "Create a new meeting."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {/* Title */}
            <div className="space-y-1">
              <Label htmlFor="agenda">Title</Label>
              <Input
                id="agenda"
                name="agenda"
                required
                value={form.agenda}
                onChange={handleChange}
                placeholder="Meeting Title..."
              />
            </div>

            {/* Scheduled date */}
            <div className="space-y-1">
              <Label>Scheduled Date</Label>
              <DatePicker
                value={scheduledDate ?? null}
                onChange={setScheduledDate}
                disabled={(date) => date < tomorrow}
              />
            </div>

            {/* Time */}
            <div className="space-y-1">
              <Label htmlFor="actualMinutes">Time</Label>
              <Input
                id="actualMinutes"
                name="actualMinutes"
                type="time"
                value={form.actualMinutes ?? "00:00"}
                onChange={handleChange}
              />
            </div>

            {/* Reference type */}
            <div className="space-y-1">
              <Label>Reference Type</Label>
              <Select
                value={form.referenceType}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    referenceType: value as ReferenceType,
                    referenceId: "",
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {REFERENCE_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reference item */}
            <div className="space-y-1">
              <Label>Reference</Label>
              <Select
                value={form.referenceId}
                disabled={loadingRefs || referenceItems.length === 0}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, referenceId: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      loadingRefs
                        ? "Loading..."
                        : referenceItems.length === 0
                          ? "No items found"
                          : "Select reference"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {referenceItems.map((item: ReferenceItem) => ( 
                    <SelectItem key={item.id} value={item.id}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {isEditing ? "Update Meeting" : "Create Meeting"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


