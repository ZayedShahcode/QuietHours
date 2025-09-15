"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseServer"; 

export interface Block {
  _id: string;
  startAt: string; 
  endAt: string;
  timezone: string;
}

interface BlockFormProps {
  blocks: Block[];
  setBlocks: (blocks: Block[]) => void;
}

export default function BlockForm({ blocks, setBlocks }: BlockFormProps) {
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;
    if (!token) {
      setStatus("You must be logged in");
      return;
    }

    const res = await fetch("/api/blocks/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        startAt,
        endAt,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setStatus("Block Created!");
      setBlocks([...blocks, data.block]);
      setStartAt("");
      setEndAt("");
    } else {
      const err = await res.json();
      setStatus("Error: " + (err.error || "Unknown error"));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto bg-white p-8 rounded shadow-md mt-10"
    >
      <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">
        Create Quiet Hour Block
      </h1>
      <div>
        <label className="block mb-1 text-gray-700">Start time</label>
        <input
          type="datetime-local"
          value={startAt}
          onChange={(e) => setStartAt(e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block mb-1 text-gray-700">End time</label>
        <input
          type="datetime-local"
          value={endAt}
          onChange={(e) => setEndAt(e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full"
      >
        Create Block
      </button>
      <p className="text-center text-sm text-gray-500">{status}</p>
    </form>
  );
}
