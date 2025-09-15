import {NextResponse,NextRequest} from "next/server";

import dbConnect from "@/lib/mongoose";
import Block from "@/models/Block";
import {supabase} from "@/lib/supabaseServer"

export async function POST(req: NextRequest){
    const authHeader = req.headers.get("Authorization");
    const token =  authHeader?.split(" ")[1];
    
    if(!token){
        return NextResponse.json({error: "Unauthorized! Missing Token"}, {status: 401});
    }
    
    const {data,error} = await supabase.auth.getUser(token);
    if(error || !data.user){
        return NextResponse.json({error: "Unauthorized! Invalid Token"}, {status: 401});
    }
    const user = data.user;

    await dbConnect();
    // await Block.init();

    const {startAt,endAt, timezone} = await req.json();
    if(!startAt || !endAt){
        return NextResponse.json({error: "startAt and endAt are required"}, {status: 400});
    }

    const start = new Date(startAt);
    const end = new Date(endAt);
    if(start>=end){
        return NextResponse.json({error: "startAt must be before endAt"}, {status: 400});
    }

    const overlap = await Block.findOne({
        userId: user.id,
        $and: [
            {startAt: {$lt: end}},
            {endAt: {$gt: start}}
        ]  
    })

    if(overlap){
        return NextResponse.json({error: "Block overlaps with existing block"}, {status: 400});
    }

    const reminderScheduledAt = new Date(start.getTime() - 10*60*1000);


    try{
        const doc = await Block.create({
            userId: user.id,
            userEmail: user.email,
            startAt: start,
            endAt: end,
            timezone: timezone || "UTC",
            reminderScheduledAt,
            reminderSent: false
        });
        return NextResponse.json({block: doc},{status: 201});
        // @ts-ignore
    } catch(err:any){
        if(err.code === 11000){
            return NextResponse.json({error: err.message || "Duplicate Block for this user"},{status: 400});
        }
        return NextResponse.json({error: 'Database Errro', details: err.message || err},{status: 500});
    }
}
    