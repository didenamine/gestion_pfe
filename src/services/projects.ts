import { format } from "date-fns";
import type { Project } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

interface ProjectPayload {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
}

export async function createProject(data: ProjectPayload): Promise<Project> {
  const response = await fetch(`${API_BASE}/project`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({
      ...data,
      startDate: data.startDate ? format(data.startDate, "yyyy-MM-dd") : null,
      endDate: data.endDate ? format(data.endDate, "yyyy-MM-dd") : null,
    }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to create project",
    );
  }
  return result.data || null;
}

export async function getProject(): Promise<Project | null> {
  const response = await fetch(`${API_BASE}/project`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to fetch project",
    );
  }
  return result.data || null;
}

export async function updateProject(data: ProjectPayload): Promise<Project> {
  const payload = JSON.stringify({
    ...data,
    startDate: data.startDate ? format(data.startDate, "yyyy-MM-dd") : null,
    endDate: data.endDate ? format(data.endDate, "yyyy-MM-dd") : null,
  });

  const response = await fetch(`${API_BASE}/project`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    credentials: "include",
    body: payload,
  });
  const result = await response.json();
  if (!response.ok) {
    console.error("Failed to update project", result);
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to update project",
    );
  }

  return result.data || null;
}

export async function deleteProject(): Promise<void> {
  const response = await fetch(`${API_BASE}/project`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to delete project",
    );
  }
}
