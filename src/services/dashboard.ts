// src/services/dashboard.api.ts

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export interface ProjectProgress {
  projectProgress: {
    totalTasks: number;
    doneTasks: number;
    progress: number; // 0-100
  };
  sprints: SprintProgress[];
}

export interface SprintProgress {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  totalTasks: number;
  doneTasks: number;
  progress: number;
  userStories: UserStoryProgress[];
}

export interface UserStoryProgress {
  _id: string;
  title: string;
  totalTasks: number;
  doneTasks: number;
  progress: number;
}

export interface StandbyTask {
  _id: string;
  title: string;
  status: string;
  userStoryId: {
    _id: string;
    title: string;
    priority: string;
  };
}

export interface TimelineEvent {
  type: "meeting" | "report" | "status_change" | "validation";
  date: string;
  title: string;
  description: string;
  projectId: string | null;
  projectName: string;
  metadata: Record<string, unknown>;
}

export interface Meeting {
  _id: string;
  agenda: string;
  scheduledDate: string;
  status: string;
  projectId: string;
}

/** GET /dashboard/:projectId — progression globale */
export async function fetchProjectProgress(
  projectId: string,
): Promise<ProjectProgress> {
  const res = await fetch(`${BASE_URL}/dashboard/${projectId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Erreur lors du chargement de la progression");
  const json = await res.json();
  return json.data as ProjectProgress;
}

/** GET /dashboard/student/tasks/standby — tâches en standby */
export async function fetchStandbyTasks(): Promise<StandbyTask[]> {
  const res = await fetch(`${BASE_URL}/dashboard/student/tasks/standby`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des tâches standby");
  const json = await res.json();
  return json.data as StandbyTask[];
}

/** GET /dashboard/student/timeline?month=M&year=Y */
export async function fetchStudentTimeline(
  month: number,
  year: number,
): Promise<TimelineEvent[]> {
  const res = await fetch(
    `${BASE_URL}/dashboard/student/timeline?month=${month}&year=${year}`,
    { headers: getAuthHeaders() },
  );
  if (!res.ok) throw new Error("Erreur lors du chargement du timeline");
  const json = await res.json();
  return json.data as TimelineEvent[];
}

/** GET /dashboard/supervisor/meetings/:projectId — 5 dernières réunions */
export async function fetchLatestMeetings(
  projectId: string,
): Promise<Meeting[]> {
  const res = await fetch(
    `${BASE_URL}/dashboard/supervisor/meetings/${projectId}`,
    { headers: getAuthHeaders() },
  );
  if (!res.ok) throw new Error("Erreur lors du chargement des réunions");
  const json = await res.json();
  return json.data as Meeting[];
}



// supervisors
