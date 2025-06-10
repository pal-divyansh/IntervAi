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
        <div className="w-full p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/5 shadow-2xl relative overflow-hidden group">
            {/* Animated background gradient */}
            <div className='absolute inset-0 bg-gradient-to-br from-blue-600/8 via-transparent to-purple-600/8 opacity-0 group-hover:opacity-100 transition-all duration-700' />
            
            {/* Wave effect */}
            <div className='absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/4 rounded-full group-hover:scale-150 transition-transform duration-1000' />
            <div className='absolute -top-5 -right-5 w-24 h-24 bg-purple-500/4 rounded-full group-hover:scale-150 transition-transform duration-1000 delay-200' />
            
            {/* Glow effect on hover */}
            <div className='absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/8 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-700' />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">
                        Welcome to the Dashboard, {userName}!
                    </h1>
                    <p className="text-white/70 mt-2">AI-Driven Interviews, Human-like Feedback</p>
                </div>
                
                <div className="relative z-10">
                    <Avatar className="h-20 w-20 border-2 border-blue-400/50 shadow-lg group-hover:border-blue-400/70 transition-colors duration-300">
                        {userImage ? (
                            <AvatarImage src={userImage} alt={userName} className="object-cover" />
                        ) : null}
                        <AvatarFallback className="text-2xl font-semibold bg-blue-500/20 text-white group-hover:bg-blue-500/30 transition-colors duration-300">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    );
}

export default WelcomeContainer;
