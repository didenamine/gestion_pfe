import React, { useEffect, useState } from "react";
import { SupervisorProjectCard } from "./supervisor-project-item";
import { useToast } from "@/context/toast-context";
import { getSupervisorProjects } from "@/services/supervisor";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const navData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/company/dashboard",
    },
    {
      title: "Projects",
      url: "/company/projects",
    },
  ],
};

function Spinner() {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="h-6 w-6 rounded-full border-2 border-muted border-t-primary animate-spin" />
    </div>
  );
}

function ProjectsList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const fetched = await getSupervisorProjects();
        console.log("Supervisor projects API response:", fetched); // debug
        if (fetched) setProjects(fetched);
      } catch (err) {
        console.error(err);
        showToast({
          type: "error",
          message:
            err instanceof Error ? err.message : "Failed to load projects",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (projects.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">No projects assigned</h2>
          <p className="text-muted-foreground">
            You have no student projects to supervise yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {projects.map((project, i) => (
        <SupervisorProjectCard key={project._id ?? project.id ?? i} project={project} />
      ))}
    </div>
  );
}

export default function CompanySupervisorProjects() {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") ?? "{}");
    } catch {
      return {};
    }
  })();

  return (
    <SidebarProvider>
      <AppSidebar
        data={navData}
        userInfo={{
          name: user.name ?? "Company Supervisor",
          role: user.role ?? "CompSupervisor",
        }}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/company/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Projects</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <ProjectsList />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}