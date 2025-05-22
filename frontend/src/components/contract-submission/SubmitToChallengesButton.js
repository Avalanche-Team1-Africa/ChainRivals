import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SubmitToChallengesButton = ({ submission }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/challenges');
    } catch (error) {
      console.error('Failed to submit contract:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg p-6 space-y-4"
    >
      <h2 className="text-2xl font-semibold">Submit to Challenges</h2>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-300">Submission Details</h3>
        <div className="bg-gray-700 rounded-lg p-4 space-y-2">
          <p className="text-gray-300">
            <span className="font-medium">Name:</span> {submission.name}
          </p>
          <p className="text-gray-300">
            <span className="font-medium">Solidity Version:</span> {submission.solidityVersion}
          </p>
          <p className="text-gray-300">
            <span className="font-medium">Status:</span>{' '}
            <span className="text-green-400">Ready to Submit</span>
          </p>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full py-3 rounded-lg text-white font-medium transition ${
          isSubmitting
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Submitting...</span>
          </div>
        ) : (
          'Submit to Challenge Arena'
        )}
      </button>

      <p className="text-sm text-gray-400 text-center">
        By submitting, you agree to our terms and conditions for challenge submissions.
      </p>
    </motion.div>
  );
};

export default SubmitToChallengesButton; 