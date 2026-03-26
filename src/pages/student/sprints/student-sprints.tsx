import { useEffect, useState } from "react";
import type { Sprint } from "@/types";
import { Button } from "@/components/ui/button";
import {
  createSprint,
  deleteSprint,
  getSprints,
  updateSprint,
} from "@/services/sprints";

import { SprintDialog } from "./sprint-dialog";
import { SprintItem } from "./sprint-item";
import { useToast } from "@/context/toast-context";

interface SprintForm {
  title: string;
  goal: string;
}

export default function StudentSprints() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);

  const [form, setForm] = useState<SprintForm>({ title: "", goal: "" });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { showToast } = useToast();

  // Fetch sprints
  useEffect(() => {
    (async () => {
      const data = await getSprints();
      setSprints(data);
    })();
  }, []);

  const resetForm = () => {
    setForm({ title: "", goal: "" });
    setStartDate(null);
    setEndDate(null);
    setCurrentSprint(null);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentSprint) {
        await updateSprint(currentSprint.id, {
          ...form,
          startDate,
          endDate,
        });
      } else {
        await createSprint({
          ...form,
          startDate,
          endDate,
        });
      }

      // Refresh list
      const data = await getSprints();
      setSprints(data);
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to load sprints",
      });
    }
  };

  const handleEdit = (sprint: Sprint) => {
    setCurrentSprint(sprint);
    setForm({ title: sprint.title, goal: sprint.goal });
    setStartDate(new Date(sprint.startDate));
    setEndDate(new Date(sprint.endDate));
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = async (sprintId: string) => {
    try {
      await deleteSprint(sprintId);
      setSprints((prev) => prev.filter((s) => s.id !== sprintId));
      resetForm();
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to delete sprint",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Sprints</h2>
        <Button
          size="sm"
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
        >
          Nouveau sprint
        </Button>
      </div>

      <SprintDialog
        open={open}
        setOpen={setOpen}
        isEditing={isEditing}
        form={form}
        setForm={setForm}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        resetForm={resetForm}
      />
      <div className="space-y-3">
        {sprints.map((sprint) => (
          <SprintItem
            key={sprint.id}
            sprint={sprint}
            handleEdit={() => handleEdit(sprint)}
            handleDelete={() => handleDelete(sprint.id)}
          />
        ))}
      </div>
    </div>
  );
}
