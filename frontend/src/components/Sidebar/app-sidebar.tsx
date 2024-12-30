import * as React from "react"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-others"
import { NavUser } from "./nav-user"
import { LogoSection } from "./LogoSection"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom"

// This is sample data.
const data = {
  user: {
    name: "Raghbir Singh",
    email: "raghbir@ceoitbox.in",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocJVnW9LKbkB-6ykt5wYsaooibcQnmx8etHjqNbUt-_UC3xb0wM=s96-c",
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoSection />
      </SidebarHeader>
      <SidebarContent>
        <NavMain pathname={pathname} />
        <NavProjects pathname={pathname} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}
