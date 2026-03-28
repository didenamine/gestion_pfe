import { useEffect, useState } from "react";
import type { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TaskItem } from "./task-item";
import { useToast } from "@/context/toast-context";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
  updateTaskStatus,
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

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

export default function StudentTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isStudent, setIsStudent] = useState(false);

  const [form, setForm] = useState<TaskForm>({
    title: "",
    status: "todo",
    priority: "medium",
    userStoryId: "",
  });
  const { showToast } = useToast();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    setIsStudent(user?.role?.toLowerCase() === "student");

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
        if (isStudent) {
          // Student : only status update via dedicated route
          await updateTaskStatus(currentTask.id, form.status);
        } else {
          await updateTask(currentTask.id, { ...form });
        }
      } else {
        await createTask({ ...form });
      }

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

  const handleDelete = (taskId: string) => {
    setTaskToDelete(taskId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete));
      resetForm();
    } catch (err) {
      showToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to delete task",
      });
    } finally {
      setConfirmOpen(false);
      setTaskToDelete(null);
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
        disabledFields={isStudent ? ["title", "priority", "userStoryId"] : []}
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

      <ConfirmDialog
        open={confirmOpen}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setTaskToDelete(null);
        }}
      />
    </div>
  );
}
