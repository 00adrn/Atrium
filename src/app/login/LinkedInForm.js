"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import "@fortawesome/fontawesome-free/css/all.min.css";

function LinkedInFormContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const router = useRouter();

  const name = searchParams.get("name");
  const pfp = searchParams.get("pfp") + "&v=" + searchParams.get("v") + "&t=" + searchParams.get("t");
  let firstName, lastName;

  if (name) {
    firstName = name.split(" ")[0];
    lastName = name.split(" ")[1];
  }

  const [formData, setFormData] = useState({
    linkedin: '',
    description: ''
  });

  async function signInWithLinkedIn() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `https://atrium.ink/auth/callback`,
        scopes: 'openid profile'
      }
    })
    if (error) console.log(error)
    console.log(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user)
      console.log("No user")

    const { data, error } = await supabase.from('users').insert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      headshot: pfp,
      linkedin: formData.linkedin,
      description: formData.description
    })

    if (error) {
      console.log(error);
    } else {
      console.log('Data inserted successfully:', data);
    }

    setFormData({
      linkedin: '',
      description: ''
    });

    router.push('/dashboard');
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white flex p-4">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <img
          src="/tower.jpg"
          className="w-full h-full object-cover"
          style={{ borderRadius: '9px' }}
        />
      </div>

      <div className="flex-1 flex justify-center items-start pt-8">
        <div className="w-full max-w-xl">
          <div className="p-8">
            <a onClick={() => router.push("/")} className="cursor-pointer">
              <div className="flex gap-x-6 mb-8">
                <img className="w-15 h-15 translate-y-1" src="/logo_bg.jpg" />
                <div className="mb-8">
                  <p className="font-serif text-7xl text-black">
                    Atrium
                  </p>
                </div>
              </div>
            </a>

            <button className="flex w-full items-center justify-center gap-3 bg-[#0A66C2] hover:bg-[#004182] text-white px-6 py-3 rounded-xl font-medium transition-colors mb-6 -mt-1" onClick={() => signInWithLinkedIn()}>
              <i className={name ? "hidden" : `fab fa-linkedin text-xl`}></i>
              {name ? 'Logged in ✓' : 'Sign in with LinkedIn'}
            </button>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="linkedin"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Computer Science @ UF, picking up Java this semester"
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                className="bg-blue-600 text-white px-10 py-3 rounded-xl text-lg font-medium transition-colors duration-300 hover:bg-blue-700 w-lg mb-5"
                type="submit"
              >
                Sign up
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LinkedInForm() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <LinkedInFormContent />
    </Suspense>
  );
}