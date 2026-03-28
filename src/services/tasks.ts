import type { Task } from "@/types";

const API_BASE = import.meta.env.VITE_API_BASE;
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface TaskPayload {
  userStoryId: string;
  title: string;
  status: Task["status"];
}

export async function getTasksbyUserStory(
  userStoryId: string,
): Promise<Task[]> {
  const response = await fetch(`${API_BASE}/tasks/userstory/${userStoryId}`, {
    headers: getAuthHeaders(),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to create sprint",
    );
  }
  return result.data.tasks || null;
}
export async function getAllTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE}/tasks/project`, {
    headers: getAuthHeaders(),
  });
  const result = await response.json();
  console.log("Fetched all tasks:", result);
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to create sprint",
    );
  }
  return result.data.tasks || null;
}
export async function createTask(data: TaskPayload): Promise<Task> {
  console.log("Creating task with data:", data);
  const response = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to create task",
    );
  }
  return result.data || null;
}
export async function updateTask(
  taskId: string,
  data: Partial<TaskPayload>,
): Promise<Task> {
  const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  console.log("Update task response:", response);
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to update task",
    );
  } else {
    console.log("Updated task:", result);
  }
  return result.data || null;
}

export async function deleteTask(taskId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to delete task",
    );
  } else {
    console.log("Deleted task:", result);
  }
}

export async function updateTaskStatus(
  taskId: string,
  status: Task["status"]
): Promise<Task> {
  const response = await fetch(`${API_BASE}/tasks/status/${taskId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      status,
      validatorId: "000000000000000000000000",
      meetingType: "reunion",
      comment: "",
    }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to update task status");
  }
  return result.taskValidator || null;
}