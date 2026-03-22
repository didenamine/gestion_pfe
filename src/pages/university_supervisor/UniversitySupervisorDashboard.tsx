import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
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

const data = {
  navMain: [
    {
      title: "Réunions (Meetings)",
      url: "/uni/dashboard/meetings",
      items: [
        {
          title: "Toutes les Réunions",
          url: "/uni/dashboard/meetings",
        },
        {
          title: "En Attente de Validation",
          url: "/uni/dashboard/meetings/pending-validation",
        },
        {
          title: "Créer une Réunion",
          url: "/uni/dashboard/meetings/create",
        },
        {
          title: "Par Projet / Référence",
          url: "/uni/dashboard/meetings/search",
        },
      ],
    },
  ],
};
export default function UniversitySupervisorDashboard() {
  return (
    <SidebarProvider>
      <AppSidebar data={data} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Build Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
