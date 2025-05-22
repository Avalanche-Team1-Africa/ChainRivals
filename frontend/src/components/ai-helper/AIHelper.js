import { useEffect } from 'react';
import FloatingAIButton from './FloatingAIButton';
import AIHelperPanel from './AIHelperPanel';
import { useAIHelperStore } from '../../stores/aiHelperStore';

const AIHelper = () => {
  const { 
    isOpen, 
    addWidget, 
    createCardWidget, 
    createButtonWidget,
    createProgressWidget,
    createAlertWidget,
    createListWidget,
    createChatWidget,
    isLoading,
    error,
    setLoading,
    setError,
    clearError,
    clearChat
  } = useAIHelperStore();

  // Add initial widgets when panel opens
  useEffect(() => {
    if (isOpen) {
      // Clear any existing error and chat
      clearError();
      clearChat();

      // Add welcome card
      addWidget(createCardWidget(
        'Welcome to ChainRivals',
        'I can help you with code analysis, suggestions, and more. What would you like to do?'
      ));

      // Add chat widget
      addWidget(createChatWidget());

      // Add action buttons
      addWidget(createButtonWidget('Analyze Current Code', async () => {
        try {
          setLoading(true);
          clearError();
          
          // Add progress widget
          const progressWidget = createProgressWidget(
            'Analyzing Code',
            'Starting analysis...',
            0
          );
          addWidget(progressWidget);

          // Simulate analysis steps
          const steps = [
            { progress: 25, status: 'Checking syntax...' },
            { progress: 50, status: 'Analyzing patterns...' },
            { progress: 75, status: 'Generating suggestions...' },
            { progress: 100, status: 'Analysis complete!' }
          ];

          for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            addWidget(createProgressWidget(
              'Analyzing Code',
              step.status,
              step.progress
            ));
          }

          // Add results
          addWidget(createListWidget(
            'Analysis Results',
            [
              'Code follows best practices',
              'No security vulnerabilities found',
              'Consider adding more comments',
              'Function could be optimized for gas usage'
            ],
            'ordered'
          ));

        } catch (err) {
          setError('Failed to analyze code. Please try again.');
          addWidget(createAlertWidget(
            'Analysis Failed',
            err.message || 'An unexpected error occurred',
            'error'
          ));
        } finally {
          setLoading(false);
        }
      }));

      addWidget(createButtonWidget('Get Suggestions', async () => {
        try {
          setLoading(true);
          clearError();

          // Add progress widget
          const progressWidget = createProgressWidget(
            'Generating Suggestions',
            'Processing...',
            0
          );
          addWidget(progressWidget);

          // Simulate suggestion generation
          await new Promise(resolve => setTimeout(resolve, 1500));
          addWidget(createProgressWidget(
            'Generating Suggestions',
            'Almost done...',
            100
          ));

          // Add suggestions
          addWidget(createListWidget(
            'Suggested Improvements',
            [
              'Use uint256 instead of uint128 for better compatibility',
              'Add events for important state changes',
              'Implement access control for admin functions',
              'Consider using OpenZeppelin contracts'
            ]
          ));

        } catch (err) {
          setError('Failed to generate suggestions. Please try again.');
          addWidget(createAlertWidget(
            'Suggestion Generation Failed',
            err.message || 'An unexpected error occurred',
            'error'
          ));
        } finally {
          setLoading(false);
        }
      }));
    }
  }, [isOpen, addWidget, createCardWidget, createButtonWidget, createProgressWidget, createAlertWidget, createListWidget, createChatWidget, setLoading, setError, clearError, clearChat]);

  return (
    <>
      <FloatingAIButton />
      <AIHelperPanel />
    </>
  );
};

export default AIHelper; 