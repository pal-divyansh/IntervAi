"use client";
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import FormContainer from './_components/FormContainer';
import QuestionList from './_components/QuestionList';
import InterviewLink from './_components/InterviewLink';

function CreateInterview() {
    const router = useRouter();
    const [step, setStep] = React.useState(1);
    const [interview_id, setInterview_id] = React.useState('');
    const [formData, setFormData] = React.useState({
        jobPosition: '',
        jobDescription: '',
        duration: '',
        interviewType: null
    });
    const onHandleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }
    const isFormValid = () => {
        return (
            formData.jobPosition.trim() !== '' &&
            formData.jobDescription.trim() !== '' &&
            formData.duration !== '' &&
            formData.interviewType !== null
        );
    };

    const handleNextStep = () => {
        if (isFormValid()) {
            setStep(prev => prev + 1);
        }
    }
    const handlePreviousStep = () => {
        setStep(prev => prev - 1);
    }
    const onCreateLink = (interview_id) => {
        setInterview_id(interview_id);
        setStep(3);
    }

    return (
        <div className='relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
            {/* Back button and title */}
            <div className='mb-8'>
                <div className='flex items-center gap-4 mb-2'>
                    <button 
                        onClick={() => router.push('/dashboard')} 
                        className='p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/80 hover:text-white'
                        aria-label='Go to dashboard'
                    >
                        <ArrowLeft className='h-5 w-5' />
                    </button>
                    <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                        Create New Interview
                    </h1>
                </div>
                <p className='text-white/70 pl-14 text-sm'>
                    Set up your interview by providing the necessary details
                </p>
            </div>
            
            {/* Progress bar */}
            <div className='mb-10 px-2'>
                <div className='flex justify-between text-sm text-white/70 mb-2'>
                    <span>Step {step} of 3</span>
                    <span>{Math.round(step * 33.33)}% Complete</span>
                </div>
                <Progress 
                    value={step * 33.33} 
                    className='h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500'
                />
            </div>
            
            {/* Form container */}
            <div className='relative'>
                <div className='absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30'></div>
                <div className='relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden'>
                    {step===1?<FormContainer formData={formData} onHandleInputChange={onHandleInputChange} handleNextStep={handleNextStep} isFormValid={isFormValid()}/>: step===2?<QuestionList formData={formData} onCreateLink={onCreateLink} onHandleInputChange={onHandleInputChange} handleNextStep={handleNextStep} handlePreviousStep={handlePreviousStep}/>:step===3?<InterviewLink interview_id={interview_id} formData={formData}/> :null }
                </div>
            </div>
        </div>
    );
}

export default CreateInterview;