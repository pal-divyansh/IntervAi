"use client";
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/AppSidebar";
import VantaBackground from "@/components/VantaBackground";
import { Button } from "@/components/ui/button";

export function DashboardProvider({ children }) {
    return (
        <VantaBackground>
            <SidebarProvider>
                <div className="relative flex min-h-screen w-full">
                    <div className="relative z-10">
                        <AppSidebar />
                        <div className="fixed left-4 top-4 z-50 md:hidden" style={{ zIndex: 9999 }}>
                            <Button 
                                onClick={() => document.dispatchEvent(new Event('sidebar:toggle'))}
                                className="h-10 w-10 rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                    <path d="M9 3v18" />
                                </svg>
                                <span className="sr-only">Toggle Sidebar</span>
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col min-w-0 relative z-0">
                        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-end pr-4 md:pr-8">
                            {/* Header content can go here */}
                        </header>
                        <main className="flex-1 p-4 md:p-8 pt-0 md:pt-0 overflow-auto">
                            <div className="max-w-7xl mx-auto w-full">
                                <SidebarTrigger />
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </VantaBackground>
    );
}



// Default export for backward compatibility
export default DashboardProvider;