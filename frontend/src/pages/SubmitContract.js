import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAIHelperStore } from '../stores/aiHelperStore';
import ContractSubmissionForm from '../components/contract-submission/ContractSubmissionForm';
import AIScreeningResults from '../components/contract-submission/AIScreeningResults';
import SubmitToChallengesButton from '../components/contract-submission/SubmitToChallengesButton';

const SubmitContract = () => {
  const [submission, setSubmission] = useState({
    name: '',
    description: '',
    solidityVersion: '0.8.0',
    sourceCode: '',
    status: 'idle'
  });

  const { createAlertWidget, createProgressWidget, createCodeWidget } = useAIHelperStore();

  const handleFileDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSubmission(prev => ({
          ...prev,
          sourceCode: e.target?.result
        }));
      };
      reader.readAsText(file);
    }
  };

  const handleAIScreening = async () => {
    setSubmission(prev => ({ ...prev, status: 'screening' }));
    
    // Create progress widget
    createProgressWidget({
      title: 'AI Screening in Progress',
      progress: 0,
      status: 'processing'
    });

    try {
      // Simulate AI analysis (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create code analysis widget
      createCodeWidget({
        title: 'Initial Analysis',
        code: submission.sourceCode,
        language: 'solidity'
      });

      // Create alert widget with findings
      createAlertWidget({
        title: 'Analysis Complete',
        message: 'Contract passed initial screening. No critical vulnerabilities found.',
        type: 'success'
      });

      setSubmission(prev => ({ ...prev, status: 'passed' }));
    } catch (error) {
      createAlertWidget({
        title: 'Analysis Failed',
        message: 'Failed to analyze contract. Please try again.',
        type: 'error'
      });
      setSubmission(prev => ({ ...prev, status: 'rejected' }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Submit Contract Challenge</h1>
        <p className="text-gray-400 mb-8">
          Submit your smart contract to be tested as a challenge in the arena.
          Our AI will analyze it for security and educational value.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Submission Form */}
          <div className="space-y-6">
            <ContractSubmissionForm
              submission={submission}
              setSubmission={setSubmission}
              onFileDrop={handleFileDrop}
            />
          </div>

          {/* Right Column - AI Analysis Results */}
          <div className="space-y-6">
            <AIScreeningResults status={submission.status} />
            
            {submission.status === 'passed' && (
              <SubmitToChallengesButton submission={submission} />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => setSubmission(prev => ({ ...prev, status: 'idle' }))}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition"
          >
            Reset
          </button>
          
          <button
            onClick={handleAIScreening}
            disabled={!submission.sourceCode || submission.status === 'screening'}
            className={`px-6 py-3 rounded-lg text-white transition ${
              !submission.sourceCode || submission.status === 'screening'
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {submission.status === 'screening' ? 'Analyzing...' : 'Run AI Screening'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SubmitContract; 