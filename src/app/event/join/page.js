"use client"
import { useSearchParams } from "next/navigation"
import { createClient } from 'lib/supabase/client'

export default function Page () {
    const supabase = createClient();
    const searchParams = useSearchParams();
    const joinCode = searchParams.get("joinCode");

    return (
        <div>
            <h1>JoinCode: {joinCode}</h1>
        </div>
    );
}