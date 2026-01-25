import { motion, AnimatePresence } from "motion/react"
import { useState, useRef, useEffect } from "react"
import "@fortawesome/fontawesome-free/css/all.min.css";
import MemberList from "./MemberList";

export default function UserTableEntry({ clubId, orgName, orgLogo, userPoints, memberList }) {
  const [showMembers, setShowMembers] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <tbody className="divide-y divide-gray-200">
        <tr className="hover:bg-gray-50 transition-colors duration-200">
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <img src={orgLogo} className="w-10 h-10 rounded-lg" />
              <div>
                <div className="font-medium text-gray-900">{orgName}</div>
                <div className="text-sm text-gray-500">{memberList.length} members</div>
              </div>
            </div>
          </td>

          <td className="px-6 py-4">
            <span className="text-2xl font-semibold text-blue-600">{userPoints}</span>
          </td>

          <td className="px-6 py-4">
            <div className="space-y-2">
              <motion.a 
                className="font-semibold text-blue-600 cursor-pointer"
                onClick={() => setShowMembers(!showMembers)}
              >
                {showMembers ? 'Hide members' : 'View all members'}
              </motion.a>
            </div>
          </td>

          <td className="px-6 py-4 relative">
            <div ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-ellipsis-v"></i>
              </button>
              {showMenu && (
                <div className="absolute right-6 top-5 w-32 bg-white rounded-lg border border-gray-200 z-50">
                  <button 
                    onClick={() => alert('Leave club')}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 rounded-lg flex justify-center font-semibold"
                  >
                    Leave Club
                  </button>
                </div>
              )}
            </div>
          </td>
        </tr>
      </tbody>

      <AnimatePresence>
        {showMembers && (
          <tbody>
            <tr>
              <td colSpan="4" className="p-0">
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MemberList members={memberList} clubId={clubId} showLinkedIn={true}/>
                </motion.div>
              </td>
            </tr>
          </tbody>
        )}
      </AnimatePresence>
    </>
  )
}