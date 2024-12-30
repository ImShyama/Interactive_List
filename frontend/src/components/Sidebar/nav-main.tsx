"use client"

import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavLink } from "react-router-dom"

export function NavMain({ pathname }: { pathname: string }) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleCloseMobile = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {/* Dashboard */}
        <SidebarMenuItem onClick={handleCloseMobile}>
          <NavLink to={"/dashboard"} draggable={false} className={({ isActive }) =>
            isActive
              ? "" // Active state styles
              : ""
          }>
            <SidebarMenuButton tooltip={"Dashboard"} className={pathname == "/dashboard" ? "bg-[--active-tab-bg] text-[--active-tab-color] hover:bg-[--active-tab-bg] hover:text-[--active-tab-color]" : ""}>
              <img height={"16px"} width={"16px"} src={`/icons/dashboard${pathname == "/dashboard" ? "Active" : ""}.svg`} alt="supplier" draggable={false} />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </NavLink>
        </SidebarMenuItem>
        {/* Inventory */}
        <Collapsible
          asChild
          defaultOpen
          className="group/collapsible"
        >
          <SidebarMenuItem >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={"Inventory"} className={["/inventory/live_stock", "/inventory/stock_ledger", "/inventory/po_pending"].includes(pathname) ? "bg-[--active-tab-bg] text-[--active-tab-color] hover:bg-[--active-tab-bg] hover:text-[--active-tab-color]" : ""}>
                <img height={"16px"} width={"16px"} src={`/icons/inventory${["/live_stock", "/stock_ledger", "/po_pending"].includes(pathname) ? "Active" : ""}.svg`} alt="supplier" draggable={false} />
                <span>Inventory</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {[
                  { title: "Live Stock", url: "/inventory/live_stock" },
                  { title: "Stock Ledger", url: "/inventory/stock_ledger" },
                  { title: "PO Pending", url: "/inventory/po_pending" },
                ].map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title} onClick={handleCloseMobile}>
                    <SidebarMenuSubButton asChild className={pathname == subItem.url ? "bg-[--active-tab-bg] text-[--active-tab-color] hover:bg-[--active-tab-bg] hover:text-[--active-tab-color]" : ""}>
                      <NavLink to={subItem.url} draggable={false}>
                        <span>{subItem.title}</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
        {/* Supplier */}
        <Collapsible
          asChild
          defaultOpen
          className="group/collapsible"
        >
          <SidebarMenuItem >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={"Supplier"} className={["/supplier_db", "/rfq", "/rates_analysis", "/po_list"].includes(pathname) ? "bg-[--active-tab-bg] text-[--active-tab-color] hover:bg-[--active-tab-bg] hover:text-[--active-tab-color]" : ""}>
                <img height={"16px"} width={"16px"} src={`/icons/supplier${["/supplier_db", "/rfq", "/rates_analysis", "/po_list"].includes(pathname) ? "Active" : ""}.svg`} alt="supplier" draggable={false} />
                <span>Supplier</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {[
                  { title: "Supplier DB", url: "/supplier_db" },
                  { title: "RFQ", url: "/rfq" },
                  { title: "Rates Analysis", url: "/rates_analysis" },
                  { title: "PO List", url: "/po_list" },

                ].map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title} onClick={handleCloseMobile}>
                    <SidebarMenuSubButton asChild className={pathname == subItem.url ? "bg-[--active-tab-bg] text-[--active-tab-color] hover:bg-[--active-tab-bg] hover:text-[--active-tab-color]" : ""}>
                      <NavLink to={subItem.url} draggable={false}>
                        <span>{subItem.title}</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}
