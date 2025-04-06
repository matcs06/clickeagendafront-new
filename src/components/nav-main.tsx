"use client"

import { type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";


export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Opções</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem  className="cursor-pointer">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                <Link
                  href={item.url}
                  className="flex items-center gap-2 w-full overflow-hidden"
                >
                  <span className="shrink-0">
                    {item.icon && <item.icon className="w-4 h-4" />}
                  </span>
                  <span className="truncate transition-all duration-200">
                    {item.title}
                  </span>
                </Link>
                
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
