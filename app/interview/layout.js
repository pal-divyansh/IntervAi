'use client';

import React, {useState} from 'react';
import Header from "./_components/Header";
import { InterviewDataProvider } from '../context/InterviewDataContext';


function InterviewLayout({ children }) {
    const [interviewData, setInterviewData] = useState(null);
    return (
        <InterviewDataProvider value={{ interviewData, setInterviewData }}>
            <div>
                <Header />
                {children}
            </div>
        </InterviewDataProvider>
    );
}

export default InterviewLayout;
