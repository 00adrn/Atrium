"use client"

import { createClient } from 'lib/supabase/client'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AnimatePresence, motion } from 'motion/react'
import { CgClose } from 'react-icons/cg'

export default function CreateEvent({ clubId }) {
  const router = useRouter();

  const [formOpen, setFormOpen] = useState(false)
  const [eventName, setEventName] = useState("");
  const [pointCount, setPointCount] = useState(null);
  const [links, setlinks] = useState([["", ""]]);

  const generateJoinCode = () => {
    const nums = "0123456789";
    let id = "";
    for (let i = 0; i < 6; i++)
      id += nums[Math.floor(Math.random() * nums.length)];

    console.log(`Generated ID: ${id}`);
    return id;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

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
      let linkString = "";

      for (let i = 0; i < links.length; i++) {
        if (links[i][0] === "" || links[i][1] === "")
          continue;
        linkString += links[i][0] + "|" + links[i][1];
        if (i != links.length - 1)
          linkString += "&&"
      }

      const { data, error } = await supabase.from("events").insert({ club_id: clubId, join_code: joinCode, name: eventName, points: pointCount, links: linkString, type: 1 }).select().single();

      if (data) {
        res = true;
        redirectUrl = `${window.location.origin}/event/host?eventId=${data.id}`;
      }
      else
        console.log(error);

      return { res, redirectUrl };
    }

    createAndRedirect()
  }

  const handleLinkChange = (index, pos, val) => {
    const newLinks = [...links];
    newLinks[index] = [...newLinks[index]];
    newLinks[index][pos] = val;

    console.log(links[index][pos])

    setlinks(newLinks);
  }

  const increaseNumLinks = () => {
    const newLinks = [...links];
    newLinks.push(["", ""]);
    setlinks(newLinks);
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
                    <div>
                      <label
                        htmlFor="eventName"
                        className="block text-sm font-medium text-gray-900 mb-2"
                      >
                        Points per user
                      </label>
                      <input
                        type="number"
                        value={pointCount}
                        placeholder="10"
                        onChange={(e) => setPointCount(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none placeholder-gray-400"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0.9 }}
                    animate={{ opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label
                          htmlFor="eventLinks" // Corrected htmlFor for clarity
                          className="block text-sm font-medium text-gray-900"
                        >
                          Resources
                        </label>
                        <button type="button" className="bg-blue-600 text-white p-1 rounded-full flex items-center justify-center w-6 h-6" onClick={increaseNumLinks}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex flex-col gap-2">
                        {links.map((pair, linkIndex) => (
                        <div key={linkIndex} className="flex gap-4">
                          <input
                            type="text"
                            value={links[linkIndex][0]}
                            onChange={(e) => { handleLinkChange(linkIndex, 0, e.target.value) }}
                            placeholder="Header"
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none placeholder-gray-400"
                          />

                          <input
                            type="text"
                            value={links[linkIndex][1]}
                            onChange={(e) => { handleLinkChange(linkIndex, 1, e.target.value) }}
                            placeholder="URL"
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none placeholder-gray-400"
                          />
                        </div>
                      ))}
                      </div>
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