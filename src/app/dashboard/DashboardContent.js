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
  const [membersByOClub, setMembersByOClub] = useState({})
  const [membersByClub, setMembersByClub] = useState({})
  const [eventsByOClub, setEventsByOClub] = useState({})
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

    const fetchOClubs = async () => { // gets array of clubs for which you are a member
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
    
    const fetchClubs = async () => { // gets array of clubs for which you are an officer
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
  }, [userId])

  useEffect(() => {
    if (oClubs.length === 0) return
  
    const fetchEventsWithAttendees = async () => {
      const results = {}
      
      for (const club of oClubs) {
        const { data: events, error: eventsError } = await supabase.from('events').select('*').eq('club_id', club.id).order('created_at', { ascending: false })
        if (eventsError || !events) continue
  
        const eventsWithAttendees = await Promise.all(
          events.map(async (event) => {
            const { data: attendeesData, error: attendeesError } = await supabase.from('events_users').select('users(*)').eq('event_id', event.id)
            const attendees = attendeesData?.map(row => row.users).filter(Boolean) || []
  
            return {
              ...event,
              attendees,
              attendance: attendees.length
            }
          })
        )
  
        results[club.id] = eventsWithAttendees
      }
      
      setEventsByOClub(results)
    }

    const fetchMembers = async () => {
      const results = {}
      for (const club of oClubs) {
        const { data, error } = await supabase.from('clubs_users').select('users(*)').eq('club_id', club.id)
  
        if (!error) {
          results[club.id] = data.map(row => row.users)
        }
      }

      setMembersByOClub(results)

    }

    fetchEventsWithAttendees()
    fetchMembers()
  }, [oClubs])
  
  useEffect(() => {
    if (clubs.length === 0) return
  
    const fetchMembers = async () => {
      const results = {}
      for (const club of clubs) {
        const { data, error } = await supabase.from('clubs_users').select('users(*)').eq('club_id', club.id)
  
        if (!error) {
          results[club.id] = data.map(row => row.users)
        }
      }

      setMembersByClub(results)

    }
    fetchMembers()
  }, [clubs])

  useEffect(() => {
    if (!oClubs || !clubs) return
    if (oClubs.length === 0 && clubs.length === 0) setHasOrgs(false)
    else setHasOrgs(true)
  }, [oClubs, clubs])

  return (
    <div className="relative top-8 bg-white p-12">
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
            {oClubs.length > 0 && (
              <>
                <div className="mb-2">
                  <h2 className="text-2xl text-gray-900">
                    Manage your organization(s):
                  </h2>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-2">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 w-2/5">
                          Organization
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 w-1/5">
                          Event Count
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 w-1/5">
                          Membership Info
                        </th>
                        <th className="px-6 py-3 w-1/5"></th>
                      </tr>
                    </thead>
                    {oClubs.map((c, i)=> (
                      <AdminTableEntry
                        key={i}
                        clubId={c.id}
                        orgName={c.club_name}
                        orgLogo={c.club_logo}
                        memberCount={membersByOClub[c.id]?.length ?? 0}
                        memberList={membersByOClub[c.id] ?? []}
                        eventCount={eventsByOClub[c.id]?.length ?? 0}
                        eventList={eventsByOClub[c.id] ?? []}
                      />
                    ))}
                  </table>
                </div>
              </>
            )}

            {clubs.length > 0 && (
              <>
                <div className="mb-2">
                  <h2 className="text-2xl text-gray-900">
                    View orgs you're a member of:
                  </h2>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-2">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Organization</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Your Points</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Membership Info</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    {clubs.map((c, i) => (
                      <UserTableEntry 
                        key={i}
                        clubId={c.id}
                        orgName={c.club_name}
                        orgLogo={c.club_logo} 
                        memberList={membersByClub[c.id] ?? []}
                      />
                    ))}
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}