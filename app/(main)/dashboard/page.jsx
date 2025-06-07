import React from 'react';
import WelcomeContainer from './_components/WelcomeContainer';
import CreateOptions from './_components/CreateOptions';
import LatestInterviewsList from './_components/LatestInterviewsList';
import { SidebarTrigger } from "@/components/ui/sidebar";

function Page() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto w-full">
            <WelcomeContainer />
            <div className="space-y-8 px-4 sm:px-6 lg:px-8 pb-8">
                <CreateOptions />
                <LatestInterviewsList />
            </div>
        </div>
    );
}

export default Page;