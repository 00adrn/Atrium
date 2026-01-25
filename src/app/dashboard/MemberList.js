import { motion } from "motion/react"
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function MemberList({ members, showLinkedIn = true, showPoints = false }) {

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gray-50 p-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Member</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                {showPoints && (
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Points</th>
                )}
                <th className="px-6 py-3 w-0"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members?.map((member, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={member.headshot} className="w-10 h-10 rounded-full" />
                      <span className="font-medium text-gray-900">{member.first_name} {member.last_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <span className="text-sm text-gray-600">{member.description}</span>
                  </td>
                  {showPoints && (
                    <td className="px-6 py-4">
                      <span className="text-lg font-semibold text-gray-900">{member.points}</span>
                    </td>
                  )}
                  <td className="px-6 py-4 w-0 whitespace-nowrap">
                    {showLinkedIn ? (
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        <i className="fab fa-linkedin"></i>
                        LinkedIn
                      </a>
                    ) : (
                      <button 
                        onClick={() => alert('Add points')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        <i className="fas fa-plus"></i>
                        Add Points
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}