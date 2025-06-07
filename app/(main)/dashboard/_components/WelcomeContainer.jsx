"use client";
import React from 'react';
import { useUser } from '@/app/provider';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

function WelcomeContainer() {
    const { user } = useUser();

    if (!user) {
        return <div>Loading user data...</div>;
    }

    const userName = user.name || user.user_metadata?.name || 'User';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
    const userImage = user.picture || user.user_metadata?.avatar_url;

    return (
        <div className="w-full p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">
                        Welcome to the Dashboard, {userName}!
                    </h1>
                    <p className="text-white/70 mt-2">AI-Driven Interviews, Human-like Feedback</p>
                </div>
                
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                    <Avatar className="h-20 w-20 border-2 border-blue-400/50 shadow-lg">
                        {userImage ? (
                            <AvatarImage src={userImage} alt={userName} className="object-cover" />
                        ) : null}
                        <AvatarFallback className="text-2xl font-semibold bg-blue-500/20 text-white">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 -z-10" />
        </div>
    );
}

export default WelcomeContainer;
