"use client"
import { motion } from "motion/react"
import MemberList from '@/app/dashboard/MemberList';

export default function EventJoinScreen({ eventName }) {
  const memberList = [
    {
      name: "John Doe",
      photo: "https://via.placeholder.com/40",
      description: "Computer Science @ UF, Full-stack developer and a whole bunch of crazy stuff that's way too long for this field",
      points: 250,
      linkedin: "https://linkedin.com/in/johndoe"
    },
    {
      name: "Jane Smith",
      photo: "https://via.placeholder.com/40",
      description: "Software Engineering @ UF, AI enthusiast",
      points: 180,
      linkedin: "https://linkedin.com/in/janesmith"
    },
    {
      name: "Mike Johnson",
      photo: "https://via.placeholder.com/40",
      description: "CS @ UF, Backend developer",
      points: 145,
      linkedin: "https://linkedin.com/in/mikejohnson"
    },
    {
      name: "Sarah Williams",
      photo: "https://via.placeholder.com/40",
      description: "Computer Engineering @ UF, UI/UX designer",
      points: 220,
      linkedin: "https://linkedin.com/in/sarahwilliams"
    },
    {
      name: "Alex Chen",
      photo: "https://via.placeholder.com/40",
      description: "CS @ UF, Mobile app developer",
      points: 195,
      linkedin: "https://linkedin.com/in/alexchen"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <div className="max-w-5xl mx-auto">
          <motion.h1 
            className='text-black text-4xl font-semibold translate-x-6'
            initial={{ opacity: 0, filter: "blur(5px)", x: -20 }}
            animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            transition={{ duration: 0.8 }}>
            {eventName}
          </motion.h1>
        <div className='flex flex-col gap-y-5'>
          <MemberList members={memberList} showLinkedIn={true}/>
        </div>
      </div>
    </div>
  );
}