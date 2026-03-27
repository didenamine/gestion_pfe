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

export interface userStoryPayload {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  priority: UserStory["priority"];
}

export async function getUserStories(): Promise<UserStory[]> {
  const response = await fetch(`${API_BASE}/user-story`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to fetch user stories",
    );
  }
  console.log("Fetched user stories:", result);
  return result.data || null;
}

export async function createUserStory(
  data: userStoryPayload,
): Promise<UserStory> {
  console.log("Creating user story with data:", data);
  const response = await fetch(`${API_BASE}/user-story`, {
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
        "Failed to create user story",
    );
  }
  return result.data || null;
}
export async function updateUserStory(
  userStoryId: string,
  data: Partial<userStoryPayload>,
): Promise<UserStory> {
  const payload = JSON.stringify({
    ...data,
    startDate: data.startDate
      ? format(data.startDate, "yyyy-MM-dd")
      : undefined,
    endDate: data.endDate ? format(data.endDate, "yyyy-MM-dd") : undefined,
  });
  console.log("Updating user story %s with payload: %s", userStoryId, payload);
  const response = await fetch(`${API_BASE}/user-story/${userStoryId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: payload,
  });
  const result = await response.json();
  console.log("Update user story response:", result);
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to update user story",
    );
  }
  return result.data || null;
}

export async function deleteUserStory(userStoryId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/user-story/${userStoryId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to delete user story",
    );
  }
}

export async function getStoriesBySprint(
  sprintId: string,
): Promise<UserStory[]> {
  const response = await fetch(`${API_BASE}/user-story/sprint/${sprintId}`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const result = await response.json();
  console.log("Fetched user stories for sprint %s: %o", sprintId, result);
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to fetch user stories",
    );
  }
  return result.data.userStories || null;
}

// api/task.ts

// export async function getTasksBySprint(sprintId: string): Promise<Task[]> {
//   const response = await fetch(
//     `${API_BASE}/project/tasks?sprintId=${sprintId}`,
//     {
//       headers: getAuthHeaders(),
//       credentials: "include",
//     },
//   );
//   const result = await response.json();
//   if (!response.ok) {
//     throw new Error(
//       result.message + ": " + result.details?.join(", ") ||
//         "Failed to fetch tasks",
//     );
//   }
//   return result.data || null;
// }

// api/userStory.ts

// export async function getStoriesBySprint(
//   sprintId: string,
// ): Promise<UserStory[]> {
//   const response = await fetch(
//     `${API_BASE}/project/user-stories?sprintId=${sprintId}`,
//     {
//       headers: getAuthHeaders(),
//       credentials: "include",
//     },
//   );
//   const result = await response.json();
//   if (!response.ok) {
//     throw new Error(
//       result.message + ": " + result.details?.join(", ") ||
//         "Failed to fetch user stories",
//     );
//   }
//   return result.data || null;
// }
