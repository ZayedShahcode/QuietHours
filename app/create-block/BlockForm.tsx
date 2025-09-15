'use client';

import { useState } from "react";
import {supabase} from "@/lib/supabaseServer";

export default function BlockForm({user}: {user: any}){
    const [startAt, setStartAt] = useState("");
    const [endAt, setEndAt] = useState("");
    const [status,setStatus] = useState("");

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        const {data: session} =  await supabase.auth.getSession();
        const token = session?.session?.access_token;
        if(!token){
            setStatus("You must be logged in");
            return;
        }

        const res = await fetch("/api/blocks/create",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({startAt, endAt, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone})
        });

        if(res.ok){
            setStatus("Block Created!");
            setStartAt("");
            setEndAt("");

        }
        else{
            const err = await res.json();
            setStatus("Error: " + (err.error || "Unknown error"));
        }
    }

    return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <h1 className="text-xl font-semibold">Create Quiet Hour Block</h1>
      <div>
        <label>Start time</label>
        <input
          type="datetime-local"
          value={startAt}
          onChange={e => setStartAt(e.target.value)}
          required
        />
      </div>
      <div>
        <label>End time</label>
        <input
          type="datetime-local"
          value={endAt}
          onChange={e => setEndAt(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Block</button>
      <p>{status}</p>
    </form>
  );
}