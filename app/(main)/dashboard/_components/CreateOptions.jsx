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
                    className='relative p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/30 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer group overflow-hidden'
                    onClick={() => router.push('/dashboard/createInterview')}
                >
                    <div className='relative z-10'>
                        <div className='flex items-center gap-4'>
                            <div className='p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors'>
                                <Video className='h-6 w-6 text-blue-400' />
                            </div>
                            <h3 className='text-lg font-medium text-white'>Create an Interview</h3>
                        </div>
                        <p className='mt-3 text-sm text-white/70'>Create AI interview and schedule it with candidates</p>
                        <Button className='mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white transition-colors' size="sm">
                            <Plus className='h-4 w-4 mr-2' />
                            Create New
                        </Button>
                    </div>
                    <div className='absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-500' />
                </div>

                {/* Phone Screening Card */}
                <div className='relative p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/30 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group overflow-hidden'>
                    <div className='relative z-10'>
                        <div className='flex items-center gap-4'>
                            <div className='p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors'>
                                <Phone className='h-6 w-6 text-purple-400' />
                            </div>
                            <h3 className='text-lg font-medium text-white'>Create Phone Screening</h3>
                        </div>
                        <p className='mt-3 text-sm text-white/70'>Create Phone Screening call for candidates</p>
                        <Button 
                            className='mt-4 w-full bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-colors' 
                            size="sm" 
                            variant="outline"
                        >
                            <Plus className='h-4 w-4 mr-2' />
                            Create New
                        </Button>
                    </div>
                    <div className='absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-all duration-500' />
                </div>
            </div>
        </div>
    );
}

export default CreateOptions;
