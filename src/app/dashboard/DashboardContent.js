"use client"

import CreateMenu from '@/components/dashboard/CreateMenu';
import { useEffect, useState } from 'react';
import AdminTableEntry from "./AdminTableEntry"
import UserTableEntry from './UserTableEntry';
import { createClient } from 'lib/supabase/client';
import { motion } from "motion/react"

export default function DashboardContent({ userName }) {
  
  const [hasOrgs, setHasOrgs] = useState(true)

  //FOR TESTING
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
  }]

  const eventList = [
  {
    name: "Fall Kickoff Meeting",
    date: "September 15, 2024",
    attendance: 45,
    attendees: [
      {
        name: "John Doe",
        photo: "https://via.placeholder.com/40",
        description: "President of the organization, oversees all operations.",
        points: 250,
        linkedin: "https://linkedin.com/in/johndoe"
      },
      {
        name: "Jane Smith",
        photo: "https://via.placeholder.com/40",
        description: "Vice President, focuses on member engagement.",
        points: 180,
        linkedin: "https://linkedin.com/in/janesmith"
      },
      {
        name: "Mike Johnson",
        photo: "https://via.placeholder.com/40",
        description: "Treasurer responsible for budgeting and funding.",
        points: 145,
        linkedin: "https://linkedin.com/in/mikejohnson"
      },
      {
        name: "John Doe",
        photo: "https://via.placeholder.com/40",
        description: "President of the organization, oversees all operations.",
        points: 250,
        linkedin: "https://linkedin.com/in/johndoe"
      },
      {
        name: "Jane Smith",
        photo: "https://via.placeholder.com/40",
        description: "Vice President, focuses on member engagement.",
        points: 180,
        linkedin: "https://linkedin.com/in/janesmith"
      },
      {
        name: "Mike Johnson",
        photo: "https://via.placeholder.com/40",
        description: "Treasurer responsible for budgeting and funding.",
        points: 145,
        linkedin: "https://linkedin.com/in/mikejohnson"
      }
    ]
  },
  {
    name: "Web Development Workshop",
    date: "October 3, 2024",
    attendance: 32,
    attendees: [
      {
        name: "Sarah Williams",
        photo: "https://via.placeholder.com/40",
        description: "Frontend developer with a focus on React and UI design.",
        points: 220,
        linkedin: "https://linkedin.com/in/sarahwilliams"
      },
      {
        name: "Alex Chen",
        photo: "https://via.placeholder.com/40",
        description: "Backend engineer interested in APIs and databases.",
        points: 195,
        linkedin: "https://linkedin.com/in/alexchen"
      },
      {
        name: "John Doe",
        photo: "https://via.placeholder.com/40",
        description: "Led the workshop introduction and demos.",
        points: 250,
        linkedin: "https://linkedin.com/in/johndoe"
      }
    ]
  },
  {
    name: "Hackathon Planning Session",
    date: "October 20, 2024",
    attendance: 28,
    attendees: [
      {
        name: "Mike Johnson",
        photo: "https://via.placeholder.com/40",
        description: "Coordinated sponsorship logistics and budgeting.",
        points: 145,
        linkedin: "https://linkedin.com/in/mikejohnson"
      },
      {
        name: "Jane Smith",
        photo: "https://via.placeholder.com/40",
        description: "Organized teams and scheduling for the hackathon.",
        points: 180,
        linkedin: "https://linkedin.com/in/janesmith"
      },
      {
        name: "Alex Chen",
        photo: "https://via.placeholder.com/40",
        description: "Planned technical challenges and judging criteria.",
        points: 195,
        linkedin: "https://linkedin.com/in/alexchen"
      }
    ]
  },
  {
    name: "Guest Speaker: Tech Industry",
    date: "November 8, 2024",
    attendance: 52,
    attendees: [
      {
        name: "John Doe",
        photo: "https://via.placeholder.com/40",
        description: "Introduced guest speaker and moderated Q&A.",
        points: 250,
        linkedin: "https://linkedin.com/in/johndoe"
      },
      {
        name: "Sarah Williams",
        photo: "https://via.placeholder.com/40",
        description: "Handled event marketing and promotions.",
        points: 220,
        linkedin: "https://linkedin.com/in/sarahwilliams"
      },
      {
        name: "Mike Johnson",
        photo: "https://via.placeholder.com/40",
        description: "Managed venue and equipment logistics.",
        points: 145,
        linkedin: "https://linkedin.com/in/mikejohnson"
      }
    ]
  },
  {
    name: "Code Review Workshop",
    date: "November 22, 2024",
    attendance: 38,
    attendees: [
      {
        name: "Jane Smith",
        photo: "https://via.placeholder.com/40",
        description: "Led peer code review sessions.",
        points: 180,
        linkedin: "https://linkedin.com/in/janesmith"
      },
      {
        name: "Alex Chen",
        photo: "https://via.placeholder.com/40",
        description: "Provided backend architecture feedback.",
        points: 195,
        linkedin: "https://linkedin.com/in/alexchen"
      },
      {
        name: "Sarah Williams",
        photo: "https://via.placeholder.com/40",
        description: "Focused on UI/UX improvements and accessibility.",
        points: 220,
        linkedin: "https://linkedin.com/in/sarahwilliams"
      }
    ]
  },
  {
    name: "Year-End Social",
    date: "December 10, 2024",
    attendance: 67,
    attendees: [
      {
        name: "John Doe",
        photo: "https://via.placeholder.com/40",
        description: "Helped organize activities and awards.",
        points: 250,
        linkedin: "https://linkedin.com/in/johndoe"
      },
      {
        name: "Jane Smith",
        photo: "https://via.placeholder.com/40",
        description: "Coordinated catering and member outreach.",
        points: 180,
        linkedin: "https://linkedin.com/in/janesmith"
      },
      {
        name: "Mike Johnson",
        photo: "https://via.placeholder.com/40",
        description: "Handled budgeting and reimbursements.",
        points: 145,
        linkedin: "https://linkedin.com/in/mikejohnson"
      },
      {
        name: "Sarah Williams",
        photo: "https://via.placeholder.com/40",
        description: "Designed event branding and visuals.",
        points: 220,
        linkedin: "https://linkedin.com/in/sarahwilliams"
      }
    ]
  }
  ];

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
            <CreateMenu buttonText='Create Org'/>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              Join Event
            </button>
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
            <AdminTableEntry orgName={"Gator User Design"} orgLogo={"/tower.jpg"} memberCount={"100"} eventCount={5} memberList={memberList} eventList={eventList}/>
            <UserTableEntry orgName={"Gator User Design"} orgLogo={"/tower.jpg"} memberCount={"100"} userPoints={5} memberList={memberList}/>
          </div>
        )}
      </div>
    </div>
  );
}