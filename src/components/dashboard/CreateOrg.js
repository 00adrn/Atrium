'use client'

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { CgClose } from "react-icons/cg"
import { createClient } from "lib/supabase/client"

const CreateOrg = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [description, setDescription] = useState('')
  const [orgLogo, setOrgLogo] = useState(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()

    const fileExt = orgLogo.name.split('.').pop()
    const logoPath = `${orgName.replaceAll(" ", "_")}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from('org_logos').upload(logoPath, orgLogo)
    if (uploadError) {
      console.log(uploadError)
      return
    }

    const { data: urlData } = supabase.storage.from('org_logos').getPublicUrl(logoPath)
    const logoUrl = urlData.publicUrl
    
    const { data: clubData, error: clubError } = await supabase.from('clubs').insert({ club_name: orgName, club_description: description, club_logo: logoUrl }).select().single()
    if (clubError) console.log(clubError)

    const { data: c_oJoinTableData, error: c_oJoinTableError } = await supabase.from('clubs_officers').insert({ officer_id: user.id, club_id: clubData.id })
    if (c_oJoinTableError) console.log(c_oJoinTableError)
    
    const { data: c_uJoinTableData, error: c_uJoinTableError } = await supabase.from('clubs_users').insert({ user_id: user.id, club_id: clubData.id })
    if (c_uJoinTableError) console.log(c_uJoinTableError)
  
    setSuccess(true)
    setOrgName('')
    setDescription('')
    setOrgLogo(null)
    
    setTimeout(() => {
      setFormOpen(false)
      setSuccess(false)
    }, 500)
  }

  return (
    <section>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        onClick={() => setFormOpen(!formOpen)}
      >
        Create Org
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
                <h2 className="text-2xl text-black font-semibold mb-2">Create an organization</h2>
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
                        Organization Name
                      </label>
                      <input
                        type="text"
                        id="orgName"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="Software Engineering Club"
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label 
                        htmlFor="description" 
                        className="block text-sm font-medium text-gray-900 mb-2"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Making open source projects at UF!"
                        className="w-full px-4 py-2.5 h-24 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none placeholder-gray-400 resize-none"
                      />
                    </div>

                    <div>
                      <label 
                        htmlFor="orgLogo" 
                        className="block text-sm font-medium text-gray-900 mb-2"
                      >
                        Organization Logo
                      </label>
                      <label className="cursor-pointer block">
                        <div className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center">
                          <span className="text-sm">
                            {orgLogo ? orgLogo.name : 'Choose file'}
                          </span>
                        </div>
                        <input
                          type="file"
                          id="orgLogo"
                          accept="image/*"
                          onChange={(e) => setOrgLogo(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <button 
                  type="submit" 
                  className={`${success ? 'bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} hover:cursor-pointer w-full h-10 rounded-lg flex items-center justify-center text-white transition duration-200 mt-2`}
                >
                  {success ? 'Success!' : 'Submit'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default CreateOrg