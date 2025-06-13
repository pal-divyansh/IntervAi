import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Clock, List, Mail, MessageCircle, ArrowLeft, Plus, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

function InterviewLink({ interview_id, formData }) {
    const [copied, setCopied] = useState(false);

    const GetInterviewLink = () => {
        // Use NEXT_PUBLIC_HOST_URL if available, otherwise fall back to current origin
        const baseUrl = process.env.NEXT_PUBLIC_HOST_URL || 
                      (typeof window !== 'undefined' ? window.location.origin : '');
        // Ensure we have a valid base URL
        if (!baseUrl) {
            console.error('NEXT_PUBLIC_HOST_URL is not set in environment variables');
            return '';
        }
        // Remove any trailing slashes and append the interview path
        return `${baseUrl.replace(/\/+$/, '')}/interview/${interview_id}`;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(GetInterviewLink());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className='relative'>
            {/* Decorative elements */}
            <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30'></div>
            
            <div className='relative bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl'>
                <div className='space-y-8'>
                    {/* Header */}
                    <div className='space-y-1 text-center'>
                        <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent'>
                            Your Interview is Ready! 🎉
                        </h2>
                        <p className='text-white/70'>
                            Share this link with your candidates to start the interview process
                        </p>
                    </div>

                    {/* Interview Link Card */}
                    <div className='bg-white/5 border border-white/10 rounded-xl p-6 space-y-6'>
                        <div className='flex justify-between items-center'>
                            <h3 className='text-lg font-medium text-white'>Interview Link</h3>
                            <span className='text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full'>Valid for 30 days</span>
                        </div>
                        
                        <div className='flex gap-2'>
                            <Input 
                                value={GetInterviewLink()} 
                                readOnly 
                                onFocus={(e) => e.target.select()}
                                onClick={(e) => e.target.select()}
                                className='bg-white/5 border-white/10 text-white/90 flex-1 hover:border-white/20 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors duration-300 select-all cursor-default'
                            />
                            <Button 
                                onClick={handleCopy}
                                className='bg-blue-600 hover:bg-blue-500 text-white transition-colors group'
                            >
                                {copied ? (
                                    <Check className='h-4 w-4' />
                                ) : (
                                    <Copy className='h-4 w-4' />
                                )}
                                <span className='ml-2'>{copied ? 'Copied!' : 'Copy'}</span>
                            </Button>
                        </div>

                        <div className='flex items-center justify-between pt-4 border-t border-white/10'>
                            <div className='flex items-center space-x-4 text-sm text-white/70'>
                                <span className='flex items-center'><Clock className='h-4 w-4 mr-1' /> {formData?.duration} min</span>
                                <span className='flex items-center'><List className='h-4 w-4 mr-1' /> 10 Questions</span>
                            </div>
                            <div className='flex space-x-2'>
                                <Button variant="outline" size="sm" className='bg-white/5 border-white/10 text-white/90 hover:bg-white/10 hover:border-white/20'>
                                    <Mail className='h-4 w-4 mr-2' /> Email
                                </Button>
                                <Button variant="outline" size="sm" className='bg-white/5 border-white/10 text-white/90 hover:bg-white/10 hover:border-white/20'>
                                    <MessageCircle className='h-4 w-4 mr-2' /> WhatsApp
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex justify-between pt-4'>
                        <Link href="/dashboard" className='w-full max-w-[200px]'>
                            <Button variant="outline" className='w-full bg-white/5 border-white/10 text-white/90 hover:bg-white/10 hover:border-white/20'>
                                <ArrowLeft className='h-4 w-4 mr-2' /> Back to Dashboard
                            </Button>
                        </Link>
                        <Link href="/dashboard/createInterview" className='w-full max-w-[250px]'>
                            <Button className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all'>
                                <Plus className='h-4 w-4 mr-2' /> Create New Interview
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InterviewLink;