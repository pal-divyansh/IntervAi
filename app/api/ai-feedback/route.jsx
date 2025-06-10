import React from 'react';
import { FEEDBACK_PROMPT } from '../../services/Constants';
import OpenAI from "openai";
import { supabase } from '../../services/supabaseClient';
export async function POST(request) {   
    console.log('Received request to /api/ai-feedback');
    let requestBody;
    
    try {
        requestBody = await request.json();
        console.log('Request body:', JSON.stringify(requestBody, null, 2));
    } catch (e) {
        console.error('Error parsing request body:', e);
        return new Response(JSON.stringify({ 
            error: 'Invalid JSON in request body',
            details: e.message
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    
    const { conversation: conversationRaw, interview_id } = requestBody;
    
    // Validate required fields
    if (!interview_id) {
        return new Response(JSON.stringify({ 
            error: 'Missing required field',
            details: 'interview_id is required'
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Fetch interview details from Supabase
    let userName = 'Interviewee';
    let userEmail = 'no-email@example.com';
    let conversation = Array.isArray(conversationRaw) ? conversationRaw : [];

    try {
        // Fetch the interview record
        const { data: interview, error } = await supabase
            .from('Interviews')
            .select('user_email, user_name')
            .eq('id', interview_id)
            .single();

        if (error) throw error;
        
        if (interview) {
            userEmail = interview.user_email || userEmail;
            userName = interview.user_name || userName;
            console.log(`Fetched interview details - Name: ${userName}, Email: ${userEmail}`);
        } else {
            console.warn(`No interview found with id: ${interview_id}`);
        }
    } catch (error) {
        console.error('Error fetching interview details:', error);
        // Continue with default values if there's an error
    }
    
    // No need to check for missing fields as we have defaults
    
    // Log conversation details for debugging
    console.log('Processing feedback request with conversation length:', conversation.length);
    if (conversation.length === 0) {
        console.warn('Conversation is empty. Feedback will be generated without conversation context.');
    }
    
    const FINAL_PROMPT = FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(conversation));
    
    try {
        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
          })
          const completion = await openai.chat.completions.create({
            model: "google/gemma-2-9b-it:free",
            messages: [
              { role: "user", content: FINAL_PROMPT }
            ],
          });
          
          const feedbackContent = completion.choices[0]?.message?.content || 'No feedback generated';
          
          // Return the generated feedback without saving it
          return new Response(JSON.stringify({
            success: true,
            feedback: feedbackContent
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
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