import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductTour = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (hasSeenTour) {
      setIsVisible(false);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenTour', 'true');
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-lg w-full mx-4 bg-gray-800 rounded-lg shadow-xl"
          >
            {/* Tooltip Arrow */}
            <div
              className="absolute w-4 h-4 bg-gray-800 transform rotate-45"
              style={{
                left: currentStepData.arrowPosition?.left || '50%',
                top: currentStepData.arrowPosition?.top || '-8px',
                marginLeft: currentStepData.arrowPosition?.marginLeft || '-8px'
              }}
            />

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                {currentStepData.title}
              </h3>
              <p className="text-gray-300 mb-6">
                {currentStepData.content}
              </p>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className={`px-4 py-2 rounded-lg ${
                      currentStep === 0
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </button>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-white"
                >
                  Skip Tour
                </button>
              </div>

              {/* Progress */}
              <div className="mt-4 flex justify-center space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep
                        ? 'bg-purple-600'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductTour; 