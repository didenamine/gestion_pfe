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
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  open: boolean;
  setOpen: (open: boolean) => void;
  isEditing: boolean;
  form: { title: string; description: string };
  setForm: React.Dispatch<
    React.SetStateAction<{ title: string; description: string }>
  >;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  handleEdit: () => void;
  handleDelete: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetForm: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  open,
  setOpen,
  isEditing,
  form,
  setForm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleEdit,
  handleDelete,
  handleSubmit,
  handleChange,
  resetForm,
}) => {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">{project.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {project.description}
          </p>
        </div>

        <div className="flex gap-2">
          <Dialog
            open={open}
            onOpenChange={(isOpen) => {
              if (!isOpen) resetForm();
              setOpen(isOpen);
            }}
          >
            <DialogTrigger asChild>
              {project ? (
                <Button size="sm" variant="outline" onClick={handleEdit}>
                  Edit
                </Button>
              ) : (
                <Button size="lg">Create Project</Button>
              )}
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

                  <div className="space-y-1">
                    <Label>Start Date</Label>
                    <DatePicker value={startDate} onChange={setStartDate} />
                  </div>

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

          <Button size="sm" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground">Student</p>
          <p className="font-medium">{project.studentName}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground">University Supervisor</p>
          <p className="font-medium">{project.uniSupervisorName}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground">Company Supervisor</p>
          <p className="font-medium">{project.compSupervisorName}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground">Start date</p>
          <p className="font-medium">{project.startDate}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-muted-foreground">End date</p>
          <p className="font-medium">{project.endDate}</p>
        </div>
      </div>
    </div>
  );
};
