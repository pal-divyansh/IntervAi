'use client';

import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { InterviewDataContext } from '@/app/context/InterviewDataContext';
import Image from 'next/image';
import { Mic, Phone, Timer } from 'lucide-react';
import VantaBackground from '@/components/VantaBackground';
import Vapi from '@vapi-ai/web';
import axios from 'axios';

export default function StartPage() {
    const { interviewData } = useContext(InterviewDataContext);
    const { interview_id } = useParams();
    const supabase = createClientComponentClient();
    const [vapi, setVapi] = useState(null);
    const [callStatus, setCallStatus] = useState('connecting'); // 'connecting', 'active', 'ended', 'error'
    const [callDuration, setCallDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isAISpeaking, setIsAISpeaking] = useState(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState(false);
    const callTimerRef = useRef(null);
    const userSpeechRecognition = useRef(null);
    const [conversation, setConversation] = useState([]);
    const router = useRouter();
    const GenerateFeedback = async () => {
        try {
            // Get user info from interviewData or use defaults
            const userName = interviewData?.candidateName || 'Interview Candidate';
            const userEmail = interviewData?.candidateEmail || 'no-email@example.com';
            
            // Get the current conversation state
            const currentConversation = [...conversation];
            
            // If no conversation, add a default message
            if (currentConversation.length === 0) {
                currentConversation.push({
                    role: 'system',
                    content: 'No conversation history available. This might be due to the interview being very short or a technical issue.'
                });
            }
            
            const requestData = { 
                conversation: currentConversation,
                interview_id: interview_id,
                userName: userName,
                userEmail: userEmail
            };
            
            console.log('Sending request to /api/ai-feedback with data:', {
                ...requestData,
                conversationLength: currentConversation.length,
                interviewDataExists: !!interviewData,
                interview_id_type: typeof interview_id,
                userName_type: typeof userName,
                userEmail_type: typeof userEmail
            });
            
            // Call the feedback API
            const result = await axios.post('/api/ai-feedback', requestData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                validateStatus: (status) => status < 500 // Don't throw for 4xx errors
            });
            
            console.log('API Response:', {
                status: result.status,
                statusText: result.statusText,
                data: result.data
            });
            
            if (result.status !== 200) {
                throw new Error(`API Error: ${result.status} - ${JSON.stringify(result.data)}`);
            }
            
            console.log('Feedback API Response:', result.data);
            
            // Parse the feedback content
            let feedbackContent = result.data.feedback || '';
            let parsedFeedback = {
                rating: {
                    technicalSkills: 0,
                    communication: 0,
                    problemSolving: 0,
                    experience: 0
                },
                summary: 'No summary available',
                recommendation: 'No',
                recommendationMsg: 'Could not parse feedback',
                rawFeedback: feedbackContent // Store raw feedback by default
            };

            try {
                // First, try to parse as is (in case it's already a JSON string)
                let parsedData;
                try {
                    parsedData = JSON.parse(feedbackContent);
                } catch (e) {
                    // If direct parse fails, try to extract JSON from markdown code block
                    const jsonMatch = feedbackContent.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
                    if (jsonMatch && jsonMatch[1]) {
                        parsedData = JSON.parse(jsonMatch[1].trim());
                    } else {
                        // Try to find any JSON-like object in the string
                        const jsonInText = feedbackContent.match(/\{[\s\S]*\}/);
                        if (jsonInText) {
                            parsedData = JSON.parse(jsonInText[0]);
                        } else {
                            throw new Error('No valid JSON found in response');
                        }
                    }
                }

                // Handle different response formats
                const feedbackData = parsedData.feedback || parsedData;
                
                // Parse ratings
                const ratingData = feedbackData.rating || {};
                parsedFeedback.rating = {
                    technicalSkills: Number(ratingData.technicalSkills) || 0,
                    communication: Number(ratingData.communication) || 0,
                    problemSolving: Number(ratingData.problemSolving) || 0,
                    experience: Number(ratingData.experience) || 0
                };
                
                // Parse other fields with fallbacks
                parsedFeedback.summary = feedbackData.summary || parsedData.summary || 'No summary available';
                parsedFeedback.recommendation = (feedbackData.recommendation || 'No').toString();
                parsedFeedback.recommendationMsg = feedbackData.recommendationMsg || 
                                                 feedbackData.recommendation_message || 
                                                 'No recommendation message available';
                
            } catch (e) {
                console.warn('Error parsing feedback JSON:', e);
                parsedFeedback.error = `Could not parse feedback: ${e.message}`;
            }
            
            // Log the parsed feedback for debugging
            console.log('Parsed feedback:', parsedFeedback);
            feedbackContent = parsedFeedback;
            
            // Prepare feedback data according to database schema
            try {
                console.log('Preparing feedback data...');
                
                // Create a safe feedback object with all required fields
                const feedbackObj = {
                    // Ratings
                    technical_skills: Number(feedbackContent.rating?.technicalSkills) || 0,
                    communication: Number(feedbackContent.rating?.communication) || 0,
                    problem_solving: Number(feedbackContent.rating?.problemSolving) || 0,
                    experience: Number(feedbackContent.rating?.experience) || 0,
                    
                    // Summary and recommendation
                    summary: String(feedbackContent.summary || 'No summary available').substring(0, 1000),
                    is_recommended: feedbackContent.recommendation === 'Yes',
                    recommendation_message: String(feedbackContent.recommendationMsg || 'No recommendation provided').substring(0, 500),
                    
                    // Raw feedback for reference (truncated)
                    raw_feedback: (typeof feedbackContent.rawFeedback === 'string' 
                        ? feedbackContent.rawFeedback 
                        : JSON.stringify(feedbackContent.rawFeedback || feedbackContent, null, 2)
                    ).substring(0, 3000)
                };

                console.log('Created feedback object:', JSON.stringify(feedbackObj, null, 2));

                // First, check if feedback already exists for this interview
                const { data: existingFeedback, error: fetchError } = await supabase
                    .from('interview-feedback')
                    .select('*')
                    .eq('interview_id', interview_id)
                    .maybeSingle();

                let feedback;
                let feedbackError = null;

                if (fetchError) {
                    console.error('Error checking for existing feedback:', fetchError);
                    feedbackError = fetchError;
                } else if (existingFeedback) {
                    console.log('Updating existing feedback for interview:', interview_id);
                    // Update existing feedback
                    const { data: updatedFeedback, error: updateError } = await supabase
                        .from('interview-feedback')
                        .update({
                            feedback: feedbackObj,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', existingFeedback.id)
                        .select()
                        .single();
                    
                    if (updateError) {
                        feedbackError = updateError;
                    } else {
                        feedback = updatedFeedback;
                    }
                } else {
                    // Insert new feedback
                    const feedbackData = {
                        userName: String(interviewData?.candidateName || 'Unknown User').substring(0, 100),
                        userEmail: String(interviewData?.candidateEmail || 'no-email@example.com').substring(0, 100),
                        interview_id: String(interview_id || 'unknown'),
                        feedback: feedbackObj,
                        created_at: new Date().toISOString()
                    };

                    console.log('Inserting new feedback:', JSON.stringify(feedbackData, null, 2));
                    
                    const { data: newFeedback, error: insertError } = await supabase
                        .from('interview-feedback')
                        .insert(feedbackData)
                        .select()
                        .single();
                    
                    if (insertError) {
                        feedbackError = insertError;
                    } else {
                        feedback = newFeedback;
                    }
                }
                
                if (feedbackError) {
                    console.error('Database insert error:', {
                        message: feedbackError.message,
                        details: feedbackError.details,
                        hint: feedbackError.hint,
                        code: feedbackError.code
                    });
                    
                    // Try with minimal data if full insert fails
                    const minimalData = {
                        'userName': feedbackData.userName,
                        'userEmail': feedbackData.userEmail,
                        'interview_id': feedbackData.interview_id,
                        'feedback': { error: 'Failed to save full feedback', code: feedbackError.code },
                        'created_at': new Date().toISOString()
                    };
                    
                    console.log('Trying minimal data save...');
                    const { data: minFeedback, error: minError } = await supabase
                        .from('interview-feedback')
                        .insert([minimalData])
                        .select();
                    
                    if (minError) {
                        console.error('Minimal save failed:', minError);
                        throw new Error(`Could not save feedback: ${minError.message}`);
                    }
                    
                    console.log('Saved minimal feedback data');
                    return minFeedback;
                }
                
                console.log('✅ Feedback saved successfully');
                return feedback;
                
            } catch (error) {
                console.error('❌ Error in feedback submission:', {
                    message: error.message,
                    stack: error.stack,
                    data: error.response?.data
                });
                
                // Try to save minimal error information
                try {
                    const minimalFeedback = {
                        interview_id: interview_id || 'unknown',
                        userName: (interviewData?.candidateName || 'Unknown User').substring(0, 100),
                        userEmail: (interviewData?.candidateEmail || 'no-email@example.com').substring(0, 100),
                        feedback: {
                            error: 'Failed to save feedback',
                            message: error.message,
                            code: error.code
                        },
                        created_at: new Date().toISOString()
                    };
                    
                    await supabase
                        .from('interview-feedback')
                        .insert([minimalFeedback]);
                        
                    console.log('Saved minimal error information');
                } catch (e) {
                    console.error('Failed to save minimal error information:', e);
                }
                
                throw error; // Re-throw to be caught by the outer catch block
            }

            if (feedbackError) throw feedbackError;

            console.log('Feedback saved successfully:', feedback);
            router.replace(`/interview/${interview_id}/completed`);
        } catch (error) {
            console.error('Error generating feedback:', error);
            // Handle error appropriately
        }
    }

    // Initialize Vapi when component mounts
    useEffect(() => {
        const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
        
        console.log('Initializing VAPI event listeners');
        
        // Set up conversation logging with more detailed logging
        const handleSpeechStart = (speech) => {
            console.log('AI started speaking:', speech);
            setIsAISpeaking(true);
        };

        const handleSpeechEnd = () => {
            console.log('AI stopped speaking');
            setIsAISpeaking(false);
        };
        
        const handleCallEnd = () => {
            console.log('Call ended, generating feedback...');
            console.log('Current conversation state before feedback:', conversation);
            GenerateFeedback();
        };

        // Enhanced message handler with better logging
        const handleMessage = (message) => {
            console.log('Received message event:', message);
            
            // Handle different message formats from VAPI
            let content = message.content || message.transcript || '';
            let role = message.role || (message.type === 'transcript' ? 'user' : 'assistant');
            
            // Clean up the content
            if (typeof content === 'object') {
                content = JSON.stringify(content);
            }
            
            // Ensure we have valid content
            if (!content) {
                console.warn('Empty content in message:', message);
                return;
            }
            
            // Update conversation state
            setConversation(prev => {
                const newConversation = [...prev, { role, content }];
                console.log('Updated conversation:', newConversation);
                return newConversation;
            });
            
            // Log the message
            if (role === 'assistant' || message.speaker === 'assistant') {
                console.log('Interviewer:', content);
            } else if (role === 'user' || message.speaker === 'user') {
                console.log('User:', content);
                setIsUserSpeaking(false);
            } else {
                console.log('System:', content);
            }
        };

        const handleSpeechUpdate = (speech) => {
            console.log('Speech update:', speech);
            if (speech.role === 'user') {
                console.log('User speech update:', speech);
                setIsUserSpeaking(!!speech.isSpeaking);
            }
        };
        
        // Add event listeners once
        vapiInstance.on('speech-start', handleSpeechStart);
        vapiInstance.on('speech-end', handleSpeechEnd);
        vapiInstance.on('call-end', handleCallEnd);
        vapiInstance.on('message', handleMessage);
        vapiInstance.on('speech-update', handleSpeechUpdate);
        
        // Log all events for debugging
        vapiInstance.on('*', (event) => {
            console.log('VAPI Event:', event.type, event);
        });
        
        console.log('VAPI event listeners initialized');

        setVapi(vapiInstance);

        // Cleanup function
        return () => {
            if (vapiInstance) {
                // Remove each event listener individually
                vapiInstance.off('speech-start', handleSpeechStart);
                vapiInstance.off('speech-end', handleSpeechEnd);
                vapiInstance.off('message', handleMessage);
                vapiInstance.off('speech-update', handleSpeechUpdate);
                vapiInstance.stop();
            }
        };
    }, []);

    // ... rest of the code remains the same ...

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
                                    onClick={async () => {
                                        if (vapi) {
                                            try {
                                                await vapi.stop();
                                                setCallStatus('ended');
                                                if (callTimerRef.current) {
                                                    clearInterval(callTimerRef.current);
                                                }
                                                // Navigate to completed page after a short delay
                                                setTimeout(() => {
                                                    router.push(`/interview/${interview_id}/completed`);
                                                }, 1000);
                                            } catch (error) {
                                                console.error('Error stopping call:', error);
                                                // Still navigate even if there's an error stopping
                                                router.push(`/interview/${interview_id}/completed`);
                                            }
                                        } else {
                                            // If vapi isn't available, still navigate
                                            router.push(`/interview/${interview_id}/completed`);
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
