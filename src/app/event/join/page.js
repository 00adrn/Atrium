"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from 'lib/supabase/client'
import { useState, useEffect } from "react"
import LinkCard from "@/components/events/LinkCard";
import EventJoinScreen from "./EventJoinScreen";
import MemberList from "@/app/dashboard/MemberList";
import Navbar from "@/app/dashboard/Navbar";


export default function EventJoinedPage() {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const joinCode = searchParams.get("code");

    const [eventName, seteventName] = useState(null);
    const [links, setlinks] = useState([]);
    const [userData, setuserData] = useState(null);


    useEffect(() => {
        joinEvent();
    }, []);

    const joinEvent = async () => {
        const { data: eventData, error: eventError } = await supabase.from("events").select().eq("join_code", joinCode).single();
        const { data: { user } } = await supabase.auth.getUser();


        if (eventError) {
            console.log(error);
            return;
        }

        seteventName(eventData.name);
        setlinks(eventData.links.split("|"));
        setuserData(user);

        let { data: eventJoinData, error: eventJoinError } = await supabase.from("events_users").insert({ event_id: eventData.id, user_id: user.id, points_earned: 1 });
        let { data: clubJoinData, error: clubJoinError } = await supabase.from("clubs_users").insert({ club_id: eventData.club_id, user_id: user.id, points: 1 });

        if (eventJoinError)
            console.log(eventJoinError)

        if (clubJoinError)
            console.log(clubJoinError)

    }

    // {links.map((link, i) => (
    //   <LinkCard link={link} key={i}/>
    // ))}

    return (
        <div>
          <Navbar/>
          <EventJoinScreen/>
        </div>
    );
}