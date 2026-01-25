"use client"

import { redirect } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { createClient } from "lib/supabase/client"

const Navbar = ({ headshot }) => {
  const [pfpMenuOpen, setPfpMenuOpen] = useState(false)
  const [userName, setUserName] = useState("")
  const [userDesc, setUserDesc] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user: userRes } } = await supabase.auth.getUser()

      if (userRes) {
        const { data, error } = await supabase.from('users').select().eq('id', userRes.id).single()
        console.log(data)
        if (error) console.log(error)
        
        setUserName(`${data.first_name} ${data.last_name}`)
        setUserDesc(data.description)
      }
    }
    
    getUserData()
  }, [])

  const handleClick = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.log(error)
    } else {
      redirect("/")
    }
  }

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 px-4 py-2 z-10">
      <div className="flex items-center justify-between">
        <a className="cursor-pointer" onClick={() => redirect("/")}>
          <img src="/alpha.svg" className="h-7 w-7"/>
        </a>

        <button onClick={() => setPfpMenuOpen(!pfpMenuOpen)}>
          <img
            src={headshot} 
            className="h-8 w-8 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
          />
        </button>

        <AnimatePresence initial={false} mode="wait">
          {pfpMenuOpen && 
              <motion.div 
                className="absolute top-11 right-4 w-48 h-fit p-2 bg-white rounded-lg border border-gray-200 shadow-md flex flex-col gap-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <div>
                  <p className="text-black">{userName}</p>
                  <p className="text-gray-500">{userDesc}</p>
                </div>
                <button onClick={() => handleClick()} className='w-full text-black hover:cursor-pointer mt-auto h-8 rounded-sm bg-red-500/20 hover:bg-red-500/40 transition-colors duration-200'>
                  Sign out
                </button>
              </motion.div>
          }
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar