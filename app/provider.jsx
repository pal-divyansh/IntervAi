"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';
import { useRouter } from 'next/navigation';

export const UserDetailContext = createContext();

function Provider({ children }) {
    const [user, setUser] = useState();
    const router = useRouter();
    useEffect(() => {
        CreateNewUser()
    }, [])

    // ADDED: After login, redirect to intended path if present
    useEffect(() => {
        if (user && typeof window !== 'undefined') {
            const intended = window.sessionStorage.getItem('intendedPath');
            if (intended && window.location.pathname !== intended) {
                window.sessionStorage.removeItem('intendedPath');
                router.replace(intended);
            }
        }
    }, [user, router]);

    const CreateNewUser = () => {
        // if user already exist
        supabase.auth.getUser().then(async({ data: { user } }) => {
            let {data: Users, error} = await supabase
            .from('Users')
            .select('*')
            .eq('email', user?.email)

            console.log(Users)

            // if user not exist
            if (Users.length === 0) {
                const {data, error} = await supabase.from('Users').insert({
                    email: user?.email,
                    name: user?.user_metadata.name,
                    image: user?.user_metadata.avatar_url
                })
                console.log(data, error)
                setUser(data)
                return;
            }
            setUser(Users[0])
        })
    }
    return (
        <UserDetailContext.Provider value={{ user, setUser }}>
            {children}
        </UserDetailContext.Provider>
    );
}

export default Provider;
export const useUser = () => {
    const context = useContext(UserDetailContext);
    if (!context) {
        throw new Error('useUser must be used within a UserDetailProvider');
    }
    return context;
}