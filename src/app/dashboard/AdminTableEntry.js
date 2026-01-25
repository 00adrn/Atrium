import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MemberList from "./MemberList";
import AttendeesPopup from "./AttendeesPopup";
import CreateEvent from "@/components/dashboard/CreateEvent";
import { createClient } from 'lib/supabase/client';

export default function AdminTableEntry({ clubId, orgName, orgLogo, eventCount, memberList, eventList }) {

  const router = useRouter()
  const supabase = createClient();
  const [showMembers, setShowMembers] = useState(false);
  const [showEvents, setShowEvents] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [memberData, setMemberData] = useState(memberList);

  const menuRef = useRef(null);
  const eventsRef = useRef(null);
  const membersRef = useRef(null);

  useEffect(() => {
    if (!memberList || memberList.length === 0 || !clubId) {
      setMemberData([]); 
      return;
    }

    const addMemberPoints = async () => {
      const updatedMembers = await Promise.all(
        memberList.map(async (member) => {
          const { data: pointsData, error } = await supabase.from("clubs_users").select("points").eq("user_id", member.id).eq("club_id", clubId).single();
          if (error) {
            console.error("Error fetching points for member:", member.id, error);
            return { ...member, points: 0 };
          }
          return {
            ...member,
            points: pointsData?.points ?? 0
          };
        })
      );
      setMemberData(updatedMembers);
    };
    addMemberPoints();
  }, [memberList, clubId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); 

  return (
    <>
      <tbody className="divide-y divide-gray-200">
        <tr>
          <td className="px-6 py-6">
            <div className="flex items-center gap-4">
              <img
                src={orgLogo}
                className="w-16 h-16 rounded-lg"
              />
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {orgName}
                </div>
                <div className="text-sm text-gray-500">
                  {memberList.length} members
                </div>
              </div>
            </div>
          </td>

          <td className="px-6 py-6">
            <div className="flex items-center gap-6">
              <span className="text-2xl font-semibold text-blue-600">
                {eventCount}
              </span>
              <motion.button
                type="button"
                className="text-sm font-semibold text-blue-600 cursor-pointer"
                onClick={() => {
                  setShowEvents(prev => !prev);
                  setTimeout(() => {
                    eventsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }, 100);
                }}
              >
                {showEvents ? "Hide events" : "View history"}
              </motion.button>
            </div>
          </td>

          <td className="px-6 py-6">
            <motion.button
              type="button"
              className="font-semibold text-blue-600 cursor-pointer"
              onClick={() => {
                setShowMembers(prev => !prev);
                setTimeout(() => {
                  membersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
              }}
            >
              {showMembers ? "Hide members" : "View all members"}
            </motion.button>
          </td>

          <td className="px-6 py-6">
            <CreateEvent clubId={clubId}/>
          </td>
        </tr>
      </tbody>

      <AnimatePresence>
        {showEvents && (
          <tbody ref={eventsRef}>
            <tr>
              <td colSpan="4" className="p-0">
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gray-50 p-6">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <table className="w-full table-fixed">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 w-2/5">
                              Event Name
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 w-1/5">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 w-1/5">
                              Attendance
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 w-1/5"></th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                          {eventList?.map((event, index) => {
                            const timestamp = event.created_at
                            const date = new Date(timestamp)
                          
                            const formatted = date.toLocaleDateString('en-US', {
                              month: '2-digit',
                              day: '2-digit',
                              year: '2-digit'
                            })

                            return (
                              <tr key={event.id} className="">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                  {event.name}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600">
                                  {formatted}
                                </td>

                                <td className="px-6 py-4 text-lg font-semibold text-gray-900">
                                  {event.attendance}
                                </td>

                                <td className="px-6 py-4">
                                  <button
                                    onClick={() => setActiveEvent(event)}
                                    className="text-blue-600 hover:text-blue-700 font-semibold"
                                  >
                                    Show Attendees
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              </td>
            </tr>
          </tbody>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMembers && (
          <tbody ref={membersRef}>
            <tr>
              <td colSpan="4" className="p-0">
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MemberList
                    members={memberData}
                    showLinkedIn={true}
                  />
                </motion.div>
              </td>
            </tr>
          </tbody>
        )}
      </AnimatePresence>

      <AttendeesPopup
        isOpen={!!activeEvent}
        onClose={() => setActiveEvent(null)}
        attendees={activeEvent?.attendees || []}
      />
    </>
  );
}