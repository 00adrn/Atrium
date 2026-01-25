"use client"

import dynamic from "next/dynamic"
import { motion } from "motion/react"
import MemberList from '@/app/dashboard/MemberList';
import ResourceTableButton from "@/components/events/ResourceButton";
import { useState, useEffect } from "react"
import { createClient } from 'lib/supabase/client'

const supabase = createClient()

export default function EventJoinScreen({ eventName, users, resources }) {
  const [memberData, setMemberData] = useState([]);

  useEffect(() => { 
    setMemberData([]);

    const fetchAndAddMember = async (id) => {
      const { data: userData, error: userError } = await supabase.from('users').select().eq('id', id).single();
      if (userError) {
        console.error(`Error fetching user ${id}:`, userError);
        return;
      }

      setMemberData(prevMemberData => {
        if (prevMemberData.some(member => member.id === userData.id)) {
          return prevMemberData;
        }
        return [...prevMemberData, userData];
      });
    };

    users.forEach(id => {
      fetchAndAddMember(id);
    });
  }, [users])

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <div className="max-w-5xl mx-auto mt-10">
        <motion.h1
          className='text-black text-4xl font-semibold mb-6 translate-x-6'
          initial={{ opacity: 0, filter: "blur(5px)", x: -20 }}
          animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
          transition={{ duration: 0.8 }}>
          {eventName}
        </motion.h1>
        <div className="max-w-[95%] translate-x-6">
          <ResourceTableButton resources={resources} />
        </div>
        <MemberList members={memberData} showLinkedIn={true} />
      </div>
    </div>
  );
}