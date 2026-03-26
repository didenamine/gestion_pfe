import React from "react";
import { DatePicker } from "@/components/date-picker";

import {
  Dialog,
  DialogTrigger,
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

interface FormState {
  title: string;
  description: string;
}

interface NoProjectDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;

  form: FormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;

  startDate: Date | null;
  setStartDate: (date: Date | null) => void;

  endDate: Date | null;
  setEndDate: (date: Date | null) => void;

  isEditing?: boolean; // optional for reuse later
  resetForm: () => void;
}

export function NoProjectDialog({
  open,
  setOpen,
  form,
  handleChange,
  handleSubmit,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isEditing = false,
  resetForm,
}: NoProjectDialogProps) {
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) resetForm();
          setOpen(isOpen);
        }}
      >
        <DialogTrigger asChild>
          <Button size="lg">Create Project</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Project" : "Create Project"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update your project details."
                  : "Create a new project to start tracking your progress."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {/* Title */}
              <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Start Date */}
              <div className="space-y-1">
                <Label>Start Date</Label>
                <DatePicker value={startDate} onChange={setStartDate} />
              </div>

              {/* End Date */}
              <div className="space-y-1">
                <Label>End Date</Label>
                <DatePicker value={endDate} onChange={setEndDate} />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit">
                {isEditing ? "Update Project" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
