'use client'

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { CgClose } from "react-icons/cg"
import { createClient } from "lib/supabase/client"
import { useRouter } from "next/navigation"

const CreateOrg = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const router = useRouter()
  
  const supabase = createClient()

  return (
    <section>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        onClick={() => setFormOpen(!formOpen)}
      >
        Join event
      </button>
      
      <AnimatePresence initial={false} mode="wait">
        {formOpen && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-black/36 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="relative flex flex-col w-[20rem] border border-gray-200 rounded-xl bg-white p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <button 
                onClick={() => setFormOpen(false)} 
                className="hover:cursor-pointer w-fit h-fit block absolute top-5 right-5"
              >
                <CgClose 
                  className='text-red-700 hover:text-red-500 transition-colors duration-200' 
                  size={24} 
                />
              </button>

              <div className="flex flex-col gap-4">
                <h2 className="text-2xl text-black font-semibold mb-2">Join a live event</h2>
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0.9 }}
                    animate={{ opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <label 
                        htmlFor="orgName" 
                        className="block text-sm font-medium text-gray-900 mb-2"
                      >
                        Join code
                      </label>
                      <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="123456"
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none placeholder-gray-400"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>

                <button 
                  onClick={() => router.push(`/event/join?code=${joinCode}`)}
                  className='bg-blue-600 hover:bg-blue-700 hover:cursor-pointer w-full h-10 rounded-lg flex items-center justify-center text-white transition duration-200 mt-2'
                >
                  Join up
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default CreateOrg