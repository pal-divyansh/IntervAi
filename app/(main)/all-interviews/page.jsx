
"use client";
import React, { useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase } from '@/app/services/supabaseClient';
import { useUser } from '@/app/provider';
import InterviewCard from '../dashboard/_components/InterviewCard';

export default function AllInterviews() {
    const { user } = useUser();
    const [interviews, setInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInterviews = async () => {
        if (!user?.email) return;
        
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('Interviews')
                .select('*')
                .eq('userEmail', user.email)
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            setInterviews(data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching interviews:', err);
            setError('Failed to load interviews. Please try again.');
            setInterviews([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviews();
    }, [user?.email]);
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className='flex justify-center items-center p-16'>
                    <div className='animate-spin rounded-full h-14 w-14 border-2 border-blue-500 border-t-transparent'></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className='p-8 rounded-2xl bg-gradient-to-br from-red-500/5 to-red-900/10 border border-red-500/20 text-center backdrop-blur-sm'>
                    <div className='inline-flex items-center justify-center h-14 w-14 rounded-full bg-red-500/10 mb-4 mx-auto'>
                        <AlertCircle className='h-6 w-6 text-red-400' />
                    </div>
                    <h3 className='text-lg font-semibold text-red-100 mb-2'>Error Loading Interviews</h3>
                    <p className='text-red-300/80 mb-6 max-w-md mx-auto'>{error}</p>
                    <Button 
                        onClick={fetchInterviews}
                        className='bg-red-600/90 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95'
                    >
                        <RefreshCw className='h-4 w-4 mr-2' />
                        Try Again
                    </Button>
                </div>
            );
        }

        if (interviews.length === 0) {
            return (
                <div className='relative p-10 rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-900/10 border border-white/10 shadow-2xl text-center overflow-hidden backdrop-blur-sm'>
                    <div className='absolute -top-32 -right-32 h-64 w-64 rounded-full bg-blue-500/5 blur-2xl' />
                    <div className='absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-2xl' />
                    
                    <div className='relative z-10'>
                        <div className='inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-white/10 mb-6 mx-auto backdrop-blur-sm'>
                            <Video className='h-8 w-8 text-blue-400' />
                        </div>
                        <h3 className='text-xl font-semibold text-white mb-3'>No Interviews Yet</h3>
                        <p className='text-white/70 mb-6 max-w-md mx-auto text-sm'>Get started by scheduling your first interview session</p>
                        <Link href="/schedule-interview">
                            <Button 
                                className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95 group'
                            >
                                <Plus className='h-4 w-4 mr-2 transition-transform group-hover:rotate-90' />
                                Schedule New Interview
                            </Button>
                        </Link>
                    </div>
                </div>
            );
        }

        // Show all interviews
        const displayedInterviews = [...interviews];

        return (
            <div className='relative'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {displayedInterviews.map((interview) => (
                        <InterviewCard 
                            key={interview.id} 
                            interview={{
                                ...interview,
                                job_title: interview.jobPosition || 'Interview',
                                job_description: interview.jobDescription,
                                status: interview.status?.toLowerCase() || 'completed',
                                duration: interview.duration || '30',
                                questions_count: interview.questions_count || 0
                            }} 
                        />
                    ))}
                </div>
                

            </div>
        );
    };

    return (
        <section className='mt-12'>
            <div className='mb-8 text-center'>
                <h2 className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
                    Your Interviews
                </h2>
                <p className='text-white/60 text-sm mt-1'>Review and manage your past interview sessions</p>
            </div>
            <div className='max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar'>
                {/* Custom scrollbar styles */}
                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.3);
                    }
                `}</style>
                {renderContent()}
            </div>
        </section>
    );
}
