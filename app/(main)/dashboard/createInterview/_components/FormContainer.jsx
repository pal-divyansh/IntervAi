"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Briefcase, FileText, Clock, Settings, Users } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

// Interview types for selection
const InterviewType = [
    { icon: Briefcase, title: "Technical" },
    { icon: FileText, title: "Behavioral" },
    { icon: Clock, title: "Experience" },
    { icon: Settings, title: "Problem Solving" },
    { icon: Users, title: "Leadership" }
];

function FormContainer({ formData, onHandleInputChange, handleNextStep, isFormValid }) {
    useEffect(() => {
        console.log("Form data updated:", formData);
        if (formData.interviewType !== null && formData.interviewType !== undefined && InterviewType[formData.interviewType]) {
            console.log("Selected type title:", InterviewType[formData.interviewType].title);
        }
    }, [formData]);
    
    return (
        <div className='relative'>
            {/* Decorative elements */}
            <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30'></div>
            
            <div className='relative bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl'>
                <div className='space-y-8'>
                    {/* Header */}
                    <div className='space-y-1'>
                        <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent'>
                            Interview Details
                        </h2>
                        <p className='text-sm text-white/60'>
                            Fill in the details to create your custom interview
                        </p>
                    </div>

                    {/* Form fields */}
                    <div className='space-y-6'>
                        {/* Job Position */}
                        <div className='space-y-2 group'>
                            <div className='flex items-center gap-2'>
                                <Briefcase className='h-4 w-4 text-blue-400' />
                                <label htmlFor="position" className='text-sm font-medium text-white/90'>
                                    Job Position
                                </label>
                            </div>
                            <div className='relative'>
                                <Input 
                                    id="position"
                                    value={formData.jobPosition}
                                    onChange={(e)=>onHandleInputChange('jobPosition',e.target.value)}
                                    placeholder='e.g. Senior Frontend Developer' 
                                    className='w-full p-3 pl-10 bg-white/5 border border-white/10 text-white/90 placeholder-white/30 rounded-xl 
                                            focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300
                                            hover:border-white/20 group-hover:shadow-lg group-hover:shadow-blue-500/10'
                                />
                                <Briefcase className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50' />
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className='space-y-2 group'>
                            <div className='flex items-center gap-2'>
                                <FileText className='h-4 w-4 text-purple-400' />
                                <label htmlFor="description" className='text-sm font-medium text-white/90'>
                                    Job Description
                                </label>
                            </div>
                            <div className='relative'>
                                <Textarea 
                                    id="description" 
                                    value={formData.jobDescription}
                                    onChange={(e)=>onHandleInputChange('jobDescription',e.target.value)}
                                    placeholder='Enter the details of the job, required skills, and responsibilities...' 
                                    className='min-h-[150px] w-full p-3 pl-10 bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl 
                                            focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300
                                            hover:border-white/20 group-hover:shadow-lg group-hover:shadow-purple-500/10'
                                />
                                <FileText className='absolute left-3 top-4 h-4 w-4 text-white/50' />
                            </div>
                        </div>

                        {/* Interview Duration */}
                        <div className='space-y-2 group'>
                            <div className='flex items-center gap-2'>
                                <Clock className='h-4 w-4 text-blue-400' />
                                <label htmlFor="duration" className='text-sm font-medium text-white/90'>
                                    Interview Duration
                                </label>
                            </div>
                            <div className='relative'>
                                <Select value={formData.duration} onValueChange={(value) => onHandleInputChange('duration',value)}>
                                    <SelectTrigger 
                                        className="w-full p-3 pl-10 bg-white/5 border border-white/10 text-white rounded-xl 
                                                focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300
                                                hover:border-white/20 group-hover:shadow-lg group-hover:shadow-blue-500/10"
                                    >
                                        <SelectValue placeholder="Select duration" className='text-white/90' />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900/95 backdrop-blur-sm border border-white/50 text-white">
                                        <SelectItem 
                                            value="15" 
                                            className="hover:bg-white/5 focus:bg-white/40 rounded-lg m-1"
                                        >
                                            15 minutes
                                        </SelectItem>
                                        <SelectItem 
                                            value="30" 
                                            className="hover:bg-white/5 focus:bg-white/40 rounded-lg m-1"
                                        >
                                            30 minutes
                                        </SelectItem>
                                        <SelectItem 
                                            value="45" 
                                            className="hover:bg-white/5 focus:bg-white/40 rounded-lg m-1"
                                        >
                                            45 minutes
                                        </SelectItem>
                                        <SelectItem 
                                            value="60" 
                                            className="hover:bg-white/5 focus:bg-white/40 rounded-lg m-1"
                                        >
                                            60 minutes
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Clock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50' />
                            </div>
                        </div>
                    </div>

                    {/* Interview Type Selection */}
                    <div className='pt-6 border-t border-white/10'>
                        <h2 className='text-lg font-semibold text-white/90 mb-4'>Interview Type</h2>
                        <div className='flex flex-wrap gap-4'>
                            {InterviewType.map((type, index) => {
                                const isSelected = formData.interviewType === index;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => onHandleInputChange('interviewType',index)}
                                        className={`group flex flex-col items-center justify-center w-32 h-28 rounded-xl border transition-all duration-200 shadow-sm px-4 py-3
                                            ${isSelected ? 'bg-blue-600/80 border-blue-400/80 shadow-lg scale-105 cursor-pointer' : 'bg-white/10 border-white/10 hover:bg-blue-500/20 hover:border-blue-400/50 cursor-pointer'}
                                            focus:outline-none focus:ring-2 focus:ring-blue-400`}
                                    >
                                        <type.icon className={`w-8 h-8 mb-2 ${isSelected ? 'text-white' : 'text-blue-400 group-hover:text-blue-500'}`} />
                                        <span className={`font-medium text-base ${isSelected ? 'text-white' : 'text-white/90'}`}>{type.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-8">
                    <Button
                        onClick={handleNextStep}
                        disabled={!isFormValid}
                        className={`bg-gradient-to-r text-white cursor-pointer transition-all duration-300 ${
                            isFormValid 
                                ? 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' 
                                : 'from-gray-500 to-gray-600 opacity-50 cursor-not-allowed'
                        }`}
                    >
                        Generate Questions <ArrowRight className="ml-2" />
                    </Button>
                </div>
            </div>
            
        </div>
    );
}

export default FormContainer;
