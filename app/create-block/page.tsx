'use client'

// import {supabase} from "@/lib/supabaseServer";
import BlockForm from "./BlockForm";
import BlockList from "./BlockList";
import { useState } from "react";

export interface Block {
  _id: string;
  startAt: string;
  endAt: string;
  timezone: string;
}

export default function CreateBlockPage(){
    const [blocks, setBlocks] = useState<Block[]>([]);
    
    return (
        <div className="flex flex-row items-start justify-center min-h-screen bg-gray-100 gap-8 p-8">
            <div className="w-full max-w-md">
                <BlockForm  blocks={blocks} setBlocks={setBlocks} />
            </div>
            <div className="w-full max-w-lg">
                <BlockList  blocks={blocks} setBlocks={setBlocks}/>
            </div>
        </div>
    );
}