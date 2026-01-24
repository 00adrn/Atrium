"use client"

import { createClient } from 'lib/supabase/client'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AnimatePresence, motion } from 'motion/react'
import { CgClose } from 'react-icons/cg'

export default function CreateEvent() {
    const router = useRouter();

    const [formOpen, setFormOpen] = useState(false)
    const [eventName, setEventName] = useState("");
    const clubId = useState("cabf4635-3ca8-45c3-8c06-6e2e7ef23c0d");
    const [links, setlinks] = useState("");

    // const createAndRedirect = async () => {
    //     const { res, redirectUrl } = await generateEvent();

    //     if (res)
    //         router.push(redirectUrl);
    // }

    // const generateEvent = async () => {
    //     const joinCode = generateJoinCode();
    //     const supabase = createClient();

    //     let res = false;
    //     let redirectUrl = "";


    //     const { data, error } = await supabase.from("events").insert({ club_id: clubId, join_code: joinCode, name: eventName, links: links, type: 1 }).select().single();

    //     if (data) {
    //         res = true;
    //         redirectUrl = `/event/host?eventId=${data.id}`;
    //     }
    //     else
    //         console.log(error);

    //     return { res, redirectUrl };
    // }

    const generateJoinCode = () => {
        const nums = "0123456789";
        let id = "";
        for (let i = 0; i < 6; i++)
            id += nums[Math.floor(Math.random() * nums.length)];

        console.log(`Generated ID: ${id}`);
        return id;
    }

    const handleSubmit = () => {
      const createAndRedirect = async () => {
          const { res, redirectUrl } = await generateEvent();

          if (res)
              router.push(redirectUrl);
      }

      const generateEvent = async () => {
          const joinCode = generateJoinCode();
          const supabase = createClient();

          let res = false;
          let redirectUrl = "";


          const { data, error } = await supabase.from("events").insert({ club_id: clubId, join_code: joinCode, name: eventName, links: links, type: 1 }).select().single();

          if (data) {
              res = true;
              redirectUrl = `/event/host?eventId=${data.id}`;
          }
          else
              console.log(error);

          return { res, redirectUrl };
      }

      createAndRedirect()
    }

    return (
      <section>
        <button
          className="bg-green-700 hover:bg-green-800 hover:cursor-pointer text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          onClick={() => setFormOpen(!formOpen)}
        >
          Create Event
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
                className="relative flex flex-col w-lg border border-gray-200 rounded-xl bg-white p-4"
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

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h2 className="text-2xl text-black font-semibold mb-2">Create an event</h2>
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
                          htmlFor="eventName" 
                          className="block text-sm font-medium text-gray-900 mb-2"
                        >
                          Event Name
                        </label>
                        <input
                          type="text"
                          value={eventName}
                          onChange={(e) => setEventName(e.target.value)}
                          placeholder="GBM #1"
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none placeholder-gray-400"
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <button 
                    type="submit" 
                    className='bg-blue-600 hover:bg-blue-700 hover:cursor-pointer w-full h-10 rounded-lg flex items-center justify-center text-white transition duration-200 mt-2'
                  >
                    Submit
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    );
}