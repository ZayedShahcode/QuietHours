'use client';

import { useState } from "react";
import {supabase} from "@/lib/supabaseServer";
import { useRouter } from "next/navigation";

export default function AuthPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message,setMessage] = useState<string | null>(null);

    const router = useRouter();

    async function handleSignUp(){
        const {data,error}  = await supabase.auth.signUp({
            email,
            password
        });
        localStorage.setItem('user',JSON.stringify(data.user));
        localStorage.setItem('session',JSON.stringify(data.session));
        setMessage(error ? error.message : "Check your email for confirmation");
    }

    async function handleSignIn(){
        const {error} = await supabase.auth.signInWithPassword({email,password});

        setMessage(error ? error.message : "Signed in successfully");
        if(!error){
            router.push('/create-block');
        }
    }

    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-blue-600 mb-2 text-center">Sign In / Sign Up</h2>
                <input 
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                    <button onClick={handleSignUp} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full">Sign Up</button>
                    <button onClick={handleSignIn} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full">Sign In</button>
                </div>
                <p className="text-center text-sm text-gray-500">{message}</p>
            </div>
        </div>
    )
}