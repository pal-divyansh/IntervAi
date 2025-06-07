import React, { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/services/supabaseClient';
import QuestionListContainer from './QuestionListContainer';
import { v4 as uuidv4 } from 'uuid';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';


function QuestionList({ formData,onCreateLink }) {
    const [loading, setLoading] = React.useState(true);
    const [questions, setQuestions] = React.useState([]);
    const router = useRouter();
    const [saved, setSaved] = React.useState(false);    

    // Check for active session on component mount
    React.useEffect(() => {
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) {
                console.error('No active session found');
                router.push('/login');
            }
        };
        checkSession();
    }, [router]);
    
    const onFinish = async () => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            
            if (authError || !user) {
                console.error('Authentication error:', authError?.message || 'No user logged in');
                router.push('/login');
                return;
            }

            const interviewData = {
                job_title: formData.jobPosition,
                job_description: formData.jobDescription,
                duration: formData.duration,
                job_type: formData.interviewType,
                userEmail: user?.email,
                question_list: JSON.stringify(questions), // Convert array to JSON string
                interview_id: uuidv4(), // Add interview_id as it's required in the schema
                created_at: new Date().toISOString()
            };

            // Insert the interview data
            console.log('Attempting to save to Interviews table with data:', interviewData);
            const { data: insertedData, error: insertError } = await supabase
                .from('Interviews')
                .insert(interviewData)
                .select()
                .single();

            if (insertError) {
                console.error('Error saving interview:', insertError);
                alert(`Failed to save interview: ${insertError.message}`);
                return;
            }

            console.log('Interview saved successfully:', insertedData);
            // Call onCreateLink which will update the step to 3
            onCreateLink(interviewData.interview_id);
        } catch (error) {
            console.error('Error in onFinish:', error);
            // Handle error if needed
        }
    }
    
    useEffect(() => {
        const generateQuestions = async () => {
            try {
                setLoading(true);
                const { jobPosition, jobDescription, duration, interviewType } = formData;
                const response = await axios.post('/api/ai-model', {
                    jobPosition,
                    jobDescription,
                    duration,
                    interviewType
                });
                console.log('API Response:', response.data);
                console.log('Raw API Response:', response.data);
                
                if (response.data && response.data.questions) {
                    let questionsData = [];
                    
                    // Handle different response formats
                    if (Array.isArray(response.data.questions)) {
                        questionsData = response.data.questions;
                    } else if (response.data.questions.interviewQuestions) {
                        questionsData = response.data.questions.interviewQuestions;
                    } else if (typeof response.data.questions === 'object') {
                        // If it's an object but not in expected format, try to convert it
                        questionsData = Object.values(response.data.questions);
                    }
                    
                    // Ensure we have an array of objects with question and type
                    questionsData = questionsData.map(item => ({
                        question: item.question || item.text || item.content || 'No question text',
                        type: item.type || 'General'
                    }));
                    
                    console.log('Processed Questions:', questionsData);
                    setQuestions(questionsData);
                } else if (response.data.error) {
                    console.error('API Error:', response.data.error);
                    if (response.data.rawResponse) {
                        console.log('Raw response:', response.data.rawResponse);
                    }
                }
            } catch (error) {
                console.error('Error generating questions:', error);
            } finally {
                setLoading(false);
            }

        };

        generateQuestions();
    }, [formData]);
    return (
        <div>
        <QuestionListContainer 
            questions={questions}
            loading={loading}
            onFinish={onFinish}
        />
        
        </div>
    );
}

export default QuestionList;
