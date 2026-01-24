"use client"

import { createClient } from 'lib/supabase/client'
import { redirect } from "next/navigation" 

export default function Page() {
    return <div>
        <button  style={{background: "white", color: "black"}}> testbutton </button>
    </div>
}

const createAndRedirect = async () => {
    const redirectUrl = await generateEvent();

    redirect(redirectUrl);
}

const generateEvent = async (clubId, eventName) => {
    const joinCode = generateJoinCode();

    const supabase = createClient();

    const { data, error } = await supabase.from("events").insert({club_id: clubId, join_code: joinCode, name: eventName})
    .select().single();

    if (error)
        return error;

    const redirectUrl = `/host/event/${data.id}`;

    return redirectUrl;
}

const generateJoinCode = () => {
    const nums = "0123456789";
    let id = "";
    for (let i = 0; i < 6; i++)
        id += nums[Math.floor(Math.random() * nums.length)];

    console.log(`Generated ID: ${id}`);
    return id;
}
