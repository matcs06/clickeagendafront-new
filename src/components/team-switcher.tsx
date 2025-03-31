"use client"

import * as React from "react"
import Cookies from "js-cookie"
import { Calendar } from "lucide-react"
import {
  DropdownMenu,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function TeamSwitcher(){
  
  const name = Cookies.get("name") == null ? "Nome" : Cookies.get("name")
  const business_name = Cookies.get("business_name") == null ? "Empresa" : Cookies.get("business_name")
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Calendar className="size-4"/>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{business_name}</span>
                <span className="truncate font-normal">{name}</span>
              </div>
            </SidebarMenuButton>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
