"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "lib/supabase/client"

export default function LinkedInForm(){
  const supabase = createClient()
  const searchParams = useSearchParams()
  const profileResponse = searchParams.get('profileResponse')

  const [formData, setFormData] = useState({
    linkedin: '',
    description: ''
  });

  useEffect(() => {
    console.log(profileResponse)
  }, [])

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
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
          <div className="space-y-6">
            {/* LinkedIn URL Input */}
            <button onClick={() => signInWithLinkedIn()} className="rounded-lg w-full bg-blue-600 h-8 hover:cursor-pointer">
              LinkedIn OAuth
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
              onClick={() => redirect('/login')}
              >
              Sign up
            </button>
          </div>

          {/* Footer Text */}
          <p className="mt-6 text-xs text-center text-gray-500">
            Your information will be kept confidential
          </p>
        </div>
      </div>
    </div>
  );
}