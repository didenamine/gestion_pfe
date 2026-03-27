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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task } from "@/types";
import { getUserStories } from "@/services/user-stories";

interface TaskForm {
  title: string;
  status: Task["status"];
  priority: Task["priority"];
  userStoryId: string;
}

interface TaskDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isEditing: boolean;
  form: TaskForm;
  setForm: React.Dispatch<React.SetStateAction<TaskForm>>;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetForm: () => void;
  trigger?: React.ReactNode;
}
const STATUS_OPTIONS: Task["status"][] = [
  "todo",
  "inprogress",
  "standby",
  "done",
];

const PRIORITY_OPTIONS: Task["priority"][] = ["high", "medium", "low"];

export const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  setOpen,
  isEditing,
  form,
  setForm,
  handleSubmit,
  handleChange,
  resetForm,
}) => {
  const [userStories, setUserStories] = useState<
    { id: string; title: string }[]
  >([]);

  useEffect(() => {
    if (!open || isEditing) return;
    // Fetch user stories for dropdown
    (async () => {
      const response = await getUserStories();
      setUserStories(response);
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
            <DialogTitle>{isEditing ? "Edit Task" : "Create Task"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your task details."
                : "Create a new task for your user story."}
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
            {!isEditing && (
              <div className="space-y-1">
                <Label>User Story</Label>
                <Select
                  value={form.userStoryId}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      userStoryId: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select user story" />
                  </SelectTrigger>
                  <SelectContent>
                    {userStories.map((userStory) => (
                      <SelectItem key={userStory.id} value={userStory.id}>
                        {userStory.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    status: value as Task["status"],
                  }))
                }
              >
                <SelectTrigger className="w-full capitalize">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    priority: value as Task["priority"],
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
          </div>

          {/* ACTIONS */}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {isEditing ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
