"use client"

import { createClient } from 'lib/supabase/client'
import { useRouter } from "next/navigation"

export default function Page() {
    const router = useRouter();

    const createAndRedirect = async () => {
        const redirectUrl = await generateEvent();
        router.push(redirectUrl);
    }

    const generateEvent = async (clubId, eventName) => {
        const joinCode = generateJoinCode();

        const supabase = createClient();

        const { data, error } = await supabase.from("events").insert({club_id: clubId, join_code: joinCode, name: eventName, type: 1})
        .select().single();

        if (error)
            return error;
        const redirectUrl = `/event/host?eventId=someTestID&joinCode=${joinCode}`;

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

    return (
      <div>
        
      </div>
    );
}

