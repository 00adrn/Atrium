"use client"

import { motion, animate, stagger } from "motion/react"
import { useRef, useEffect, useState } from "react"
import { redirect } from 'next/navigation'
import { createClient } from "lib/supabase/client"

export default function HomepageContent(){
  const [loggedIn, setLoggedIn] = useState(false)
  const homeElementsRef = useRef([])

  useEffect(() => {
    const elements = homeElementsRef.current.filter(el => el !== null);
    if (elements.length === 0) return;
    
    animate(
      elements,
      { y: [-20, 0], opacity: [0, 100], filter: ["blur(4px)", "blur(0px)"] },
      { delay: stagger(0.2, { startDelay: 0.1 }), duration: 0.6 }
    );

    const checkIfLoggedIn = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setLoggedIn(true)
    }

    checkIfLoggedIn()
    }, []);


  return (
    <div className="h-screen w-full overflow-hidden relative bg-gradient-to-b from-sky-400 via-sky-300 to-orange-200">
      {/* Logo */}
      <div className="absolute top-8 left-10 z-20" ref={el => homeElementsRef.current[0] = el}>
        <div className="flex items-center gap-4 text-white">
          <img src="/alpha.svg" className="invert brightness-0 w-6"></img>
          <span className="text-3xl font-serif tracking-tight">Atrium</span>
        </div>
      </div>

      {/* Dashboard Button */}
      <div className="absolute top-8 right-10 z-20" ref={el => homeElementsRef.current[1] = el}>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          className="bg-white text-gray-800 px-6 py-2.5 rounded-lg text-base font-medium transition-colors duration-300 hover:bg-blue-50 translate-y-1 cursor-pointer"
          onClick={() => redirect("/dashboard")}>
          
          Dashboard
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 -translate-y-12">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center max-w-4xl">
            {/* Heading */}
            <h1 className="text-8xl font-serif text-white mb-4 tracking-tight leading-none" ref={el => homeElementsRef.current[2] = el}>
              Event Management<br />made simple.
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-white/95 mb-6 max-w-3xl mx-auto leading-relaxed" ref={el => homeElementsRef.current[3] = el}>
              Atrium simplifies university club event hosting with a robust system designed to track attendance, reward continued participation, and allow members to connect.
            </p>
            
            {/* CTA Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className={loggedIn ? `hidden` : `bg-blue-600 text-white px-10 py-3 rounded-xl text-lg font-medium transition-colors duration-300 hover:bg-blue-700 cursor-pointer`} ref={el => homeElementsRef.current[4] = el}
              onClick={() => redirect('/login')}
              >
              Sign up
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mac Window Background - Cut off at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 z-0" ref={el => homeElementsRef.current[5] = el}>
        <div className="w-full h-full bg-orange-300 rounded-t-2xl shadow-2xl translate-y-50">
          {/* Window Controls */}
          <div className="flex gap-2 pt-4 pl-5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}