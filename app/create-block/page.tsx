import { redirect } from "next/navigation";

import {cookies} from "next/headers";
import {supabase} from "@/lib/supabaseServer";
import BlockForm from "./BlockForm";

export default async function CreateBlockPage(){
    const {data: {user}} = await supabase.auth.getUser();
    // if(!user){
    //     console.log("No user, redirecting to /auth");
    //     redirect("/auth");
    // }
    return <BlockForm user={user} />;
}