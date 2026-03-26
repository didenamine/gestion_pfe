import React from "react";
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
import { DatePicker } from "@/components/date-picker";

interface SprintForm {
  title: string;
  goal: string;
}

interface SprintDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isEditing: boolean;
  form: SprintForm;
  setForm: React.Dispatch<React.SetStateAction<SprintForm>>;
  startDate: Date | null;
  setStartDate: (date: Date) => void;
  endDate: Date | null;
  setEndDate: (date: Date) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetForm: () => void;
  trigger?: React.ReactNode; // 🔥 flexible trigger
}

export const SprintDialog: React.FC<SprintDialogProps> = ({
  open,
  setOpen,
  isEditing,
  form,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleSubmit,
  handleChange,
  resetForm,
}) => {
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
              {isEditing ? "Edit Sprint" : "Create Sprint"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your sprint details."
                : "Create a new sprint for your project."}
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
              <Label htmlFor="goal">Goal</Label>
              <Input
                id="goal"
                name="goal"
                value={form.goal}
                onChange={handleChange}
              />
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
              {isEditing ? "Update Sprint" : "Create Sprint"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
