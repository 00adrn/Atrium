import { motion } from "motion/react";
import { useState, useMemo, useEffect } from "react";
import { CgClose } from "react-icons/cg"

export default function AttendeesPopup({ isOpen, onClose, attendees }) {
  
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  const filteredAttendees = useMemo(() => {
    if (!attendees) return [];
    
    if (!search.trim()) return attendees;
    
    return attendees.filter(member =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [attendees, search]);

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/40 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div
          className="bg-white w-full max-w-4xl rounded-xl shadow-xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-xl font-semibold text-gray-900">
              Event Attendees
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
            <CgClose 
              className='hover:text-red-600 transition-colors duration-200' 
              size={24} 
            />
            </button>
          </div>

          <div className="px-6 py-4 border-b bg-gray-50">
            <input
              type="text"
              placeholder="Search attendees..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Points
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredAttendees.length > 0 ? (
                  filteredAttendees.map((member, index) => (
                    <tr key={member.id || `${member.name}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <span className="font-medium text-gray-900">
                            {member.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        {member.description}
                      </td>

                      <td className="px-6 py-4 text-lg font-semibold text-gray-900">
                        {member.points}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => alert("Add points")}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          <i className="fas fa-plus"></i>
                          Add Points
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No attendees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </>
  );
}