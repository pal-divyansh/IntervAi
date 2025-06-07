'use client';

import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { InterviewDataContext } from '@/app/context/InterviewDataContext';
import Image from 'next/image';
import { Mic, Phone, Timer } from 'lucide-react';
import VantaBackground from '@/components/VantaBackground';
import Vapi from '@vapi-ai/web';

export default function StartPage() {
    const { interviewData } = useContext(InterviewDataContext);
    const { interview_id } = useParams();
    const [vapi, setVapi] = useState(null);
    const [callStatus, setCallStatus] = useState('connecting'); // 'connecting', 'active', 'ended', 'error'
    const [callDuration, setCallDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isAISpeaking, setIsAISpeaking] = useState(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState(false);
    const callTimerRef = useRef(null);
    const userSpeechRecognition = useRef(null);

    // Initialize Vapi when component mounts
    useEffect(() => {
        const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
        setVapi(vapiInstance);

        // Cleanup on unmount
        return () => {
            if (vapiInstance) {
                vapiInstance.stop();
            }
        };
    }, []);

    const startCall = async () => {
        console.log('Starting interview call...');
        
        if (!interviewData) {
            console.error('No interview data available');
            return;
        }

        if (!vapi) {
            console.error('VAPI client not initialized');
            return;
        }

        try {
            // Get questions from interview data
            let questions = [];
            if (interviewData.question_list) {
                const questionArray = typeof interviewData.question_list === 'string' 
                    ? JSON.parse(interviewData.question_list)
                    : interviewData.question_list;

                if (Array.isArray(questionArray)) {
                    questions = questionArray;
                }
            }

            console.log('Questions to ask:', questions);

            // Format the system prompt with questions
            const systemPrompt = `You are an AI interviewer for a ${interviewData?.job_title || 'technical'} position. \n\n` +
                'Your task is to ask the following questions one at a time, waiting for a response before moving to the next.\n\n' +
                'QUESTIONS:\n' +
                questions.map((q, i) => `${i + 1}. ${q}`).join('\n') + '\n\n' +
                'Guidelines:\n' +
                '- Ask one question at a time\n' +
                '- Be professional but friendly\n' +
                '- Provide brief feedback after each answer\n' +
                '- After all questions, thank the candidate and end the interview';

            console.log('System prompt:', systemPrompt);

            // Start the VAPI call
            const call = await vapi.start({
                model: {
                    provider: 'openai',
                    model: 'gpt-4',
                    systemPrompt: systemPrompt,
                    temperature: 0.7,
                    maxTokens: 150
                },
                voice: {
                    provider: 'playht',
                    voiceId: 'jennifer',
                    speed: 1.0
                },
                firstMessage: `Hello ${interviewData?.candidateName || 'there'}, thank you for joining this interview for the ${interviewData?.job_title || 'position'} today. Let's get started!`,
                endCallFunctionEnabled: true,
                endCallMessage: 'Thank you for your time. The interview is now complete.',
                onCallStart: () => {
                    console.log('Call started');
                    setIsCallActive(true);
                },
                onCallEnd: () => {
                    console.log('Call ended');
                    setIsCallActive(false);
                },
                onError: (error) => {
                    console.error('VAPI Error:', error);
                    setIsCallActive(false);
                },
                onMessage: (message) => {
                    console.log('Message received:', message);
                },
                onSpeechStart: () => {
                    console.log('AI is speaking');
                    setIsAISpeaking(true);
                },
                onSpeechEnd: () => {
                    console.log('AI stopped speaking');
                    setIsAISpeaking(false);
                },
                onSpeechUpdate: (speech) => {
                    // This will help track when the user is speaking
                    if (speech.isSpeaking) {
                        setIsUserSpeaking(true);
                    } else {
                        setIsUserSpeaking(false);
                    }
                }
            });

            console.log('Call started successfully:', call);
            return call;
        } catch (error) {
            console.error('Failed to start call:', error);
            setIsCallActive(false);
            throw error;
        }
    }

    useEffect(() => {
        if (interviewData && vapi && callStatus === 'connecting') {
            startCall();
        }
    }, [interviewData, vapi, callStatus]);

    return (
        <VantaBackground>
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
                <div className="relative w-full max-w-4xl">
                    <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30 -z-10'></div>
                    <div className='relative bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl w-full'>
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                AI Interview in Progress
                            </h1>
                            <p className="text-sm text-white/60">Your interview session has started</p>
                        </div>

                        {/* Interview Info */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex items-center justify-center gap-8 mb-6">
                                    {/* Interviewer Avatar */}
                                    <div className="flex flex-col items-center">
                                        <div className={`relative w-24 h-24 rounded-full overflow-hidden border-2 ${isAISpeaking ? 'border-blue-400 animate-pulse' : 'border-blue-400/30'} mb-2 transition-all duration-300`}>
                                            <Image 
                                                src={interviewData?.image || '/login.png'}
                                                alt="Interviewer"
                                                fill
                                                className={`object-cover ${isAISpeaking ? 'scale-105' : 'scale-100'} transition-transform duration-300`}
                                            />
                                            {isAISpeaking && (
                                                <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping"></div>
                                            )}
                                        </div>
                                        <span className="text-sm text-white/60">Interviewer</span>
                                    </div>

                                    {/* Candidate Avatar */}
                                    <div className="flex flex-col items-center">
                                        <div className={`relative w-24 h-24 rounded-full overflow-hidden border-2 ${isUserSpeaking ? 'border-purple-400 animate-pulse' : 'border-purple-400/30'} mb-2 transition-all duration-300`}>
                                            <div className={`w-full h-full ${isUserSpeaking ? 'bg-purple-500/40' : 'bg-purple-500/20'} flex items-center justify-center transition-colors duration-300`}>
                                                <span className={`text-2xl font-bold text-white ${isUserSpeaking ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
                                                    {interviewData?.candidateName?.[0]?.toUpperCase() || 'C'}
                                                </span>
                                            </div>
                                            {isUserSpeaking && (
                                                <div className="absolute inset-0 rounded-full bg-purple-400/20 animate-ping"></div>
                                            )}
                                        </div>
                                        <span className="text-sm text-white/60">
                                            {interviewData?.candidateName || 'You'}
                                        </span>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-semibold text-white mb-2">{interviewData?.job_title || 'Interview'}</h2>
                                <div className="flex items-center gap-2 text-blue-400 mb-4">
                                    <Timer className="h-5 w-5" />
                                    <span>{interviewData?.duration || '30 min'}</span>
                                </div>
                                <div className="w-full max-w-md bg-white/5 rounded-lg p-4 mb-6">
                                    <p className="text-white/80 text-center">
                                        {interviewData?.job_description || 'Technical Interview in progress'}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center gap-6 mt-8">
                                <button 
                                    onClick={() => {
                                        if (vapi) {
                                            vapi.setMuted(!isMuted);
                                            setIsMuted(!isMuted);
                                        }
                                    }}
                                    className={`flex flex-col items-center p-4 rounded-xl transition-colors border ${
                                        isMuted 
                                            ? 'bg-red-500/20 border-red-500/30' 
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}>
                                    <Mic className={`h-8 w-8 mb-2 ${isMuted ? 'text-red-400' : 'text-blue-400'}`} />
                                    <span className="text-sm">{isMuted ? 'Unmute' : 'Mute'}</span>
                                </button>
                                <button 
                                    onClick={() => {
                                        if (vapi) {
                                            vapi.stop();
                                            setCallStatus('ended');
                                            if (callTimerRef.current) {
                                                clearInterval(callTimerRef.current);
                                            }
                                        }
                                    }}
                                    className="flex flex-col items-center p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/20">
                                    <Phone className="h-8 w-8 text-red-400 mb-2" />
                                    <span className="text-sm">End Call</span>
                                </button>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="text-center space-y-4">
                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                                callStatus === 'active' ? 'bg-green-500/10 text-green-400' :
                                callStatus === 'connecting' ? 'bg-yellow-500/10 text-yellow-400' :
                                callStatus === 'error' ? 'bg-red-500/10 text-red-400' :
                                'bg-gray-500/10 text-gray-400'
                            }`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${
                                    callStatus === 'active' ? 'bg-green-400' :
                                    callStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                                    callStatus === 'error' ? 'bg-red-400' : 'bg-gray-400'
                                }`}></span>
                                {callStatus === 'active' ? 'Interview in Progress' :
                                callStatus === 'connecting' ? 'Connecting...' :
                                callStatus === 'error' ? 'Connection Error' : 'Call Ended'}
                            </div>
                            {callStatus === 'active' && (
                                <div className="text-sm text-white/60">
                                    Duration: {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </VantaBackground>
    );
}
