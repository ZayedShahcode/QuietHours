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
        const {error}  = await supabase.auth.signUp({
            email,
            password
        });
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
        <div>
            <input 
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
             />
             <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
             />
             <button onClick={handleSignUp}>Sign Up</button>
             <button onClick={handleSignIn}>Sign In</button>
             <p>{message}</p>
        </div>
    )
}