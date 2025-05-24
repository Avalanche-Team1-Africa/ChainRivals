import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Changelog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const changelogData = [
    {
      version: '1.2.0',
      date: '2024-03-15',
      changes: [
        {
          type: 'feature',
          title: 'New Challenge System',
          description: 'Introducing a more competitive and rewarding challenge system.'
        },
        {
          type: 'improvement',
          title: 'Enhanced UI/UX',
          description: 'Improved navigation and visual feedback across the platform.'
        },
        {
          type: 'fix',
          title: 'Bug Fixes',
          description: 'Fixed various issues with wallet connection and transaction processing.'
        }
      ]
    },
    {
      version: '1.1.0',
      date: '2024-02-28',
      changes: [
        {
          type: 'feature',
          title: 'Profile Customization',
          description: 'Added ability to customize your profile with avatars and badges.'
        },
        {
          type: 'improvement',
          title: 'Performance Optimization',
          description: 'Improved loading times and overall platform performance.'
        }
      ]
    }
  ];

  const getChangeTypeColor = (type) => {
    switch (type) {
      case 'feature':
        return 'bg-green-100 text-green-800';
      case 'improvement':
        return 'bg-blue-100 text-blue-800';
      case 'fix':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">What's New</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-8">
                {changelogData.map((release) => (
                  <div key={release.version} className="border-b border-gray-200 pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">
                        Version {release.version}
                      </h3>
                      <span className="text-gray-500">
                        {new Date(release.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {release.changes.map((change, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3"
                        >
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeTypeColor(
                              change.type
                            )}`}
                          >
                            {change.type.charAt(0).toUpperCase() +
                              change.type.slice(1)}
                          </span>
                          <div>
                            <h4 className="font-medium">{change.title}</h4>
                            <p className="text-gray-600 text-sm">
                              {change.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Changelog; 