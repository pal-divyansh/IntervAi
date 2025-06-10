import OpenAI from "openai";
import { QUESTIONS_PROMPT } from "@/app/services/Constants";

console.log('API Key:', process.env.OPENROUTER_API_KEY ? 'Key exists' : 'Missing API Key');
export async function POST(req) {
    try {
        const body = await req.json();
        console.log('Request body:', JSON.stringify(body, null, 2));
        
        const { jobPosition, jobDescription, duration, interviewType } = body;
        
        if (!jobPosition || !jobDescription || !duration || !interviewType) {
            console.error('Missing required fields:', { jobPosition, jobDescription, duration, interviewType });
            return new Response(JSON.stringify({ 
                error: 'Missing required fields',
                required: ['jobPosition', 'jobDescription', 'duration', 'interviewType']
            }), { status: 400 });
        }
        
        if (!process.env.OPENROUTER_API_KEY) {
            console.error('Missing OPENROUTER_API_KEY environment variable');
            return new Response(JSON.stringify({ 
                error: 'Server configuration error',
                details: 'API key not configured'
            }), { status: 500 });
        }
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
      })
      const completion = await openai.chat.completions.create({
        model: "google/gemma-2-9b-it:free",
        messages: [
          { role: "user", content: QUESTIONS_PROMPT.replace("{{jobTitle}}", jobPosition).replace("{{jobDescription}}", jobDescription).replace("{{duration}}", duration).replace("{{type}}", interviewType) }
        ],
      })
      const responseContent = completion.choices[0].message.content;
      
      // Try to extract JSON from markdown code blocks
      const jsonMatch = responseContent.match(/```(?:json)?\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : responseContent;
      
      // Clean up the string and extract the array
      try {
          // Remove any variable assignment (e.g., interviewQuestions = )
          const cleanJsonString = jsonString.replace(/^\s*\w+\s*=\s*/, '').trim();
          const parsedContent = JSON.parse(cleanJsonString);
          
          // If we have an interviewQuestions property, use that, otherwise use the parsed content directly
          const questions = Array.isArray(parsedContent.interviewQuestions) 
              ? parsedContent.interviewQuestions 
              : Array.isArray(parsedContent) ? parsedContent : [];
              
          return new Response(JSON.stringify({ questions }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
          });
      } catch (parseError) {
          // If parsing fails, return the raw content
          return new Response(JSON.stringify({ 
              error: 'Invalid response format from AI',
              rawResponse: responseContent 
          }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
          });
      }
    } catch (error) {
        console.error('API Error:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code
        });
        
        return new Response(JSON.stringify({ 
            error: 'Failed to generate questions',
            details: error.message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
