import type { Project } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function getSupervisorProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE}/dashboard/projects`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message + ": " + result.details?.join(", ") ||
        "Failed to fetch supervised projects",
    );
  }
  return result.data || [];
}