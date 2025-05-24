import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-700">
      <button
        className="w-full px-4 py-4 text-left focus:outline-none"
        onClick={onClick}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">{question}</h3>
          <span className="ml-6 flex-shrink-0">
            <svg
              className={`h-6 w-6 transform ${isOpen ? 'rotate-180' : ''} text-gray-400`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2"
            >
              <p className="text-gray-300">{answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      category: 'What the app does',
      questions: [
        {
          question: 'What is ChainRivals?',
          answer: 'ChainRivals is a competitive platform for smart contract developers to test their skills, solve challenges, and earn rewards across different blockchain networks.'
        },
        {
          question: 'How does the competition system work?',
          answer: 'Users can participate in various smart contract challenges, submit their solutions, and earn rewards based on their performance and the quality of their solutions.'
        }
      ]
    },
    {
      category: 'How to use key features',
      questions: [
        {
          question: 'How do I connect my wallet?',
          answer: 'Click the "Connect Wallet" button in the top right corner and follow the prompts to connect your MetaMask or other supported wallet.'
        },
        {
          question: 'How do I participate in challenges?',
          answer: 'Browse available challenges in the Challenges section, select one you\'re interested in, and click "Join Challenge" to get started. You\'ll need to submit your solution within the specified time frame.'
        }
      ]
    },
    {
      category: 'Account & privacy info',
      questions: [
        {
          question: 'Is my wallet data secure?',
          answer: 'Yes, we only request necessary permissions and never store your private keys. All transactions are processed through your connected wallet.'
        },
        {
          question: 'How can I manage my account settings?',
          answer: 'Visit your profile page and click on "Settings" to manage your account preferences, notifications, and privacy settings.'
        }
      ]
    },
    {
      category: 'Troubleshooting common issues',
      questions: [
        {
          question: 'What if my transaction fails?',
          answer: 'Check your wallet for sufficient funds and gas fees. If the issue persists, try refreshing the page or reconnecting your wallet.'
        },
        {
          question: 'How do I report a bug?',
          answer: 'Use the feedback button in the footer or visit our support page to report any issues you encounter.'
        }
      ]
    }
  ];

  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">Frequently Asked Questions</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search FAQs..."
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredFAQs.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-purple-400">{category.category}</h2>
          {category.questions.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === `${categoryIndex}-${index}`}
              onClick={() => setOpenIndex(
                openIndex === `${categoryIndex}-${index}` ? null : `${categoryIndex}-${index}`
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default FAQ; 