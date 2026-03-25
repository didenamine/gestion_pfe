export type UserRole = "Student" | "UniSupervisor" | "CompSupervisor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// ─── Project ─────────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  description: string;
  studentId: string;
  studentName: string;
  uniSupervisorId: string;
  uniSupervisorName: string;
  compSupervisorId: string;
  compSupervisorName: string;
  createdAt: string;
  status: "active" | "completed" | "archived";
}

// ─── Sprint ───────────────────────────────────────────────────────────────────
export interface Sprint {
  id: string;
  projectId: string;
  title: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: "planned" | "active" | "completed";
  order: number;
}

// ─── User Story ───────────────────────────────────────────────────────────────
export interface UserStory {
  id: string;
  sprintId: string;
  projectId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  estimatedPoints: number;
  order: number;
}

// ─── Task ─────────────────────────────────────────────────────────────────────
export type TaskStatus = "ToDo" | "InProgress" | "Standby" | "Done";

export interface Task {
  id: string;
  userStoryId: string;
  sprintId: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  estimatedHours: number;
  actualHours?: number;
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStatusHistory {
  id: string;
  taskId: string;
  fromStatus: TaskStatus | null;
  toStatus: TaskStatus;
  changedBy: string;
  changedAt: string;
  comment?: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────
export type ValidationStatus = "approved" | "rejected" | "pending";

export interface Validation {
  id: string;
  taskId: string;
  taskTitle: string;
  validatorId: string;
  validatorName: string;
  validatorRole: "UniSupervisor" | "CompSupervisor";
  status: ValidationStatus;
  comment?: string;
  meetingId?: string;
  meetingTitle?: string;
  createdAt: string;
}

// ─── Meeting ──────────────────────────────────────────────────────────────────
export type MeetingStatus = "planned" | "completed" | "cancelled";

export interface Meeting {
  id: string;
  projectId: string;
  title: string;
  scheduledDate: string;
  agenda: string;
  status: MeetingStatus;
  minutesContent?: string;
  isValidatedByUni?: boolean;
  linkedUserStoryId?: string;
  linkedTaskId?: string;
  linkedReportVersionId?: string;
  createdAt: string;
}

// ─── Report ───────────────────────────────────────────────────────────────────
export interface ReportVersion {
  id: string;
  projectId: string;
  version: string;
  uploadedAt: string;
  notes: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
}

// ─── Dashboard / Journal ──────────────────────────────────────────────────────
export type JournalEventType =
  | "task_status_change"
  | "validation"
  | "meeting_planned"
  | "meeting_completed"
  | "report_uploaded"
  | "sprint_started"
  | "sprint_completed";

export interface JournalEvent {
  id: string;
  type: JournalEventType;
  projectId: string;
  title: string;
  description: string;
  actor: string;
  createdAt: string;
}

export interface DashboardStats {
  totalTasks: number;
  tasksDone: number;
  tasksInProgress: number;
  tasksStandby: number;
  tasksTodo: number;
  progressPercent: number;
  sprintProgress: SprintProgress[];
  pendingValidations: number;
  lastMeetings: Meeting[];
  lastReportVersion?: ReportVersion;
}

export interface SprintProgress {
  sprintId: string;

  sprintTitle: string;
  totalTasks: number;
  doneTasks: number;
  percent: number;
}
