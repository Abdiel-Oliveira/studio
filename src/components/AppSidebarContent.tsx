// src/components/AppSidebarContent.tsx
'use client';

import { LayoutDashboard, Settings, Users, BarChart3, FileText } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AppSidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 flex items-center gap-2.5 border-b border-sidebar-border h-16 flex-shrink-0">
        <LayoutDashboard className="h-7 w-7 text-primary flex-shrink-0" />
        <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden whitespace-nowrap overflow-hidden">
          Loss Insights Hub
        </span>
      </div>

      <nav className="flex-grow p-2 overflow-y-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/'}
              tooltip="Dashboard"
            >
              <Link href="/">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/reports'}
              tooltip="All Reports"
            >
              <Link href="#"> {/* Placeholder link */}
                <FileText />
                <span>All Reports</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/analytics'}
              tooltip="Analytics"
            >
              <Link href="#"> {/* Placeholder link */}
                <BarChart3 />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/users'}
              tooltip="User Management"
            >
              <Link href="#"> {/* Placeholder link */}
                <Users />
                <span>Users</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </nav>

      <div className="p-2 border-t border-sidebar-border flex-shrink-0">
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/settings'}
              tooltip="Settings"
            >
              <Link href="#"> {/* Placeholder link */}
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <p className="mt-2 p-2 text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden text-center">
          &copy; {new Date().getFullYear()} Loss Insights Hub
        </p>
      </div>
    </div>
  );
}
