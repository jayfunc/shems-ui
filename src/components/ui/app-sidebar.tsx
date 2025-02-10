import { LogOut, LucideProps } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Label } from "./label";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { redirect } from "next/navigation";
import { routing } from "@/constants/routing";

export function AppSidebar({
  menuItems,
}: {
  menuItems: {
    title: string;
    url: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }[];
}) {
  function logOut() {
    redirect(`/${routing.login}`);
  }

  return (
    <Sidebar>
      <SidebarHeader className="h-16 shrink-0 gap-2 border-b px-4 place-items-center flex flex-row">
        <Label className="font-bold font-serif">SHEMS</Label>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logOut}>
              <LogOut />
              Log out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
