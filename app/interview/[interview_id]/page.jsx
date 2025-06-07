'use client';
import { Button } from '@/components/ui/button';
import { Video, Wifi, Monitor, Headphones, CheckCircle2, Clock } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import VantaBackground from '@/components/VantaBackground';
import { supabase } from '../../services/supabaseClient';
import { InterviewDataContext } from '@/app/context/InterviewDataContext';
import { useContext } from 'react';
import { Loader2Icon } from 'lucide-react';


const InterviewPage = () => {
    const {interview_id} = useParams();
    console.log(interview_id);
    const [loading, setLoading] = useState(false);

    const GetInterviewDetails = async () => {
        try {
            setLoading(true);
            const { data: Interviews, error } = await supabase
                .from('Interviews')
                .select('*')
                .eq('interview_id', interview_id)
                .single();

            if (error) throw error;
            return Interviews;
        } catch (error) {
            console.error('Error fetching interview details:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }
    const { interviewData, setInterviewData } = useContext(InterviewDataContext);
    const router = useRouter();
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch interview details when component mounts
    useEffect(() => {
        const fetchInterviewDetails = async () => {
            const details = await GetInterviewDetails();
            if (details) {
                setInterviewData(details);
            }
            setIsLoading(false);
        };
        fetchInterviewDetails();
    }, []);
    
    const handleJoinInterview = async (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            console.log('Please enter your name');
            return;
        }
        
        try {
            setLoading(true);
            
            // Fetch interview details
            const { data: interview, error: interviewError } = await supabase
                .from('Interviews')
                .select('*')
                .eq('interview_id', interview_id)
                .single();

            if (interviewError) throw interviewError;

            // Get questions from the questionList column
            const questions = interview.questionList || [];
            console.log('Questions from questionList:', questions);

            // Log all the details
            console.log('Interview Details:', {
                ...interview,
                candidateName: name.trim()
            });

            // Store in context
            setInterviewData({ ...interview, questions });
            
            // Navigate to the start page
            router.push(`/interview/${interview_id}/start`);
        } catch (error) {
            console.error('Error fetching interview details:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <VantaBackground>
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
                <div className="relative w-full max-w-4xl">
                    <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30 -z-10'></div>
                    <div className='relative bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl w-full'>
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <Image 
                                src="/logo.png" 
                                alt="Logo" 
                                width={120} 
                                height={120} 
                                className="rounded-lg"
                            />
                        </div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            AI-Powered Interview Platform
                        </h1>
                        <p className="text-sm text-white/60">Showcase your skills in a real-world coding environment</p>
                    </div>

                    {/* Interview Info Card */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8 hover:border-white/20 transition-colors duration-300">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <Monitor className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-white">
                                            {isLoading ? 'Loading...' : (interviewData?.job_title || 'Interview')}
                                        </h2>
                                        <p className="text-white/60 text-sm">
                                            {isLoading ? 'Loading details...' : 'Technical Interview'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-white">
                                    <p className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-blue-400" />
                                        <span>Duration: {isLoading ? 'Loading...' : (interviewData?.duration || 'N/A')}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                                        <span>Auto-recorded session</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Name Input */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8 hover:border-white/20 transition-colors duration-300">
                        <h3 className="text-lg font-medium text-white mb-4">Enter your details</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8 hover:border-white/20 transition-colors duration-300">
                        <h3 className="text-lg font-medium text-white mb-4">Before you begin</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <Wifi className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-white">Ensure you have a stable internet connection</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Headphones className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                <span className="text-white">Use headphones for better audio quality</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Monitor className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                                <span className="text-white">Close unnecessary applications to avoid distractions</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Button */}
                    <div className="text-center">
                        <Button 
                            size="lg" 
                            className="w-full max-w-xs bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg py-6 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                            onClick={handleJoinInterview}
                            disabled={!name.trim()}
                        >
                            <Video className="mr-2 h-5 w-5" />
                            {loading && <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />}
                            Start Interview
                        </Button>
                    </div>
                    </div>
                </div>
            </div>
        </VantaBackground>
    );
};

export default InterviewPage;
