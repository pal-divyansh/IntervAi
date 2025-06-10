'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Loader2, Star, XCircle, MessageSquare } from 'lucide-react';
import VantaBackground from '@/components/VantaBackground';
import Link from 'next/link';
import { supabase } from '@/app/services/supabaseClient';

export default function CompletedPage() {
    const { interview_id } = useParams();
    const router = useRouter();
    
    const [feedback, setFeedback] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            if (!interview_id) return;
            
            try {
                setIsLoading(true);
                
                // Fetch feedback from interview-feedback table
                const { data: feedbackData, error: feedbackError } = await supabase
                    .from('interview-feedback')
                    .select('*')
                    .eq('interview_id', interview_id);
                
                if (feedbackError) throw feedbackError;
                
                // If we have feedback data, parse the feedback
                if (feedbackData && feedbackData.length > 0) {
                    const feedback = feedbackData[0];
                    try {
                        // Handle different feedback formats
                        if (typeof feedback.feedback === 'string') {
                            // Try to parse if it's a JSON string
                            try {
                                feedback.parsedFeedback = JSON.parse(feedback.feedback);
                            } catch (e) {
                                // If it's not JSON, use it as the overall feedback
                                feedback.parsedFeedback = {
                                    overall_feedback: feedback.feedback,
                                    overall_rating: 0,
                                    strengths: [],
                                    areas_for_improvement: []
                                };
                            }
                        } else if (typeof feedback.feedback === 'object' && feedback.feedback !== null) {
                            // If it's already an object, use it directly
                            feedback.parsedFeedback = feedback.feedback;
                        } else {
                            // Fallback for any other case
                            feedback.parsedFeedback = {
                                overall_feedback: 'No feedback content available',
                                overall_rating: 0,
                                strengths: [],
                                areas_for_improvement: []
                            };
                        }
                        
                        // Ensure all required fields exist
                        feedback.parsedFeedback = {
                            overall_feedback: feedback.parsedFeedback.overall_feedback || 'No feedback provided',
                            overall_rating: Number(feedback.parsedFeedback.overall_rating) || 0,
                            strengths: Array.isArray(feedback.parsedFeedback.strengths) ? 
                                feedback.parsedFeedback.strengths : [],
                            areas_for_improvement: Array.isArray(feedback.parsedFeedback.areas_for_improvement) ? 
                                feedback.parsedFeedback.areas_for_improvement : []
                        };
                    } catch (e) {
                        console.warn('Error processing feedback:', e);
                        feedback.parsedFeedback = {
                            overall_feedback: 'Error loading feedback',
                            overall_rating: 0,
                            strengths: [],
                            areas_for_improvement: []
                        };
                    }
                    setFeedback(feedback);
                } else {
                    setFeedback(null);
                }
                
            } catch (err) {
                console.error('Error fetching feedback:', err);
                setError(err.message || 'Failed to load interview feedback');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchFeedback();
    }, [interview_id]);
    
    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <Star 
                key={i} 
                className={`h-5 w-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} 
            />
        ));
    };

    if (isLoading) {
        return (
            <VantaBackground>
                <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                    <div className="relative w-full max-w-4xl">
                        <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30 -z-10'></div>
                        <div className='relative bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl w-full text-center'>
                            <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                            <p className="text-white/80">Loading your interview feedback...</p>
                        </div>
                    </div>
                </div>
            </VantaBackground>
        );
    }

    if (error) {
        return (
            <VantaBackground>
                <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                    <div className="relative w-full max-w-2xl">
                        <div className='absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl blur opacity-30 -z-10'></div>
                        <div className='relative bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm p-8 rounded-2xl border border-red-500/20 shadow-2xl w-full text-center'>
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 mb-4">
                                <AlertCircle className="h-8 w-8 text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Error Loading Feedback</h2>
                            <p className="text-red-300/80 mb-6">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center px-6 py-2 rounded-lg bg-red-600/90 hover:bg-red-500 text-white font-medium transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </VantaBackground>
        );
    }
    
    if (!feedback) {
        return (
            <VantaBackground>
                <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                    <div className="relative w-full max-w-2xl">
                        <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30 -z-10'></div>
                        <div className='relative bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl w-full text-center'>
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/10 mb-4">
                                <AlertCircle className="h-8 w-8 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">No Feedback Available</h2>
                            <p className="text-white/60 mb-6">We couldn't find any feedback for this interview.</p>
                            <button
                                onClick={() => router.back()}
                                className="inline-flex items-center px-6 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-500 text-white font-medium transition-colors"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </VantaBackground>
        );
    }

    return (
        <VantaBackground>
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
                <div className="relative w-full max-w-4xl">
                    <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30 -z-10'></div>
                    <div className='relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl w-full'>
                        <div className="space-y-8">
                            <div className="text-center mb-8">
                                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-500/20 mb-6">
                                    <CheckCircle className="h-12 w-12 text-green-400" />
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    Interview Feedback
                                </h1>
                                <p className="text-white/80">
                                    Here's the detailed feedback on your interview performance.
                                </p>
                            </div>

                            {/* Overall Rating */}
                            <div className="bg-white/5 border border-white/5 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <Star className="h-5 w-5 mr-2 text-yellow-400" />
                                    Overall Rating
                                </h3>
                                <div className="flex items-center">
                                    <div className="flex mr-4">
                                        {renderStars(feedback.parsedFeedback?.rating?.overall || 0)}
                                    </div>
                                    <span className="text-white/80">
                                        {feedback.parsedFeedback?.rating?.overall ? `${feedback.parsedFeedback.rating.overall}/5` : 'Not rated'}
                                    </span>
                                </div>
                            </div>

                            {/* Individual Ratings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                                    <h4 className="text-sm font-medium text-white/70 mb-2">Technical Skills</h4>
                                    <div className="flex items-center">
                                        <div className="flex mr-2">
                                            {renderStars(feedback.parsedFeedback?.rating?.technical_skills || 0)}
                                        </div>
                                        <span className="text-sm text-white/60">
                                            {feedback.parsedFeedback?.rating?.technical_skills || 0}/5
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                                    <h4 className="text-sm font-medium text-white/70 mb-2">Communication</h4>
                                    <div className="flex items-center">
                                        <div className="flex mr-2">
                                            {renderStars(feedback.parsedFeedback?.rating?.communication || 0)}
                                        </div>
                                        <span className="text-sm text-white/60">
                                            {feedback.parsedFeedback?.rating?.communication || 0}/5
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                                    <h4 className="text-sm font-medium text-white/70 mb-2">Problem Solving</h4>
                                    <div className="flex items-center">
                                        <div className="flex mr-2">
                                            {renderStars(feedback.parsedFeedback?.rating?.problem_solving || 0)}
                                        </div>
                                        <span className="text-sm text-white/60">
                                            {feedback.parsedFeedback?.rating?.problem_solving || 0}/5
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                                    <h4 className="text-sm font-medium text-white/70 mb-2">Experience</h4>
                                    <div className="flex items-center">
                                        <div className="flex mr-2">
                                            {renderStars(feedback.parsedFeedback?.rating?.experience || 0)}
                                        </div>
                                        <span className="text-sm text-white/60">
                                            {feedback.parsedFeedback?.rating?.experience || 0}/5
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-white/5 border border-white/5 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
                                    Summary
                                </h3>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-white/80">{feedback.parsedFeedback?.summary || 'No summary available'}</p>
                                </div>
                            </div>

                            {/* Recommendation */}
                            {feedback.parsedFeedback?.is_recommended !== undefined && (
                                <div className="bg-white/5 border border-white/5 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                        {feedback.parsedFeedback.is_recommended ? (
                                            <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                                        ) : (
                                            <XCircle className="h-5 w-5 mr-2 text-red-400" />
                                        )}
                                        {feedback.parsedFeedback.is_recommended ? 'Recommended' : 'Not Recommended'}
                                    </h3>
                                    {feedback.parsedFeedback.recommendation_message && (
                                        <div className="prose prose-invert max-w-none">
                                            <p className="text-white/80">{feedback.parsedFeedback.recommendation_message}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Strengths */}
                            {feedback.parsedFeedback?.strengths?.length > 0 && (
                                <div className="bg-white/5 border border-white/5 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                        <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                                        Key Strengths
                                    </h3>
                                    <ul className="space-y-2">
                                        {feedback.parsedFeedback.strengths.map((strength, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckCircle className="h-4 w-4 mt-1 mr-2 text-green-400 flex-shrink-0" />
                                                <span className="text-white/80">{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Areas for Improvement */}
                            {feedback.parsedFeedback?.areas_for_improvement?.length > 0 && (
                                <div className="bg-white/5 border border-white/5 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                        <XCircle className="h-5 w-5 mr-2 text-red-400" />
                                        Areas for Improvement
                                    </h3>
                                    <ul className="space-y-2">
                                        {feedback.parsedFeedback.areas_for_improvement.map((area, index) => (
                                            <li key={index} className="flex items-start">
                                                <XCircle className="h-4 w-4 mt-1 mr-2 text-red-400 flex-shrink-0" />
                                                <span className="text-white/80">{area}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="pt-4 border-t border-white/5 text-center">
                                <Link 
                                    href="/dashboard"
                                    className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:opacity-90 transition-opacity"
                                >
                                    Back to Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </VantaBackground>
    );
}
