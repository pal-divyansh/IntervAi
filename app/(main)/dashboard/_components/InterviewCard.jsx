"use client";

import Link from 'next/link';
import { format } from 'date-fns';
import { Clock, MessageSquare, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';

export default function InterviewCard({ interview }) {
    return (
        <Link
            href={`/interview/${interview.id}/completed`}
            className='group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/5 shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-white/10 hover:scale-[1.02] active:scale-100'
        >
            {/* Animated background gradient */}
            <div className='absolute inset-0 bg-gradient-to-br from-blue-600/8 via-transparent to-purple-600/8 opacity-0 group-hover:opacity-100 transition-all duration-700' />
            
            {/* Wave effect */}
            <div className='absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/4 rounded-full group-hover:scale-150 transition-transform duration-1000' />
            <div className='absolute -top-5 -right-5 w-24 h-24 bg-purple-500/4 rounded-full group-hover:scale-150 transition-transform duration-1000 delay-200' />
            
            {/* Glow effect on hover */}
            <div className='absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/8 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-700' />
            
            <div className='relative z-10'>
                <div className='flex justify-between items-start mb-4'>
                    <h3 className='text-lg font-medium text-white line-clamp-1'>{interview.job_title || 'Untitled Interview'}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                        interview.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                        interview.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                        'bg-red-500/20 text-red-400'
                    }`}>
                        {interview.status === 'completed' ? 'Completed' : interview.status === 'pending' ? 'In Progress' : 'Not Started'}
                    </span>
                </div>
                
                <p className='text-sm text-white/60 mb-4 line-clamp-2'>{interview.job_description || 'No description provided'}</p>
                
                <div className='flex items-center justify-between text-sm text-white/60'>
                    <div className='flex items-center gap-1'>
                        <Clock className='h-4 w-4' />
                        <span>{interview.duration || 'N/A'} min</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <MessageSquare className='h-4 w-4' />
                        <span>{interview.questions_count || 0} questions</span>
                    </div>
                </div>
                
                <div className='mt-4 pt-4 border-t border-white/5 text-xs text-white/50'>
                    {interview.created_at && (
                        <div className='flex items-center gap-1'>
                            <span>Created on {format(new Date(interview.created_at), 'MMM d, yyyy')}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
