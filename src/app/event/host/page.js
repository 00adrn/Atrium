
"use client"
import { useSearchParams } from "next/navigation"
import { createClient } from 'lib/supabase/client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import QRCode from "qrcode"



export default function Page() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();


  const [eventId, setEventId] = useState(null);
  const [eventName, seteventName] = useState(null);
  const [joinCode, setjoinCode] = useState(null);
  const [joinUrl, setjoinUrl] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getEvent();
  }, []);

  useEffect(() => {
    eventId = searchParams.get("eventId");
    
    if (!joinCode || !user) return;

    const room = `event-${joinCode}`;
    const channel = supabase.channel(room, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState();
        const userIds = Object.keys(presenceState);
        setAllUsers(userIds);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({});
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [joinCode, user]);

  useEffect(() => {
    const genQr = async () => {
      QRCode.toDataURL(joinUrl + joinCode, {
        width: 500,
        margin: 2,
        color: {
          dark: '#292524',
          light: '#ffffff'
        }
      }).then(setQrUrl);
    }
    genQr()
  }, [joinUrl]);



  const getEvent = async () => {
    let { data: eventData, error: eventError } = await supabase.from("events").select().eq("id", eventId).single();
    if (eventError || !eventData) {
      console.error(eventError || `Event not found: ${eventId}`);
      router.push('/dashboard');
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(userError || "No user logged in");
      router.push('/login');
      return;
    }

    setUser(user);
    seteventName(eventData.name);
    setjoinCode(eventData.join_code);
    setjoinUrl(`${window.location.origin}/event/join?code=`);

    const { error: insertError } = await supabase.from("events_users").insert({ event_id: eventId, user_id: user.id, points_earned: 1 });
    if (insertError && insertError.code !== '23505') {
      console.error('Error adding host to event:', insertError);
    }
  }



  return (
    <div className="h-screen bg-white flex p-4">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl">
          <div className="p-8">
            <div className="flex flex-col gap-y-10 items-center text-center">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-5xl font-semibold text-gray-900">
                  {eventName}
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  {joinUrl}{joinCode}
                </p>
              </div>

              <div className="flex items-center gap-25">
                {qrUrl && (
                  <img
                    src={qrUrl}
                    className="w-64 h-64 p-4 rounded-lg border border-gray-200"
                    alt="Event QR Code"
                  />
                )}

                <div className="flex flex-col items-center">
                  <h1 className="text-8xl leading-none font-serif text-gray-900">
                    {allUsers.length}
                  </h1>
                  <p className="text-lg mt-2 text-gray-600">
                    Participants checked in
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-y-1 -translate-x-37 -translate-y-2">
                <h2 className="text-base text-gray-600 ">
                  Join Code
                </h2>
                <p className="text-2xl font-semibold text-gray-900">
                  {joinCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <img
          src="/plaza.jpg"
          className="w-full h-full max-h-screen object-cover rounded-xl"
        />
      </div>
    </div>
  );

}