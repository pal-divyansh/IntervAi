"use client";
import React from 'react';
import { Video, Phone, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function CreateOptions() {
    const router = useRouter();
    return (
        <div className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl'>
                {/* Create Interview Card */}
                <div 
                    className='relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/5 shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden'
                    onClick={() => router.push('/dashboard/createInterview')}
                >
                    {/* Animated background gradient */}
                    <div className='absolute inset-0 bg-gradient-to-br from-blue-600/8 via-transparent to-purple-600/8 opacity-0 group-hover:opacity-100 transition-all duration-700' />
                    
                    {/* Wave effect */}
                    <div className='absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/4 rounded-full group-hover:scale-150 transition-transform duration-1000' />
                    <div className='absolute -top-5 -right-5 w-24 h-24 bg-purple-500/4 rounded-full group-hover:scale-150 transition-transform duration-1000 delay-200' />
                    
                    {/* Glow effect on hover */}
                    <div className='absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/8 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-700' />

                    <div className='relative z-10'>
                        <div className='flex items-center gap-4'>
                            <div className='p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors'>
                                <Video className='h-6 w-6 text-blue-400' />
                            </div>
                            <h3 className='text-lg font-medium text-white'>Create an Interview</h3>
                        </div>
                        <p className='mt-3 text-sm text-white/70'>Create AI interview and schedule it with candidates</p>
                        <Button className='mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white transition-colors group-hover:bg-blue-500/90' size="sm">
                            <Plus className='h-4 w-4 mr-2' />
                            Create New
                        </Button>
                    </div>
                </div>

                {/* Phone Screening Card */}
                <div className='relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/5 shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden'>
                    {/* Animated background gradient */}
                    <div className='absolute inset-0 bg-gradient-to-br from-purple-600/8 via-transparent to-blue-600/8 opacity-0 group-hover:opacity-100 transition-all duration-700' />
                    
                    {/* Wave effect */}
                    <div className='absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/4 rounded-full group-hover:scale-150 transition-transform duration-1000' />
                    <div className='absolute -top-5 -right-5 w-24 h-24 bg-blue-500/4 rounded-full group-hover:scale-150 transition-transform duration-1000 delay-200' />
                    
                    {/* Glow effect on hover */}
                    <div className='absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-blue-500/8 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-700' />

                    <div className='relative z-10'>
                        <div className='flex items-center gap-4'>
                            <div className='p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors'>
                                <Phone className='h-6 w-6 text-purple-400' />
                            </div>
                            <h3 className='text-lg font-medium text-white'>Create Phone Screening</h3>
                        </div>
                        <p className='mt-3 text-sm text-white/70'>Create Phone Screening call for candidates</p>
                        <Button 
                            className='mt-4 w-full bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-colors group-hover:bg-white/5' 
                            size="sm" 
                            variant="outline"
                        >
                            <Plus className='h-4 w-4 mr-2' />
                            Create New
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateOptions;
