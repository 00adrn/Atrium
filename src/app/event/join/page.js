"use client"
import { useSearchParams } from "next/navigation"
import { createClient } from 'lib/supabase/client'
import { useState, useEffect } from "react"

export default function Page () {
    const supabase = createClient();


    const searchParams = useSearchParams();
    const joinCode = searchParams.get("code");

    const [eventName, seteventName] = useState(null);
    const [links, setlinks] = useState([]);

    useEffect(() => {
        fetchEventData();
    }, []);


    const fetchEventData = async () => {
        const { data, error } = await supabase.from("events").select().eq("join_code", joinCode).single();

        if (error) {
            console.log(error);
            return;
        }

        seteventName(data.name);
        setlinks(data.links.split("|"));
    }

    return (
        <div>
            <h1>Event Name: {eventName}</h1>
            <h1>Links</h1>
            {links.map((link, i) => {
                return <p key={i}><a href={link}>{link}</a></p>
            })}
        </div>
    );
}