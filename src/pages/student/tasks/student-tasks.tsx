import { useEffect, useState } from "react";
import type { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { TaskItem } from "./task-item";
import { useToast } from "@/context/toast-context";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "@/services/tasks";
import { TaskDialog } from "./task-dialog";

interface TaskForm {
  title: string;
  status: Task["status"];
  priority: Task["priority"];
  createdAt?: string;
  updatedAt?: string;
  userStoryId: string;
}

export default function StudentTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const [form, setForm] = useState<TaskForm>({
    title: "",
    status: "todo",
    priority: "medium",
    userStoryId: "",
  });
  const { showToast } = useToast();

  // Fetch user stories
  useEffect(() => {
    (async () => {
      const data = await getAllTasks();
      setTasks(data);
    })();
  }, []);

  const resetForm = () => {
    setForm({ title: "", status: "todo", priority: "medium", userStoryId: "" });
    setCurrentTask(null);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentTask) {
        await updateTask(currentTask.id, {
          ...form,
        });
      } else {
        await createTask({
          ...form,
        });
      }

      // Refresh list
      const data = await getAllTasks();
      setTasks(data);
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to save task",
      });
    }
  };

  const handleEdit = (task: Task) => {
    setCurrentTask(task);
    setForm({
      title: task.title,
      status: task.status,
      priority: task.priority,
      userStoryId: task.userStoryId,
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      resetForm();
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to delete task",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <Button
          size="sm"
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
        >
          New Task
        </Button>
      </div>

      <TaskDialog
        open={open}
        setOpen={setOpen}
        isEditing={isEditing}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        resetForm={resetForm}
      />
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            handleEdit={() => handleEdit(task)}
            handleDelete={() => handleDelete(task.id)}
          />
        ))}
      </div>
    </div>
  );
}
