
"use client"
import { useSearchParams } from "next/navigation"
import { createClient } from 'lib/supabase/client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"



export default function Page() {
    const supabase = createClient();
    const searchParams = useSearchParams();
    const eventId = searchParams.get("eventId");
    const router = useRouter();


    const [eventName, seteventName] = useState(null);
    const [joinCode, setjoinCode] = useState(null);
    const [joinUrl, setjoinUrl] = useState(null);


    useEffect(() => {
        getEvent();
    }, []);

    const getEvent = async () => {
        let { data: eventData, error: eventError } = await supabase.from("events").select().eq("id", eventId).single();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user)
            console.log("No user logged in");

        seteventName(eventData.name);
        setjoinCode(eventData.join_code);
        setjoinUrl(`${window.location.origin}/event/join?code=`);

        let { data, error } = await supabase.from("events_users").insert({ event_id: eventId, user_id: user.id, points_earned: 1 });

        if (error)
            console.log(error);
    }



    return (
        <div>
            <h1>EventID: {eventId}</h1>
            <h1>JoinCode: {joinCode}</h1>
            <h1>EventName: {eventName}</h1>
            <h1>JoinUrl: {joinUrl}{joinCode}</h1>
        </div>
    );
}