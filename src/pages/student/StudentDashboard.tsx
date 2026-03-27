// src/layouts/StudentDashboard.tsx

import { Outlet, Link, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { studentNavData } from "@/config/navigation";

const routeLabels: Record<string, string> = {
  "/student/dashboard": "Vue d'ensemble",
  "/student/project": "Mon Projet",
  "/student/sprints": "Sprints",
  "/student/stories": "User Stories",
  "/student/tasks": "Tâches — Kanban",
  "/student/tasks/history": "Historique des tâches",
  "/student/meetings": "Réunions",
  "/student/reports": "Rapports",
  "/student/validations": "Validations",
  "/student/journal": "Journal de stage",
};

export default function StudentDashboard() {
  const location = useLocation();
  const currentLabel = routeLabels[location.pathname] ?? "Page";

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") ?? "{}");
    } catch {
      return {};
    }
  })();

  // ← Remplace mockProject.title — adapte la clé selon ta structure auth
  const projectTitle: string =
    user.projectTitle ?? user.project?.title ?? null;

  return (
    <SidebarProvider>
      <AppSidebar
        data={studentNavData}
        userInfo={{
          name: user.name ?? "Étudiant",
          role: "Étudiant",
        }}
      />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to="/student/dashboard">PFE Tracker</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto">
            {projectTitle && (
              <span className="text-xs text-muted-foreground hidden sm:block max-w-[200px] truncate">
                {projectTitle}
              </span>
            )}
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 w-full">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}