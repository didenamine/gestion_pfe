import type {
  ApiResponse,
  Project,
  ProgressData,
  TimelineEvent,
  StandbyTask,
  PendingValidationTask,
  Meeting,
} from "../types/dashboard.ts";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: authHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── Supervisor – shared ──────────────────────────────────────────────────────

/** GET /dashboard/projects  (supervisor only) */
export const getAllProjects = () =>
  apiFetch<ApiResponse<Project[]>>("/dashboard/projects");

/** GET /dashboard/:projectId */
export const getProgress = (projectId: string) =>
  apiFetch<ApiResponse<ProgressData>>(`/dashboard/${projectId}`);

/** GET /dashboard/supervisor/timeline?month=&year= */
export const getSupervisorTimeline = (month: number, year: number) =>
  apiFetch<ApiResponse<TimelineEvent[]>>(
    `/dashboard/supervisor/timeline?month=${month}&year=${year}`
  );

/** GET /dashboard/supervisor/validations/:projectId */
export const getSupervisorPendingValidations = (projectId: string) =>
  apiFetch<ApiResponse<PendingValidationTask[]>>(
    `/dashboard/supervisor/validations/${projectId}`
  );

/** GET /dashboard/supervisor/meetings/:projectId */
export const getSupervisorLatestMeetings = (projectId: string) =>
  apiFetch<ApiResponse<Meeting[]>>(
    `/dashboard/supervisor/meetings/${projectId}`
  );

// ─── Student ──────────────────────────────────────────────────────────────────

/** GET /dashboard/student/timeline?month=&year= */
export const getStudentTimeline = (month: number, year: number) =>
  apiFetch<ApiResponse<TimelineEvent[]>>(
    `/dashboard/student/timeline?month=${month}&year=${year}`
  );

/** GET /dashboard/student/tasks/standby */
export const getStudentStandbyTasks = () =>
  apiFetch<ApiResponse<StandbyTask[]>>("/dashboard/student/tasks/standby");