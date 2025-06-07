"use client";
import React, { useState } from 'react';
import { Video, Plus, Calendar, Clock, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

function LatestInterviewsList() {
    const [interviews, setInterviews] = useState([]);
    
    return (
        <div className='mt-10'>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-white'>Previously Conducted Interviews</h2>
                <Button 
                    variant="outline" 
                    size="sm"
                    className='bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-colors'
                >
                    <Plus className='h-4 w-4 mr-2' />
                    New Interview
                </Button>
            </div>
            
            {interviews.length === 0 && (
                <div className='relative p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl text-center overflow-hidden'>
                    {/* Decorative elements */}
                    <div className='absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-500/10' />
                    <div className='absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500/10' />
                    
                    <div className='relative z-10'>
                        <div className='inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/10 mb-4 mx-auto'>
                            <Video className='h-8 w-8 text-blue-400' />
                        </div>
                        <h3 className='text-lg font-medium text-white'>No interviews found</h3>
                        <p className='text-white/70 mt-2 mb-6 max-w-md mx-auto'>Get started by creating your first interview</p>
                        <Button 
                            className='bg-blue-600 hover:bg-blue-500 text-white transition-colors group'
                        >
                            <Plus className='h-4 w-4 mr-2 transition-transform group-hover:rotate-90' />
                            Create New Interview
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LatestInterviewsList;
