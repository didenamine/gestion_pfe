import {
  createProject,
  deleteProject,
  getProject,
  updateProject,
} from "@/services/projects";
import React, { useEffect, useState } from "react";
import type { Project } from "@/types";
import { ProjectCard } from "./project-item";
import { NoProjectDialog } from "./no-project-dialog";
import { useToast } from "@/context/toast-context";

// interface FormState {
//   title: string;
//   description: string;
// }

export default function StudentProjects() {
  const [project, setProject] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const fetchedProject = await getProject();
        if (fetchedProject) setProject(fetchedProject);
        console.log("Fetched project on mount:", fetchedProject);
      } catch (err) {
        console.error(err);
        showToast({
          type: "error",
          message:
            err instanceof Error ? err.message : "Failed to load project",
        });
      }
    })();
  }, []);

  const resetForm = () => {
    setForm({ title: "", description: "" });
    setStartDate(null);
    setEndDate(null);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && project) {
        await updateProject({
          ...form,
          startDate: startDate,
          endDate: endDate,
        });
      } else {
        await createProject({
          ...form,
          startDate: startDate,
          endDate: endDate,
        });
      }
      const refreshedProject = await getProject();
      setProject(refreshedProject);
      setOpen(false);
      resetForm();
    } catch (err) {
      showToast({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  const handleEdit = () => {
    if (!project) return;
    setForm({ title: project.title, description: project.description });
    setStartDate(project.startDate ? new Date(project.startDate) : null);
    setEndDate(project.endDate ? new Date(project.endDate) : null);
    setIsEditing(true);
    setOpen(true);
  };
  const handleDelete = async () => {
    if (!project) return;
    try {
      await deleteProject();
      setProject(null);
      resetForm();
    } catch (err) {
      showToast({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  return (
    <div className="h-full flex items-center justify-center ">
      {project ? (
        <ProjectCard
          project={project}
          open={open}
          setOpen={setOpen}
          isEditing={isEditing}
          form={form}
          setForm={setForm}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          resetForm={resetForm}
        />
      ) : (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">You have no active project</h2>
          <p className="text-muted-foreground">
            Create a new project to get started.
          </p>

          <NoProjectDialog
            open={open}
            setOpen={setOpen}
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            resetForm={resetForm}
          />
        </div>
      )}
    </div>
  );
}
