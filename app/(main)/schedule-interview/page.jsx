'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/app/services/supabaseClient';
import { useUser } from '@/app/provider';

export default function ScheduledInterview() {
    const { user, loading: userLoading } = useUser();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.email) {
            getInterviews();
        }
    }, [user]);

    const getInterviews = async () => {
        if (!user?.email) return;
        
        try {
            setLoading(true);
            
            // First get the interviews for this user
            const { data: interviewsData, error: interviewsError } = await supabase
                .from('Interviews')
                .select('job_title, interview_id, duration, created_at')
                .eq('userEmail', user.email)
                .order('created_at', { ascending: false });
            
            if (interviewsError) throw interviewsError;
            
            // Then get the feedback for these interviews
            const interviewIds = interviewsData?.map(i => i.interview_id) || [];
            let feedbackMap = {};
            
            if (interviewIds.length > 0) {
                const { data: feedbackData, error: feedbackError } = await supabase
                    .from('interview-feedback')
                    .select('interview_id, userEmail')
                    .in('interview_id', interviewIds);
                
                if (feedbackError) throw feedbackError;
                
                // Create a map of interview_id to feedback
                feedbackData?.forEach(fb => {
                    feedbackMap[fb.interview_id] = fb;
                });
            }
            
            // Combine the data
            const interviewsWithFeedback = interviewsData?.map(interview => ({
                ...interview,
                feedback: feedbackMap[interview.interview_id] || null
            })) || [];
            
            setInterviews(interviewsWithFeedback);
            setError(null);
        } catch (err) {
            console.error('Error fetching interviews:', err);
            setError(err.message || 'Failed to load interviews');
        } finally {
            setLoading(false);
        }
    };
    
    if (userLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 max-w-4xl mx-auto">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Scheduled Interviews
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-300 sm:mt-4">
                        View and manage your upcoming and past interviews
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center p-16">
                        <div className='animate-spin rounded-full h-14 w-14 border-2 border-blue-500 border-t-transparent'></div>
                    </div>
                ) : interviews.length === 0 ? (
                    <div className='relative p-10 rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-900/10 border border-white/10 shadow-2xl text-center overflow-hidden backdrop-blur-sm'>
                        <div className='absolute -top-32 -right-32 h-64 w-64 rounded-full bg-blue-500/5 blur-2xl' />
                        <div className='absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-2xl' />
                        
                        <div className='relative z-10'>
                            <div className='inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-white/10 mb-6 mx-auto backdrop-blur-sm'>
                                <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className='text-xl font-semibold text-white mb-3'>No Interviews Scheduled</h3>
                            <p className='text-white/70 mb-6 max-w-md mx-auto text-sm'>Get started by scheduling your first interview session</p>
                            <Link href="/schedule-interview">
                                <button className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95 group text-sm font-medium flex items-center mx-auto'>
                                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Schedule New Interview
                                </button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {interviews.map((interview) => (
                            <div 
                                key={interview.interview_id}
                                className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div className="relative p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-white/10">
                                                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 18h.01" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    {interview.job_title}
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-400">
                                                    {new Date(interview.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        {interview.feedback ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                Feedback Ready
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                            <p className="text-xs font-medium text-gray-400">Duration</p>
                                            <p className="mt-1 text-sm font-medium text-white">{interview.duration} minutes</p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                            <p className="text-xs font-medium text-gray-400">Status</p>
                                            <p className="mt-1 text-sm font-medium text-white">
                                                {interview.feedback ? 'Completed' : 'Scheduled'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <Link 
                                            href={interview.feedback ? `/interview/${interview.interview_id}/completed` : '#'}
                                            className={`w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                interview.feedback 
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transform hover:scale-[1.02] active:scale-95' 
                                                    : 'bg-white/5 text-gray-400 border border-white/10 cursor-not-allowed'
                                            }`}
                                        >
                                            {interview.feedback ? (
                                                <>
                                                    <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    View Feedback
                                                </>
                                            ) : (
                                                'Feedback Pending'
                                            )}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
