'use client';

import React, {useState} from 'react';
import { InterviewDataProvider } from '../context/InterviewDataContext';

function InterviewLayout({ children }) {
    const [interviewData, setInterviewData] = useState(null);
    
    return (
        <InterviewDataProvider value={{ interviewData, setInterviewData }}>
            <div className="min-h-screen bg-gray-50">
                {children}
            </div>
        </InterviewDataProvider>
    );
}

export default InterviewLayout;
