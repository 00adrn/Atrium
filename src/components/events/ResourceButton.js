import { motion, AnimatePresence } from "motion/react";
import { useState, useRef } from "react";
import LinkCard from "@/components/events/LinkCard"

export default function ResourceTableButton({ resources = [] }) {
  const [showResources, setShowResources] = useState(false);
  const resourcesRef = useRef(null);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Button */}
      <div className="px-6 py-4 border-b border-gray-200 hover:bg-gray-50">
        <motion.button
          type="button"
          className="text-left font-semibold text-blue-600 cursor-pointer hover:text-blue-700"
          onClick={() => {
            setShowResources(prev => !prev);
            setTimeout(() => {
              resourcesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
          }}
        >
          {showResources ? "Hide resources" : "View resources"}
        </motion.button>
      </div>

      {/* Expandable Resources Section */}
      <AnimatePresence>
        {showResources && (
          <motion.div
            ref={resourcesRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Event Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource, index) => (
                  <LinkCard
                    key={index}
                    name={resource[0]}
                    url={resource[1]}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
