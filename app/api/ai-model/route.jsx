import OpenAI from "openai";
import QUESTIONS_PROMPT from "../../services/Constants";
export async function POST(req) {
    const {jobPosition, jobDescription, duration, interviewType} = await req.json();
    try{
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
    } catch(error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to generate questions',
            details: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
