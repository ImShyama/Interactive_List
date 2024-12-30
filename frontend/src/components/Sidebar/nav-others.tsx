import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavLink } from "react-router-dom"

export function NavProjects({ pathname }: { pathname: string }) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleCloseMobile = () => {
    if (isMobile) setOpenMobile(false)
  }
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Others</SidebarGroupLabel>
      <SidebarMenu>
        {/* Dashboard */}
        <SidebarMenuItem >
          <NavLink to={"/products"} draggable={false} >
            <SidebarMenuButton tooltip={"Product DB"} onClick={handleCloseMobile} className={pathname == "/products" ? "bg-[--active-tab-bg] text-[--active-tab-color] hover:bg-[--active-tab-bg] hover:text-[--active-tab-color]" : ""}>
              <img height={"16px"} width={"16px"} src={`/icons/productdb${pathname == "/products" ? "Active" : ""}.svg`} alt="supplier" draggable={false} />
              <span>Product DB</span>
            </SidebarMenuButton>
          </NavLink>
        </SidebarMenuItem>
        {/* Dashboard */}
        <SidebarMenuItem onClick={handleCloseMobile}>
          <NavLink to={"/settings/rac"} draggable={false}>
            <SidebarMenuButton tooltip={"Settings"} className={pathname == "/settings" ? "bg-[--active-tab-bg] text-[--active-tab-color] hover:bg-[--active-tab-bg] hover:text-[--active-tab-color]" : ""}>
              <img height={"16px"} width={"16px"} src={`/icons/settings${pathname == "/settings" ? "Active" : ""}.svg`} alt="supplier" draggable={false} />
              <span>Settings</span>
            </SidebarMenuButton>
          </NavLink>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
