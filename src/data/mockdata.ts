import type {
  Project,
  Sprint,
  UserStory,
  Task,
  TaskStatusHistory,
  Validation,
  Meeting,
  ReportVersion,
  JournalEvent,
  DashboardStats,
} from "@/types";

// ─── Project ──────────────────────────────────────────────────────────────────
export const mockProject: Project = {
  id: "proj-1",
  title: "Système de gestion de flotte véhicules",
  description:
    "Application web de suivi et gestion de parc automobile pour entreprises de transport.",
  studentId: "stu-1",
  studentName: "Mohamed Amine Yeferni",
  uniSupervisorId: "uni-1",
  uniSupervisorName: "Dr. Fourat Khelifi",
  compSupervisorId: "comp-1",
  compSupervisorName: "Nada Bouhadida",
  createdAt: "2025-10-01T09:00:00Z",
  status: "active",
};

// ─── Sprints ──────────────────────────────────────────────────────────────────
export const mockSprints: Sprint[] = [
  {
    id: "sprint-1",
    projectId: "proj-1",
    title: "Sprint 1 – Authentification & Architecture",
    goal: "Mettre en place l'architecture backend et l'authentification JWT.",
    startDate: "2025-10-07",
    endDate: "2025-10-21",
    status: "completed",
    order: 1,
  },
  {
    id: "sprint-2",
    projectId: "proj-1",
    title: "Sprint 2 – Gestion des véhicules",
    goal: "CRUD véhicules, conducteurs et affectations.",
    startDate: "2025-10-21",
    endDate: "2025-11-04",
    status: "active",
    order: 2,
  },
  {
    id: "sprint-3",
    projectId: "proj-1",
    title: "Sprint 3 – Tableau de bord & Reporting",
    goal: "Statistiques, graphiques et exports PDF.",
    startDate: "2025-11-04",
    endDate: "2025-11-18",
    status: "planned",
    order: 3,
  },
];

// ─── User Stories ─────────────────────────────────────────────────────────────
export const mockUserStories: UserStory[] = [
  // Sprint 1
  {
    id: "us-1",
    sprintId: "sprint-1",
    projectId: "proj-1",
    title: "En tant qu'admin, je veux me connecter de manière sécurisée",
    description: "Authentification JWT avec refresh token",
    priority: "critical",
    estimatedPoints: 8,
    order: 1,
  },
  {
    id: "us-2",
    sprintId: "sprint-1",
    projectId: "proj-1",

    title: "Mise en place de l'architecture NestJS",
    description: "Modules, DTOs, guards et intercepteurs",
    priority: "high",
    estimatedPoints: 13,
    order: 2,
  },
  // Sprint 2
  {
    id: "us-3",
    sprintId: "sprint-2",
    projectId: "proj-1",
    title: "CRUD des véhicules",
    description: "Créer, lire, mettre à jour et supprimer des véhicules",
    priority: "high",
    estimatedPoints: 8,
    order: 1,
  },
  {
    id: "us-4",
    sprintId: "sprint-2",
    projectId: "proj-1",
    title: "Gestion des conducteurs",
    description: "Profils conducteurs avec permis et historique",
    priority: "medium",
    estimatedPoints: 5,
    order: 2,
  },
  // Sprint 3
  {
    id: "us-5",
    sprintId: "sprint-3",
    projectId: "proj-1",
    title: "Dashboard statistiques",
    description: "Graphiques kilométrage, pannes, coûts",
    priority: "medium",
    estimatedPoints: 8,
    order: 1,
  },
];

// ─── Tasks ────────────────────────────────────────────────────────────────────
export const mockTasks: Task[] = [
  // Sprint 1 / US 1
  {
    id: "task-1",
    userStoryId: "us-1",
    sprintId: "sprint-1",
    projectId: "proj-1",
    title: "Configurer Passport.js + JWT strategy",
    description: "Intégration de Passport avec stratégie JWT",
    status: "Done",
    estimatedHours: 4,
    actualHours: 3.5,
    assignee: "Mohamed Amine Yeferni",
    createdAt: "2025-10-07T09:00:00Z",
    updatedAt: "2025-10-10T14:00:00Z",
  },
  {
    id: "task-2",
    userStoryId: "us-1",
    sprintId: "sprint-1",
    projectId: "proj-1",
    title: "Endpoint login / refresh / logout",
    description: "3 endpoints REST pour la gestion des sessions",
    status: "Done",
    estimatedHours: 3,
    actualHours: 3,
    assignee: "Mohamed Amine Yeferni",
    createdAt: "2025-10-07T09:00:00Z",
    updatedAt: "2025-10-12T11:00:00Z",
  },
  // Sprint 1 / US 2
  {
    id: "task-3",
    userStoryId: "us-2",
    sprintId: "sprint-1",
    projectId: "proj-1",
    title: "Initialiser le projet NestJS",
    description: "Scaffold, modules de base, configuration",
    status: "Done",

    estimatedHours: 2,
    actualHours: 2,
    assignee: "Mohamed Amine Yeferni",
    createdAt: "2025-10-07T09:00:00Z",
    updatedAt: "2025-10-08T16:00:00Z",
  },
  {
    id: "task-4",
    userStoryId: "us-2",
    sprintId: "sprint-1",
    projectId: "proj-1",
    title: "Configurer TypeORM + PostgreSQL",
    description: "Connexion DB, migrations, entities de base",
    status: "Done",
    estimatedHours: 3,
    actualHours: 4,
    assignee: "Mohamed Amine Yeferni",
    createdAt: "2025-10-07T09:00:00Z",
    updatedAt: "2025-10-09T10:00:00Z",
  },
  // Sprint 2 / US 3
  {
    id: "task-5",
    userStoryId: "us-3",
    sprintId: "sprint-2",
    projectId: "proj-1",
    title: "Entity Vehicle + DTO",
    description: "Modèle de données véhicule",
    status: "Done",
    estimatedHours: 2,
    actualHours: 2,
    assignee: "Mohamed Amine Yeferni",
    createdAt: "2025-10-21T09:00:00Z",
    updatedAt: "2025-10-22T14:00:00Z",
  },
  {
    id: "task-6",
    userStoryId: "us-3",
    sprintId: "sprint-2",
    projectId: "proj-1",
    title: "API REST CRUD véhicules",
    description: "5 endpoints + validation",
    status: "InProgress",
    estimatedHours: 4,
    assignee: "Mohamed Amine Yeferni",
    createdAt: "2025-10-22T09:00:00Z",
    updatedAt: "2025-10-28T09:00:00Z",
  },
  {
    id: "task-7",
    userStoryId: "us-3",
    sprintId: "sprint-2",
    projectId: "proj-1",
    title: "Tests unitaires VehicleService",
    description: "Jest tests pour les 5 méthodes CRUD",
    status: "ToDo",
    estimatedHours: 3,
    assignee: "Mohamed Amine Yeferni",
    createdAt: "2025-10-22T09:00:00Z",
    updatedAt: "2025-10-22T09:00:00Z",
  },
  // Sprint 2 / US 4
  {
    id: "task-8",
    userStoryId: "us-4",
    sprintId: "sprint-2",
    projectId: "proj-1",
    title: "Entity Driver + relations",
    description: "Relation many-to-many avec véhicules",
    status: "Standby",
    estimatedHours: 3,
    assignee: "Mohamed Amine Yeferni",
    createdAt: "2025-10-21T09:00:00Z",
    updatedAt: "2025-10-25T09:00:00Z",
  },
  // Sprint 3 / US 5
  {
    id: "task-9",
    userStoryId: "us-5",
    sprintId: "sprint-3",

    projectId: "proj-1",
    title: "Endpoints statistiques agrégées",
    description: "Queries optimisées pour les KPIs",
    status: "ToDo",
    estimatedHours: 5,
    assignee: "Mohamed Amine Yeferni",
    createdAt: "2025-11-04T09:00:00Z",
    updatedAt: "2025-11-04T09:00:00Z",
  },
];

// ─── Task History ─────────────────────────────────────────────────────────────
export const mockTaskHistory: TaskStatusHistory[] = [
  {
    id: "hist-1",
    taskId: "task-1",
    fromStatus: null,
    toStatus: "ToDo",
    changedBy: "Mohamed Amine Yeferni",
    changedAt: "2025-10-07T09:00:00Z",
  },
  {
    id: "hist-2",
    taskId: "task-1",
    fromStatus: "ToDo",
    toStatus: "InProgress",
    changedBy: "Mohamed Amine Yeferni",
    changedAt: "2025-10-08T08:30:00Z",
  },
  {
    id: "hist-3",
    taskId: "task-1",
    fromStatus: "InProgress",
    toStatus: "Done",
    changedBy: "Mohamed Amine Yeferni",
    changedAt: "2025-10-10T14:00:00Z",
    comment: "Implémentation terminée, tests passent",
  },
  {
    id: "hist-4",
    taskId: "task-8",
    fromStatus: null,
    toStatus: "ToDo",
    changedBy: "Mohamed Amine Yeferni",
    changedAt: "2025-10-21T09:00:00Z",
  },
  {
    id: "hist-5",
    taskId: "task-8",
    fromStatus: "ToDo",
    toStatus: "InProgress",
    changedBy: "Mohamed Amine Yeferni",
    changedAt: "2025-10-23T09:00:00Z",
  },
  {
    id: "hist-6",
    taskId: "task-8",
    fromStatus: "InProgress",
    toStatus: "Standby",
    changedBy: "Mohamed Amine Yeferni",
    changedAt: "2025-10-25T09:00:00Z",
    comment: "Bloqué en attente de la spec relation Many-to-Many",
  },
];

// ─── Validations ──────────────────────────────────────────────────────────────
export const mockValidations: Validation[] = [
  {
    id: "val-1",
    taskId: "task-1",
    taskTitle: "Configurer Passport.js + JWT strategy",
    validatorId: "comp-1",
    validatorName: "Nada Bouhadida",
    validatorRole: "CompSupervisor",
    status: "approved",
    comment: "Bonne implémentation, code propre.",
    meetingId: "meet-1",
    meetingTitle: "Réunion bilan Sprint 1",
    createdAt: "2025-10-21T10:00:00Z",
  },

  {
    id: "val-2",
    taskId: "task-2",
    taskTitle: "Endpoint login / refresh / logout",
    validatorId: "uni-1",
    validatorName: "Dr. Fourat Khelifi",
    validatorRole: "UniSupervisor",
    status: "approved",
    comment: "Conforme aux bonnes pratiques REST.",
    meetingId: "meet-1",
    meetingTitle: "Réunion bilan Sprint 1",
    createdAt: "2025-10-21T10:30:00Z",
  },
  {
    id: "val-3",
    taskId: "task-5",
    taskTitle: "Entity Vehicle + DTO",
    validatorId: "comp-1",
    validatorName: "Nada Bouhadida",
    validatorRole: "CompSupervisor",
    status: "pending",
    createdAt: "2025-10-23T09:00:00Z",
  },
  {
    id: "val-4",
    taskId: "task-3",
    taskTitle: "Initialiser le projet NestJS",
    validatorId: "uni-1",
    validatorName: "Dr. Fourat Khelifi",
    validatorRole: "UniSupervisor",
    status: "rejected",
    comment: "La structure des modules doit être revue. Séparer User et Auth.",
    createdAt: "2025-10-15T11:00:00Z",
  },
];

// ─── Meetings ─────────────────────────────────────────────────────────────────
export const mockMeetings: Meeting[] = [
  {
    id: "meet-1",
    projectId: "proj-1",
    title: "Réunion bilan Sprint 1",
    scheduledDate: "2025-10-21T10:00:00Z",
    agenda:
      "1. Démo authentification\n2. Revue architecture NestJS\n3. Planification Sprint 2",
    status: "completed",
    minutesContent:
      "Démo réalisée avec succès. Les 4 tâches du Sprint 1 sont validées. Le sprint 2 démarre avec focus sur le module véhicules.",
    isValidatedByUni: true,
    linkedUserStoryId: "us-1",
    createdAt: "2025-10-18T09:00:00Z",
  },
  {
    id: "meet-2",
    projectId: "proj-1",
    title: "Point hebdomadaire Sprint 2 - S1",
    scheduledDate: "2025-10-28T14:00:00Z",
    agenda: "1. Avancement tâches Sprint 2\n2. Blocages\n3. Revue code",
    status: "completed",
    minutesContent:
      "task-6 en cours, blocage sur task-8 (relation many-to-many). Décision: task-8 passée en Standby.",
    isValidatedByUni: false,
    linkedTaskId: "task-8",
    createdAt: "2025-10-25T09:00:00Z",
  },
  {
    id: "meet-3",
    projectId: "proj-1",
    title: "Point hebdomadaire Sprint 2 - S2",
    scheduledDate: "2025-11-04T14:00:00Z",
    agenda: "1. Fin Sprint 2\n2. Revue rapport v0.2\n3. Planification Sprint 3",
    status: "planned",
    createdAt: "2025-11-01T09:00:00Z",
  },
];

// ─── Reports ──────────────────────────────────────────────────────────────────
export const mockReportVersions: ReportVersion[] = [
  {
    id: "rep-1",

    projectId: "proj-1",
    version: "v0.1",
    uploadedAt: "2025-10-20T16:00:00Z",
    notes: "Première version — Introduction et contexte du projet",
    fileName: "rapport_pfe_v0.1.pdf",
    fileSize: "1.2 MB",
    uploadedBy: "Mohamed Amine Yeferni",
  },
  {
    id: "rep-2",
    projectId: "proj-1",
    version: "v0.2",
    uploadedAt: "2025-10-31T17:30:00Z",
    notes: "Ajout chapitre 2 — État de l'art et analyse de l'existant",
    fileName: "rapport_pfe_v0.2.pdf",
    fileSize: "2.8 MB",
    uploadedBy: "Mohamed Amine Yeferni",
  },
];

// ─── Journal Events ───────────────────────────────────────────────────────────
export const mockJournalEvents: JournalEvent[] = [
  {
    id: "ev-1",
    type: "sprint_started",
    projectId: "proj-1",
    title: "Sprint 2 démarré",
    description: "Sprint 2 – Gestion des véhicules lancé",
    actor: "Mohamed Amine Yeferni",
    createdAt: "2025-10-21T09:00:00Z",
  },
  {
    id: "ev-2",
    type: "validation",
    projectId: "proj-1",
    title: "Tâche validée",
    description: "task-1 approuvée par Nada Bouhadida (Encadrant entreprise)",
    actor: "Nada Bouhadida",
    createdAt: "2025-10-21T10:00:00Z",
  },
  {
    id: "ev-3",
    type: "meeting_completed",
    projectId: "proj-1",
    title: "Réunion complétée",
    description: "Compte rendu de 'Réunion bilan Sprint 1' ajouté",
    actor: "Mohamed Amine Yeferni",
    createdAt: "2025-10-21T12:00:00Z",
  },
  {
    id: "ev-4",
    type: "task_status_change",
    projectId: "proj-1",
    title: "Statut tâche modifié",
    description: "task-8 (Entity Driver) → Standby (bloquée)",
    actor: "Mohamed Amine Yeferni",
    createdAt: "2025-10-25T09:00:00Z",
  },
  {
    id: "ev-5",
    type: "report_uploaded",
    projectId: "proj-1",
    title: "Rapport déposé",
    description: "rapport_pfe_v0.2.pdf (v0.2) uploadé",
    actor: "Mohamed Amine Yeferni",
    createdAt: "2025-10-31T17:30:00Z",
  },
  {
    id: "ev-6",
    type: "meeting_planned",
    projectId: "proj-1",
    title: "Réunion planifiée",
    description: "Point hebdomadaire Sprint 2 - S2 prévu le 04/11",
    actor: "Mohamed Amine Yeferni",
    createdAt: "2025-11-01T09:00:00Z",
  },
];

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const mockDashboardStats: DashboardStats = {
  totalTasks: mockTasks.length,
  tasksDone: mockTasks.filter((t) => t.status === "Done").length,
  tasksInProgress: mockTasks.filter((t) => t.status === "InProgress").length,
  tasksStandby: mockTasks.filter((t) => t.status === "Standby").length,
  tasksTodo: mockTasks.filter((t) => t.status === "ToDo").length,
  progressPercent: Math.round(
    (mockTasks.filter((t) => t.status === "Done").length / mockTasks.length) *
      100,
  ),
  sprintProgress: mockSprints.map((sprint) => {
    const sprintTasks = mockTasks.filter((t) => t.sprintId === sprint.id);
    const done = sprintTasks.filter((t) => t.status === "Done").length;
    return {
      sprintId: sprint.id,
      sprintTitle: sprint.title,
      totalTasks: sprintTasks.length,
      doneTasks: done,
      percent:
        sprintTasks.length > 0
          ? Math.round((done / sprintTasks.length) * 100)
          : 0,
    };
  }),
  pendingValidations: mockValidations.filter((v) => v.status === "pending")
    .length,
  lastMeetings: mockMeetings.slice(0, 3),
  lastReportVersion: mockReportVersions[mockReportVersions.length - 1],
};
