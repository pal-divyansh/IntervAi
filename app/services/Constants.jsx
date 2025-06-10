import { WalletCards, List, SettingsIcon, LayoutDashboardIcon, Calendar } from "lucide-react";

export const SidebarOptions = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboardIcon
    },
    {
        title: "Schedule Interview",
        path: "/schedule-interview",
        icon: Calendar
    },
    {
        title: "All Interview",
        path: "/all-interviews",
        icon: List
    },
    {
        title: "Billings",
        path: "/billings",
        icon: WalletCards
    },
    {
        title: "Settings",
        path: "/settings",
        icon: SettingsIcon
    }
]
const QUESTIONS_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:
Job Title: {{jobTitle}}
Job Description:{{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}
📝 Your task:
Analyze the job description to identify key responsibilities, required skills, and expected experience.
Generate a list of interview questions depends on interview duration
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life {{type}} interview.
🧩 Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
  question:"",
  type:'Technical/Behavioral/Experince/Problem Solving/Leasership'
},{
  ...
}]
🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`

const FEEDBACK_PROMPT = `You are an AI assistant providing interview feedback. Respond in English only.

Interview Conversation:
{{conversation}}

Please provide detailed feedback on the candidate's performance in the following JSON format. Rate each category from 1-10 and provide constructive feedback in English:

1. Technical Skills (1-10)
2. Communication (1-10)
3. Problem Solving (1-10)
4. Experience (1-10)

Also include a 3-line summary and a clear hiring recommendation.

Respond ONLY with valid JSON in this exact format:

{\n  \"feedback\": {\n    \"rating\": {\n      \"technicalSkills\": 8,\n      \"communication\": 7,\n      \"problemSolving\": 8,\n      \"experience\": 7\n    },\n    \"summary\": \"The candidate demonstrated strong technical abilities and problem-solving skills. Communication was clear and effective. They showed relevant experience for the role.\",\n    \"recommendation\": \"Yes\",\n    \"recommendationMsg\": \"Strong candidate with good technical skills and communication abilities.\"\n  }\n}
`

export { QUESTIONS_PROMPT,FEEDBACK_PROMPT };