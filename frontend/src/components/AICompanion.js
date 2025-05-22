import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AICompanion = ({ feedback = '', recommendations = [], score = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('feedback');
  const [isTyping, setIsTyping] = useState(true);
  const [displayedFeedback, setDisplayedFeedback] = useState('');
  const [showPulse, setShowPulse] = useState(true);
  const feedbackRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log('AICompanion received recommendations:', recommendations);
    console.log('Recommendations type:', typeof recommendations);
    console.log('Is array?', Array.isArray(recommendations));
  }, [recommendations]);

  // Ensure recommendations is always an array
  const safeRecommendations = Array.isArray(recommendations) ? recommendations : [];

  // Debug logging for safe recommendations
  useEffect(() => {
    console.log('Safe recommendations:', safeRecommendations);
    console.log('Safe recommendations length:', safeRecommendations.length);
  }, [safeRecommendations]);

  // Simulate typing effect for feedback
  useEffect(() => {
    if (feedback) {
      setIsTyping(true);
      let currentText = '';
      let currentIndex = 0;

      const typingInterval = setInterval(() => {
        if (currentIndex < feedback.length) {
          currentText += feedback[currentIndex];
          setDisplayedFeedback(currentText);
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 20);

      return () => clearInterval(typingInterval);
    }
  }, [feedback]);

  // Auto-scroll to bottom when feedback updates
  useEffect(() => {
    if (feedbackRef.current) {
      feedbackRef.current.scrollTop = feedbackRef.current.scrollHeight;
    }
  }, [displayedFeedback]);

  // Pulse animation effect
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setShowPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-purple-500/20"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 p-4 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"
          animate={{
            x: ['0%', '100%'],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <motion.div
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"
                animate={{
                  scale: showPulse ? [1, 1.2, 1] : 1,
                  opacity: showPulse ? [1, 0.8, 1] : 1
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">AI Code Reviewer</h3>
              <p className="text-purple-200 text-sm">Ready to help you improve</p>
            </div>
          </div>
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:text-purple-200 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Score Display */}
            <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Overall Score</span>
                <motion.span
                  className="text-2xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <span className={score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}>
                    {score.toFixed(1)}%
                  </span>
                </motion.span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-2 rounded-full ${
                    score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700 bg-gray-800/50">
              <motion.button
                onClick={() => setActiveTab('feedback')}
                className={`flex-1 py-3 px-4 text-sm font-medium relative ${
                  activeTab === 'feedback'
                    ? 'text-purple-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Feedback
                {activeTab === 'feedback' && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                    layoutId="activeTab"
                  />
                )}
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('recommendations')}
                className={`flex-1 py-3 px-4 text-sm font-medium relative ${
                  activeTab === 'recommendations'
                    ? 'text-purple-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Recommendations
                {activeTab === 'recommendations' && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                    layoutId="activeTab"
                  />
                )}
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-4 bg-gradient-to-b from-gray-800 to-gray-900">
              {activeTab === 'feedback' ? (
                <div
                  ref={feedbackRef}
                  className="prose prose-invert max-w-none"
                >
                  <p className="text-gray-300">
                    {displayedFeedback}
                    {isTyping && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-purple-500 ml-1"
                      />
                    )}
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {safeRecommendations.length > 0 ? (
                    safeRecommendations.map((rec, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 text-gray-300 group"
                      >
                        <motion.span
                          className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-500 text-sm group-hover:bg-purple-500/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {index + 1}
                        </motion.span>
                        <span className="group-hover:text-purple-300 transition-colors">{rec}</span>
                      </motion.li>
                    ))
                  ) : (
                    <motion.li
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-400 italic"
                    >
                      No recommendations available
                    </motion.li>
                  )}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AICompanion; 