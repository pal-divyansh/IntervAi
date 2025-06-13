import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/auth-code-error`
      );
    }
    
    // Check if user exists in your users table
    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('*')
      .eq('email', data.user.email)
      .single();
    
    // If user doesn't exist, create a new user
    if (!userData && !userError) {
      const { error: insertError } = await supabase
        .from('Users')
        .insert([
          { 
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email.split('@')[0],
            image: data.user.user_metadata?.avatar_url || null
          }
        ]);
      
      if (insertError) {
        console.error('Error creating user:', insertError);
      }
    }
  }
  
  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + '/dashboard');
}
