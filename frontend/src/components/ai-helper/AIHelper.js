import { useEffect } from 'react';
import FloatingAIButton from './FloatingAIButton';
import AIHelperPanel from './AIHelperPanel';
import { useAIHelperStore } from '../../stores/aiHelperStore';

const AIHelper = () => {
  const { isOpen, addWidget, createCardWidget, createButtonWidget } = useAIHelperStore();

  // Add initial widgets when panel opens
  useEffect(() => {
    if (isOpen) {
      // Add welcome card
      addWidget(createCardWidget(
        'Welcome to AI Helper',
        'I can help you with code analysis, suggestions, and more. What would you like to do?'
      ));

      // Add action buttons
      addWidget(createButtonWidget('Analyze Current Code', () => {
        console.log('Analyzing code...');
      }));

      addWidget(createButtonWidget('Get Suggestions', () => {
        console.log('Getting suggestions...');
      }));
    }
  }, [isOpen, addWidget, createCardWidget, createButtonWidget]);

  return (
    <>
      <FloatingAIButton />
      <AIHelperPanel />
    </>
  );
};

export default AIHelper; 