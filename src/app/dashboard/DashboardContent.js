"use client"

import { useState } from 'react';

export default function DashboardContent() {
  const [hasOrgs, setHasOrgs] = useState(true);

  return (
    <div className="min-h-screen bg-white p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-end mb-4">
          <div className="flex gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              Create Org
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              Join Event
            </button>
          </div>
        </div>

        {!hasOrgs ? (
          <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
            <div className="max-w-md mx-auto">
              <img src="/door.png" className='w-25 flex items-center justify-center mx-auto -translate-y-5'/>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Get Started</h2>
              <p className="text-gray-600">
                Create your first organization or join an event to start tracking your involvement, earn points, and connect with others.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Organization</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Your Points</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Membership Info</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src="/org-logo.jpg" className="w-10 h-10 rounded-lg" />
                      <div>
                        <div className="font-medium text-gray-900">Software Engineering Club</div>
                        <div className="text-sm text-gray-500">50 members</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-2xl font-semibold text-blue-600">125</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <img src="/member1.jpg" className="w-6 h-6 rounded-full" />
                        <span className="text-sm text-gray-700">John Doe</span>
                        <span className="text-sm font-medium text-gray-900">250 pts</span>
                        <a href="#" className="text-sm text-blue-600 hover:underline">LinkedIn</a>
                      </div>
                      <div className="flex items-center gap-3">
                        <img src="/member2.jpg" className="w-6 h-6 rounded-full" />
                        <span className="text-sm text-gray-700">Jane Smith</span>
                        <span className="text-sm font-medium text-gray-900">180 pts</span>
                        <a href="#" className="text-sm text-blue-600 hover:underline">LinkedIn</a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}