"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { supabase } from './services/supabaseClient';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // Redirect authenticated users away from login page
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const intended = window.sessionStorage.getItem('intendedPath');
        if (intended && window.location.pathname !== intended) {
          window.sessionStorage.removeItem('intendedPath');
          router.replace(intended);
        } else {
          router.replace('/dashboard');
        }
      }
    });
  }, [router]);

  // Store intended path before login
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // If coming from a protected route, store it
      const params = new URLSearchParams(window.location.search);
      const intended = params.get('redirect') || window.sessionStorage.getItem('intendedPath');
      if (!intended && window.location.pathname !== '/') {
        window.sessionStorage.setItem('intendedPath', window.location.pathname + window.location.search);
      }
    }
  }, []);

  // Handle Google sign-in
  const signInWithGoogle = async () => {
    let redirectTo = `${window.location.origin}/dashboard`;
    // Use intended path if available
    if (typeof window !== 'undefined') {
      const intended = window.sessionStorage.getItem('intendedPath');
      if (intended) {
        redirectTo = `${window.location.origin}${intended}`;
      }
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo
      }
    });
    
    if (error) {
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent w-full h-full"></div>
      </div>
      
      {/* Decorative animated circles */}
      {[...Array(5)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-blue-500/5"
          style={{
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: 'blur(60px)',
            animation: `pulse ${Math.random() * 20 + 10}s infinite alternate`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.3
          }}
        />
      ))}

      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden relative">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/10 -z-10"></div>
          
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-48 h-16">
              <Image 
                src={'/logo.png'} 
                alt="IntervAI Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="w-64 h-48 relative">
              <Image 
                src={'/login.png'} 
                alt="Login Illustration"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Welcome to IntervAI
              </h2>
              <p className="text-blue-100/80">
                Sign in to access your AI-powered interview platform
              </p>
            </div>

            <Button 
              onClick={signInWithGoogle}
              className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:text-white transition-all duration-300 group"
              size="lg"
            >
              <FcGoogle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              <span>Continue with Google</span>
            </Button>

            <p className="text-xs text-center text-blue-100/60 mt-2">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(1.5); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
