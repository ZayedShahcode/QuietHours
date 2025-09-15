import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if(!MONGODB_URI) throw new Error("MONGODB_URI is not defined");

type Cached = {
    conn : typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global{
    // eslint-disable-next-line no-var
    var _mongoose: Cached | undefined;
}

const cached = global._mongoose || (global._mongoose = {conn: null, promise: null});

export default async function dbConnect(){
    if(cached.conn) return cached.conn;
    if(!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}