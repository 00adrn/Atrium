"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from 'lib/supabase/client'
import { useState, useEffect } from "react"
import EventJoinScreen from "./EventJoinScreen";
import Navbar from "@/app/dashboard/Navbar";

export default function EventJoinedPage() {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const joinCode = searchParams.get("code");

    const [eventName, seteventName] = useState(null);
    const [links, setlinks] = useState([]);
    const [userData, setuserData] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [headshot, setheadshot] = useState(null)


    useEffect(() => {
        joinEvent();
    }, []);

    useEffect(() => {
        if (!joinCode || !userData) return;

        const room = `event-${joinCode}`;
        const channel = supabase.channel(room, {
            config: {
                presence: {
                    key: userData.id,
                },
            },
        });

        channel
            .on("presence", { event: "sync" }, () => {
                const presenceState = channel.presenceState();
                const userIds = Object.keys(presenceState);
                setAllUsers(userIds);
                console.log(userIds);
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({});
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [joinCode, userData]);

    const joinEvent = async () => {



        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.log(userError || "No user logged in");
            router.push('/login');
            return;
        }

        const { data: eventData, error: eventError } = await supabase.from("events").select().eq("join_code", joinCode).single();
        if (eventError || !eventData) {
            console.log(eventError || `Event not found for code: ${joinCode}`);
            router.push('/dashboard');
            return;
        }

        const { data, error } = await supabase.from('users').select().eq('id', user.id).single()
        setheadshot(data.headshot)

        seteventName(eventData.name);

        const rawLinkData = eventData.links.split("&&");
        let linkData = [];

        for (let i = 0; i < rawLinkData.length; i++) {
            linkData.push([rawLinkData[i].split("|")[0], rawLinkData[i].split("|")[1]]);
        }

        setlinks(linkData);

        setuserData(user);

        if (eventData.club_id) {
            const { error: clubJoinError } = await supabase.from("clubs_users").insert({ club_id: eventData.club_id, user_id: user.id, points: 0 });
            if (clubJoinError && clubJoinError.code !== '23505') console.log('Error joining club for event:', clubJoinError);
        }

        const { status: addStatus, error: eventJoinError } = await supabase.from("events_users").insert({ event_id: eventData.id, user_id: user.id, points_earned: eventData.points });
        
        if (addStatus == 201) {
            const { data: pointData, pointError } = await supabase.from("clubs_users").select("points").eq("user_id", user.id).eq("club_id", eventData.club_id).single();
            if (pointError) console.log(pointError)

            const { error: updateError } = await supabase.from("clubs_users").update({ points: pointData.points + eventData.points }).eq("user_id", user.id).eq("club_id", eventData.club_id);
            if (updateError) console.log(updateError);
        }
    }

    return (
        <div>
            <Navbar headshot={headshot} />
            <EventJoinScreen eventName={eventName} users={allUsers} resources={links} />
        </div>
    );
}