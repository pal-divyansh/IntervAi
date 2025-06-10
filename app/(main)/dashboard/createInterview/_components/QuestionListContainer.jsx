"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function QuestionListContainer({ questions, loading, onFinish }) {
    const [saveLoading, setSaveLoading] = useState(false);
    return (
        <div className="space-y-6">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Generated Interview Questions</h2>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : questions && questions.length > 0 ? (
                    <ul className="space-y-4">
                        {questions.map((item, index) => (
                            <li key={index} className="p-4 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-lg border border-white/5 shadow-lg">
                                <div className="flex items-start">
                                    <span className="w-24 flex-shrink-0 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full text-center">
                                        {item.type}
                                    </span>
                                    <p className="text-white/90 ml-4">{item.question}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-10 text-white/60">
                        No questions generated. Please try again.
                    </div>
                )}
            </div>
            
            <div className="flex justify-end mt-8 mb-6 px-6">
                <Button 
                    onClick={() => {
                        setSaveLoading(true);
                        onFinish();
                        setSaveLoading(false);
                    }} 
                    disabled={saveLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg 
                               transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/20"
                >
                    <span className="flex items-center gap-2">
                         Create Interview Link & Finish 
                        {saveLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    </span>
                </Button>
            </div>
        </div>
    );
}
