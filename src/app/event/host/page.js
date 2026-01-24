
"use client"
import { useSearchParams } from "next/navigation"
import { createClient } from 'lib/supabase/client'
import { useState, useEffect } from "react"


export default function Page () {
    const supabase = createClient();
    const searchParams = useSearchParams();

    const eventId = searchParams.get("eventId");

    const [eventName, seteventName] = useState(null);
    const [joinCode, setjoinCode] = useState(null);
    const [joinUrk, setJoinUrl] = useState(null);

    useEffect(() => {
        getEvent();
    }, []);

    const getEvent = async () => {
        const { data, error } = await supabase.from("events").select().eq("id", eventId).single();

        if (error) {
            console.log(error);
            return;
        }

        seteventName(data.name);
        setjoinCode(data.join_code);
        setlinks((data.links).split("|"));
    }

    return (
        <div>
            <h1>EventID: {eventId}</h1>
            <h1>JoinCode: {joinCode}</h1>
            <h1>EventName: {eventName}</h1>
        </div>
    );
}