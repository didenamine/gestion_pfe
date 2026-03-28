const API_BASE = import.meta.env.VITE_API_BASE;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface TaskHistoryEntry {
  _id: string;
  taskId: string;
  modifiedBy: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown>;
  modifiedAt: string;
  fieldChanged: string;
}

export async function getTaskHistory(taskId: string): Promise<TaskHistoryEntry[]> {
  const response = await fetch(`${API_BASE}/tasks/history/${taskId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch task history");
  }
  return response.json();
}