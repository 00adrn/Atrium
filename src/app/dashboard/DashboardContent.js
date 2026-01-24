"use client"

import CreateOrg from '@/components/dashboard/CreateOrg';
import { useEffect, useState } from 'react';
import AdminTableEntry from "./AdminTableEntry"
import UserTableEntry from './UserTableEntry';
import { motion } from "motion/react"
import JoinEvent from '@/components/dashboard/JoinEvent';
import { createClient } from 'lib/supabase/client';

export default function DashboardContent({ userName }) {
  const [userId, setUserId] = useState(null)
  const [hasOrgs, setHasOrgs] = useState(true)
  const [oClubs, setOClubs] = useState([])
  const [clubs, setClubs] = useState([])
  const supabase = createClient()

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }

    fetchUserId()
  }, [])

  useEffect(() => {
    if (!userId) return
    console.log(userId)

    const fetchOClubs = async () => {
      const { data, error } = await supabase
        .from('clubs_officers')
        .select('clubs(id, club_name, club_logo)')
        .eq('officer_id', userId)
    
      if (error) {
        console.log(error)
        return
      }
    
      const clubsArray = data?.map(item => item.clubs).filter(Boolean) || []
      setOClubs(clubsArray)
    }
    
    const fetchClubs = async () => {
      const { data, error } = await supabase
        .from('clubs_users')
        .select('clubs(id, club_name, club_logo)')
        .eq('user_id', userId)
    
      if (error) {
        console.log(error)
        return
      }
    
      const clubsArray = data?.map(item => item.clubs).filter(Boolean) || []
      setClubs(clubsArray)
    }

    fetchOClubs()
    fetchClubs()
  }, [userId, clubs, oClubs])

  useEffect(() => {
    if (!oClubs || !clubs) return
    if (oClubs.length === 0 && clubs.length === 0) setHasOrgs(false)
    else setHasOrgs(true)
  }, [oClubs, clubs])

  return (
    <div className="min-h-screen bg-white p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <motion.h1 className='text-black text-4xl font-semibold'>
            Welcome back, <motion.span
              initial={{ opacity: 0, filter: "blur(5px)", x: -20 }}
              animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              transition={{ duration: 0.8 }}>
              {userName}
            </motion.span>
          </motion.h1>
          <div className="flex gap-3">
            <CreateOrg/>
            <JoinEvent/>
          </div>
        </div>

        {!hasOrgs ? (
          <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
            <div className="max-w-md mx-auto">
              <img src="/door.png" className='w-25 flex items-center justify-center mx-auto -translate-y-5'/>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Get Started</h2>
              <p className="text-gray-600">
                Create your first organization or join an event to start tracking your involvement, earn points, and connect with others.
              </p>
            </div>
          </div>
        ) : (
          
          <div className='flex flex-col gap-y-5'>
            {oClubs.map((c, i) => (
              <AdminTableEntry 
                key={i}
                orgName={c.club_name}
                orgLogo={c.club_logo} 
                memberCount={"100"} 
                eventCount={5} 
                memberList={[]} 
                eventList={[]}
              />
            ))}
            {clubs.map((c, i) => (
              <UserTableEntry 
                key={i}
                orgName={c.club_name}
                orgLogo={c.club_logo} 
                memberCount={"100"} 
                eventCount={5} 
                memberList={[]} 
                eventList={[]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}