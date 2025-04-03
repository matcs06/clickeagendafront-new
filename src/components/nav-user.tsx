"use client"

import {
  Settings2Icon,
  ChevronsUpDown,
  CreditCard,
  LogOut,
} from "lucide-react"

import {
  Avatar
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/app/auth/context/auth-context"
import { ModeToggle } from "./mode-toogle"
import CompleteProfileModal from "@/app/admin/pages/addinfo/page"
import { useState } from "react"

export function NavUser({
  user,
}: {
  user: {
    email: string
    avatar: React.JSX.Element
  }
}) {
  const { isMobile } = useSidebar()

  const {logout} = useAuth()
  const [ openAdditionalInfo, setOpenAdditionalInfo] = useState(false)
  const handleAddInfo = () =>{
   setOpenAdditionalInfo(!openAdditionalInfo) 
  }

  return (
    <>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user.avatar}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.avatar}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ModeToggle/>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleAddInfo} className="cursor-pointer">
                <Settings2Icon />
                Informações adicionais
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <CreditCard />
                Pagamentos
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              <LogOut />
              Log out / Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
    <CompleteProfileModal  open={openAdditionalInfo} setOpen={setOpenAdditionalInfo}/>  
    </>
  )
}
