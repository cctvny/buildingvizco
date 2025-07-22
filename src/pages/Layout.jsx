

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Users, 
  Lock, 
  Settings,
  Shield,
  CreditCard,
  Calendar,
  Router, // Added
  FileText // Added
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    url: createPageUrl("Users"),
    icon: Users,
  },
  {
    title: "Locks",
    url: createPageUrl("Locks"),
    icon: Lock,
  },
  {
    title: "Gateways",
    url: createPageUrl("Gateways"),
    icon: Router,
  },
  {
    title: "Credentials",
    url: createPageUrl("Credentials"),
    icon: CreditCard,
  },
  {
    title: "Schedules",
    url: createPageUrl("Schedules"),
    icon: Calendar,
  },
  {
    title: "Reports",
    url: createPageUrl("Reports"),
    icon: FileText,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --background: 248 250 252;
            --foreground: 15 23 42;
            --primary: 15 23 42;
            --primary-foreground: 248 250 252;
            --secondary: 226 232 240;
            --secondary-foreground: 30 41 59;
            --accent: 226 232 240;
            --accent-foreground: 30 41 59;
            --muted: 241 245 249;
            --muted-foreground: 100 116 139;
            --border: 226 232 240;
            --input: 226 232 240;
            --ring: 15 23 42;
          }
        `}
      </style>
      <div className="min-h-screen flex w-full bg-slate-50">
        <Sidebar className="border-r border-slate-200 bg-white">
          <SidebarHeader className="border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">LockMaster</h2>
                <p className="text-xs text-slate-500 font-medium">Property Management</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-slate-100 transition-all duration-200 rounded-lg ${
                          location.pathname === item.url 
                            ? 'bg-slate-900 text-white hover:bg-slate-900' 
                            : 'text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <span className="text-slate-700 font-semibold text-sm">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">Admin User</p>
                <p className="text-xs text-slate-500 truncate">Property Manager</p>
              </div>
              <Settings className="w-4 h-4 text-slate-400" />
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-slate-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">LockMaster</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-slate-50">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

