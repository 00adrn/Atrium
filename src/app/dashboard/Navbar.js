"use client"

import { redirect } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

const Navbar = ({ headshot }) => {
  const [pfpMenuOpen, setPfpMenuOpen] = useState(false)

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
                className="absolute top-11 right-4 w-36 h-56 bg-white rounded-lg border border-gray-200 shadow-md"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                
              </motion.div>
          }
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar