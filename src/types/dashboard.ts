// ─── Dashboard API Types ─────────────────────────────────────────────────────

export interface Contributor {
  _id: string;
  fullName: string;
  email: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  contributors: Contributor[];
}

export interface UserStoryProgress {
  _id: string;
  title: string;
  totalTasks: number;
  doneTasks: number;
  progress: number;
}

export interface MeetingCreatedBy {
  id: string;
  fullName: string | null;
  email: string | null;
}

export interface Meeting {
  id: string;
  scheduledDate: string;
  agenda: string;
  referenceType: string;
  referenceId: string;
  createdBy: MeetingCreatedBy | null;
  validationStatus?: string;
  validatorId?: string;
}

export interface Sprint {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  totalTasks: number;
  doneTasks: number;
  progress: number;
  userStories: UserStoryProgress[];
}

export interface ProjectProgress {
  totalTasks: number;
  doneTasks: number;
  progress: number;
}

export interface ProgressData {
  projectProgress: ProjectProgress;
  sprints: Sprint[];
  meetings: Meeting[];
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

export interface PendingValidationTask {
  _id: string;
  title: string;
  status: string;
  userStoryId: {
    _id: string;
    title: string;
  };
  lastValidation: {
    _id: string;
    status: string;
    createdAt: string;
  } | null;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}