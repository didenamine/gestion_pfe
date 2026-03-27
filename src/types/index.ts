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
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

// ─── Sprint ───────────────────────────────────────────────────────────────────

export interface Sprint {
  id: string;
  projectId: string;
  title: string;
  goal: string;
  startDate: string;
  endDate: string;
  order: number;
}

// ─── User Story ───────────────────────────────────────────────────────────────
export interface UserStory {
  id: string;
  sprintId: string;
  title: string;
  description: string;
  priority: "highest" | "high" | "medium" | "low" | "lowest";
  startDate: string;
  endDate: string;
}

// ─── Task ─────────────────────────────────────────────────────────────────────
export type TaskStatus = "todo" | "inprogress" | "standby" | "done";

export interface Task {
  id: string;
  userStoryId: string;
  title: string;
  status: TaskStatus;
  priority: "high" | "medium" | "low";
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
  scheduledDate: string;
  agenda: string;
  actualMinutes?: string;
  referenceType: "user_story" | "task" | "report";
  referenceId: string;
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
