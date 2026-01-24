"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "lib/supabase/client"
import { useRouter } from "next/navigation"

export default function LinkedInForm() {
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
        redirectTo: 'http://localhost:3000/auth/callback',
        scopes: 'openid profile'
      }
    })
    if (error) console.error(error)
    console.log(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    const { data: { user } }  = await supabase.auth.getUser();

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Profile Information
            </h2>
            <p className="text-sm text-gray-600">
              Share your LinkedIn profile and tell us about yourself
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* LinkedIn URL Input */}
            <button onClick={() => signInWithLinkedIn()} className={`bg-blue-600 rounded-lg w-full h-8 hover:cursor-pointer`}>
              {name ? "Logged in" : "Sign in with LinkedIn"}
            </button>
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

            {/* Description Textarea */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                About You
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us a bit about yourself, your interests, and what you're working on..."
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
              <p className="mt-2 text-xs text-gray-500">
                Keep it brief and engaging
              </p>
            </div>

            {/* Submit Button */}
            <button
              // whileHover={{ scale: 1.01 }}
              className="bg-blue-600 text-white px-10 py-3 rounded-xl text-lg font-medium transition-colors duration-300 hover:bg-blue-700 w-lg"
              type="submit"
            >
              Sign up
            </button>
          </form>

          {/* Footer Text */}
          <p className="mt-6 text-xs text-center text-gray-500">
            Your information will be kept confidential
          </p>
        </div>
      </div>
    </div>
  );
}