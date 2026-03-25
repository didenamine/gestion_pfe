import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { GalleryVerticalEndIcon, LogOutIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileModal } from "@/components/profile-modal";
import { logoutUser } from "@/services/auth";
import { useNavigate } from "react-router-dom";

// This is sample data.
type SidebarItem = {
  title: string;
  url: string;
  isActive?: boolean;
};

type SidebarSection = {
  title: string;
  url: string;
  items?: SidebarItem[];
};

type SidebarData = {
  navMain: SidebarSection[];
};

export function AppSidebar({
  data,
  userInfo,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  data: SidebarData;
  userInfo?: { name: string; role: string };
}) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API fails, we often want to clear local state and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <Sidebar {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEndIcon className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">Documentation</span>
                    <span>v1.0.0</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {data.navMain.map((section) => (
                <SidebarMenuItem key={section.title}>
                  <SidebarMenuButton asChild>
                    <a href={section.url} className="font-medium">
                      {section.title}
                    </a>
                  </SidebarMenuButton>

                  {section.items?.length ? (
                    <SidebarMenuSub>
                      {section.items.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild isActive={item.isActive}>
                            <a href={item.url}>{item.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
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
              onClick={() => setIsProfileOpen(true)}
            >
              <User className="size-4 mr-2" />
              Profil
            </Button>
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
        <ProfileModal
          open={isProfileOpen}
          onOpenChange={setIsProfileOpen}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}


