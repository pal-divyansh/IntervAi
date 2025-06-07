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

export default QUESTIONS_PROMPT;