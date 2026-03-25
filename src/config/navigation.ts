import {
  LayoutDashboard,
  FolderKanban,
  Zap,
  BookOpen,
  CheckSquare,
  CalendarDays,
  FileText,
  Shield,
  Activity,
} from "lucide-react";

export const studentNavData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/student/dashboard",
      icon: LayoutDashboard,
      items: [],
    },
    {
      title: "Mon Projet",
      url: "/student/project",
      icon: FolderKanban,
      items: [
        { title: "Vue d'ensemble", url: "/student/project" },
        { title: "Sprints", url: "/student/sprints" },
        { title: "User Stories", url: "/student/stories" },
      ],
    },
    {
      title: "Tâches",
      url: "/student/tasks",
      icon: CheckSquare,
      items: [
        { title: "Kanban", url: "/student/tasks" },
        { title: "Historique", url: "/student/tasks/history" },
      ],
    },
    {
      title: "Réunions",
      url: "/student/meetings",
      icon: CalendarDays,
      items: [],
    },
    {
      title: "Rapports",
      url: "/student/reports",
      icon: FileText,
      items: [],
    },
    {
      title: "Validations",
      url: "/student/validations",
      icon: Shield,
      items: [],
    },
    {
      title: "Journal",
      url: "/student/journal",
      icon: Activity,
      items: [],
    },
  ],
};

export const uniSupervisorNavData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/uni/dashboard",
      icon: LayoutDashboard,
      items: [],
    },
    {
      title: "Projets",
      url: "/uni/projects",
      icon: FolderKanban,
      items: [],
    },

    {
      title: "Tâches à valider",
      url: "/uni/validations",
      icon: Shield,
      items: [],
    },
    {
      title: "Réunions",
      url: "/uni/meetings",
      icon: CalendarDays,
      items: [],
    },
    {
      title: "Rapports",
      url: "/uni/reports",
      icon: FileText,
      items: [],
    },
  ],
};

export const compSupervisorNavData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/com/dashboard",
      icon: LayoutDashboard,
      items: [],
    },
    {
      title: "Projets",
      url: "/com/projects",
      icon: FolderKanban,
      items: [],
    },
    {
      title: "Tâches à valider",
      url: "/com/validations",
      icon: Shield,
      items: [],
    },
    {
      title: "Rapports",
      url: "/com/reports",
      icon: FileText,
      items: [],
    },
  ],
};
