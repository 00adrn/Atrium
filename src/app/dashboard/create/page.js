"use client"

import { createClient } from 'lib/supabase/client'
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
    const router = useRouter();

    const [eventName, seteventName] = useState("someeventname");
    const [clubId, setClubId] = useState("763c22a7-80b4-4e2c-a973-b0076d2914c2");
    const [links, setlinks] = useState("google.come|amazon.com|linkedin.com|4chan.org");

    const createAndRedirect = async () => {
        const { res, redirectUrl } = await generateEvent();

        if (res)
            router.push(redirectUrl);
    }

    const generateEvent = async () => {
        const joinCode = generateJoinCode();
        const supabase = createClient();

        let res = false;
        let redirectUrl = "";


        const { data, error } = await supabase.from("events").insert({ club_id: clubId, join_code: joinCode, name: eventName, links: links, type: 1 }).select().single();

        if (data) {
            res = true;
            redirectUrl = `/event/host?eventId=${data.id}`;
        }
        else
            console.log(error);

        return { res, redirectUrl };
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
            <button onClick={createAndRedirect}>Create Event</button>
        </div>
    );
}

