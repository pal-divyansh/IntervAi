"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { SidebarOptions } from "../../../app/services/Constants";

export function AppSidebar() {
  const pathname = usePathname();
  
  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <Sidebar className="flex flex-col h-screen bg-black/30 backdrop-blur-lg border-r border-white/10">
      {/* Sidebar Header with Logo */}
      <SidebarHeader className="p-6 pb-4 border-b border-white/10">
        <div className="flex flex-col space-y-4 w-full">
          <div className="flex justify-center">
            <Image 
              src="/logo.png" 
              alt="InterviewAI" 
              width={160}
              height={36}
              priority
              className="w-[160px] h-auto"
            />
          </div>
          <Link href="/dashboard/create-interview">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all shadow-lg hover:shadow-blue-500/20">
              <Plus className="w-4 h-4 mr-2" />
              New Interview
            </Button>
          </Link>
        </div>
      </SidebarHeader>

      {/* Navigation Items */}
      <SidebarContent className="flex-1 overflow-y-auto py-4 px-2">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {SidebarOptions.map((item, index) => {
              const active = isActive(item.path);
              return (
                <SidebarMenuItem key={index} className="w-full">
                  <SidebarMenuButton asChild className="w-full">
                    <Link 
                      href={item.path}
                      className={`group flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                        active 
                          ? 'bg-white/10 text-white shadow-lg shadow-blue-500/10'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className={`transition-colors ${
                        active 
                          ? 'text-white'
                          : 'text-gray-500 group-hover:text-white'
                      }`}>
                        {React.createElement(item.icon, { 
                          className: `w-5 h-5 flex-shrink-0 ${active ? 'text-blue-400' : 'text-current'}`,
                          strokeWidth: active ? 2 : 1.5
                         })}
                      </span>
                      <span className="ml-3">{item.title}</span>
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-white/10">
        <div className="text-center text-xs text-gray-500">
          <p>v1.0.0</p>
          <p className="mt-1">© {new Date().getFullYear()} InterviewAI</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
