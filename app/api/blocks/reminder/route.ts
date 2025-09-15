import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Block from "@/models/Block";
import { transporter } from "@/lib/mailer";

export async function GET(req: Request) {

    const secret = req.headers.get("x-cron-secret");
    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    await dbConnect();
    const now = new Date();
    const blocks = await Block.find({
        reminderSent: false,
        reminderScheduledAt: { $lte: now }
    });
    let sentCount = 0;
    for (const b of blocks) {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: b.userEmail,
                subject: 'Quiet Hour Reminder',
                text: `Your study block starts at ${b.startAt.toLocaleString()} (${b.timezone}).`,
            });
            b.reminderSent = true;
            b.reminderSentAt = new Date();
            await b.save();
            sentCount++;
        } catch (err) {
            // Optionally log error or handle failed email
        }
    }
    return NextResponse.json({ sent: sentCount });
}