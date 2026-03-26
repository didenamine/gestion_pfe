import type { Sprint, Task, UserStory } from "@/types";
import { format } from "date-fns";

const API_BASE = import.meta.env.VITE_API_BASE;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface SprintPayload {
  title: string;
  goal: string;
  startDate: Date | null;
  endDate: Date | null;
  order?: number;
}

export async function getSprints(): Promise<Sprint[]> {
  const response = await fetch(`${API_BASE}/project/sprints`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to fetch sprints",
    );
  }
  return result.data || null;
}

export async function createSprint(data: SprintPayload): Promise<Sprint> {
  console.log("Creating sprint with data:", data);
  const response = await fetch(`${API_BASE}/project/sprints`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({
      ...data,
      startDate: data.startDate ? data.startDate.toISOString() : null,
      endDate: data.endDate ? data.endDate.toISOString() : null,
    }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to create sprint",
    );
  }
  return result.data || null;
}
export async function updateSprint(
  sprintId: string,
  data: Partial<SprintPayload>,
): Promise<Sprint> {
  const payload = JSON.stringify({
    ...data,
    startDate: data.startDate
      ? format(data.startDate, "yyyy-MM-dd")
      : undefined,
    endDate: data.endDate ? format(data.endDate, "yyyy-MM-dd") : undefined,
  });
  console.log("Updating sprint %s with payload: %s", sprintId, payload);
  const response = await fetch(`${API_BASE}/project/sprints/${sprintId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    credentials: "include",
    body: payload,
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to update sprint",
    );
  }
  return result.data || null;
}

export async function deleteSprint(sprintId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/project/sprints/${sprintId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to delete sprint",
    );
  }
}

// api/task.ts

export async function getTasksBySprint(sprintId: string): Promise<Task[]> {
  const response = await fetch(
    `${API_BASE}/project/tasks?sprintId=${sprintId}`,
    {
      headers: getAuthHeaders(),
      credentials: "include",
    },
  );
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to fetch tasks",
    );
  }
  return result.data || null;
}

// api/userStory.ts

export async function getStoriesBySprint(
  sprintId: string,
): Promise<UserStory[]> {
  const response = await fetch(
    `${API_BASE}/project/user-stories?sprintId=${sprintId}`,
    {
      headers: getAuthHeaders(),
      credentials: "include",
    },
  );
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to fetch user stories",
    );
  }
  return result.data || null;
}
