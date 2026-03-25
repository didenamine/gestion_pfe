import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { GalleryVerticalEndIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
  title: string;
  url: string;
  icon?: React.ElementType;
  items?: { title: string; url: string }[];
};

type SidebarData = {
  navMain: NavItem[];
};

export function AppSidebar({
  data,
  userInfo,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  data: SidebarData;
  userInfo?: { name: string; role: string };
}) {
  const location = useLocation();

  const isActive = (url: string) => {
    if (url === "/student/dashboard") return location.pathname === url;
    return location.pathname.startsWith(url);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEndIcon className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-sm">PFE Tracker</span>
                  <span className="text-xs text-muted-foreground">
                    {userInfo?.role ?? "Système"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((section) => {
              const Icon = section.icon;
              const hasChildren = section.items && section.items.length > 0;
              const sectionActive = isActive(section.url);

              return (
                <SidebarMenuItem key={section.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={!hasChildren && sectionActive}
                  >
                    <Link to={section.url} className="font-medium">
                      {Icon && <Icon className="size-4" />}
                      {section.title}
                    </Link>
                  </SidebarMenuButton>

                  {hasChildren ? (
                    <SidebarMenuSub>
                      {section.items!.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              location.pathname === item.url ||
                              (item.url !== section.url &&
                                location.pathname.startsWith(item.url))
                            }
                          >
                            <Link to={item.url}>{item.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {userInfo && (
          <div className="px-2 py-1">
            <div className="mb-2 px-2 py-1.5 rounded-md bg-muted/50">
              <p className="text-xs font-medium text-foreground truncate">
                {userInfo.name}
              </p>
              <p className="text-xs text-muted-foreground">{userInfo.role}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOutIcon className="size-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
