"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseServer"; // client-side

export interface Block {
  _id: string;
  startAt: string;
  endAt: string;
  timezone: string;
}

interface BlockListProps {
  blocks: Block[];
  setBlocks: (blocks: Block[]) => void;
}

export default function BlockList({ blocks, setBlocks }: BlockListProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBlocks() {
      setLoading(true);

      const { data: session } = await supabase.auth.getSession();
      const token = session?.session?.access_token;

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/blocks/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          // convert dates to strings
          const blocksWithStrings: Block[] = (data.blocks || []).map((b: any) => ({
            _id: b._id,
            startAt: b.startAt,
            endAt: b.endAt,
            timezone: b.timezone || "UTC",
          }));
          setBlocks(blocksWithStrings);
        } else {
          const errorData = await res.json();
          console.error("Error fetching blocks:", errorData);
        }
      } catch (err) {
        console.error("Network or server error fetching blocks:", err);
      }

      setLoading(false);
    }

    fetchBlocks();
  }, [setBlocks]);

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Your Blocks</h2>
      {loading ? (
        <p>Loading...</p>
      ) : blocks.length === 0 ? (
        <p className="text-gray-500">No blocks found.</p>
      ) : (
        <ul className="space-y-3">
          {blocks.map((block) => {
            const start = new Date(block.startAt);
            const end = new Date(block.endAt);
            return (
              <li key={block._id} className="border rounded p-3">
                <div className="font-semibold">
                  {start.toLocaleString()} - {end.toLocaleString()}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
