import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";
import Block from "@/models/Block";
import dbConnect from "@/lib/mongoose";

export async function GET(req: Request) {
  await dbConnect();
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("No Authorization header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("No token found in Authorization header", authHeader);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data, error } = await supabase.auth.getUser(token);
   
    if (error || !data?.user) {
      console.log("Supabase user error", error, data);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = data.user;
    const blocks = await Block.find({ userId: user.id }).sort({ startAt: -1 });
    console.log("Fetched blocks:", blocks);
    return NextResponse.json({ blocks });
  } catch (err) {
    console.error("API error in GET /api/blocks/get:", err);
    return NextResponse.json({ error: "Server error", details: String(err) }, { status: 500 });
  }
}
