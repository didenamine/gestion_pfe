import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserStory } from "@/types";
import { getSprints } from "@/services/sprints";

interface UserStoryForm {
  title: string;
  description: string;
  priority: UserStory["priority"];
  sprintId: string;
}

interface UserStoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isEditing: boolean;
  form: UserStoryForm;
  setForm: React.Dispatch<React.SetStateAction<UserStoryForm>>;
  startDate: Date | null;
  setStartDate: (date: Date) => void;
  endDate: Date | null;
  setEndDate: (date: Date) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetForm: () => void;
  trigger?: React.ReactNode;
}

const PRIORITY_OPTIONS: UserStory["priority"][] = [
  "highest",
  "high",
  "medium",
  "low",
  "lowest",
];

export const UserStoryDialog: React.FC<UserStoryDialogProps> = ({
  open,
  setOpen,
  isEditing,
  form,
  setForm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleSubmit,
  handleChange,
  resetForm,
}) => {
  const [sprints, setSprints] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    if (!open || isEditing) return;
    // use the sprint service to fetch sprints for the select dropdown
    (async () => {
      const res = await getSprints();
      setSprints(res);
    })();
  }, [open, isEditing]);

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
              {isEditing ? "Edit User Story" : "Create User Story"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your user story details."
                : "Create a new user story for your sprint."}
            </DialogDescription>
          </DialogHeader>

          {/* FORM */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {!isEditing && (
              <div className="space-y-1">
                <Label>Sprint</Label>
                <Select
                  value={form.sprintId}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      sprintId: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sprint" />
                  </SelectTrigger>
                  <SelectContent>
                    {sprints.map((sprint) => (
                      <SelectItem key={sprint.id} value={sprint.id}>
                        {sprint.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    priority: value as UserStory["priority"],
                  }))
                }
              >
                <SelectTrigger className="w-full capitalize">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Start Date</Label>
              <DatePicker value={startDate ?? null} onChange={setStartDate} />
            </div>

            <div className="space-y-1">
              <Label>End Date</Label>
              <DatePicker value={endDate ?? null} onChange={setEndDate} />
            </div>
          </div>

          {/* ACTIONS */}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {isEditing ? "Update Story" : "Create Story"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
