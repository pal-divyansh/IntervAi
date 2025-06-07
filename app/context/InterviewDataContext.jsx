import React, { createContext } from 'react';

export const InterviewDataContext = createContext();

export const InterviewDataProvider = ({ children }) => {
    const [interviewData, setInterviewData] = React.useState(null);

    return (
        <InterviewDataContext.Provider value={{ interviewData, setInterviewData }}>
            {children}
        </InterviewDataContext.Provider>
    );
};