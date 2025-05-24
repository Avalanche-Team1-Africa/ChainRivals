import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Editor from '@monaco-editor/react';
import { useAIHelperStore } from '../../stores/aiHelperStore';
import { useState } from 'react';

const StarRating = ({ value, onChange }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className="focus:outline-none"
          type="button"
        >
          <svg
            className={`w-8 h-8 ${
              star <= value ? 'text-yellow-400' : 'text-gray-400'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

const WidgetRenderer = ({ widget }) => {
  const { 
    chatMessages, 
    currentMessage, 
    setCurrentMessage, 
    addChatMessage,
    isLoading,
    updateWidget,
    addWidget,
    createButtonWidget,
    createFormWidget,
    createAlertWidget
  } = useAIHelperStore();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      addChatMessage({
        id: Date.now(),
        text: currentMessage.trim(),
        sender: 'user',
        timestamp: new Date().toISOString()
      });

      // Simulate AI response
      setTimeout(() => {
        addChatMessage({
          id: Date.now() + 1,
          text: "I'm analyzing your request. How can I help you with your code?",
          sender: 'ai',
          timestamp: new Date().toISOString()
        });

        // Add feedback button after AI response
        addWidget(createButtonWidget('Give Feedback', () => {
          addWidget(createFormWidget({
            title: 'We\'d Love Your Feedback',
            fields: [
              {
                type: 'rating',
                label: 'How would you rate your experience?',
                required: true
              },
              {
                type: 'textarea',
                label: 'Your Feedback',
                placeholder: 'Tell us what you think...',
                required: true
              },
              {
                type: 'email',
                label: 'Email (optional)',
                placeholder: 'your@email.com'
              }
            ],
            onSubmit: async (formData) => {
              try {
                setLoading(true);
                // TODO: Implement actual submission logic
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
                addWidget(createAlertWidget(
                  'Thank You!',
                  'Your feedback has been submitted successfully.',
                  'success'
                ));
              } catch (err) {
                setError('Failed to submit feedback. Please try again.');
                addWidget(createAlertWidget(
                  'Submission Failed',
                  err.message || 'An unexpected error occurred',
                  'error'
                ));
              } finally {
                setLoading(false);
              }
            }
          }));
        }));
      }, 1000);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const widgetId = widget.id;
    
    // Update widget state to show loading
    updateWidget(widgetId, {
      state: {
        ...widget.state,
        isSubmitting: true
      }
    });

    try {
      await widget.onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      // Update widget state to hide loading
      updateWidget(widgetId, {
        state: {
          ...widget.state,
          isSubmitting: false
        }
      });
    }
  };

  const renderWidget = () => {
    switch (widget.type) {
      case 'chat':
        return (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-[500px] flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {chatMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-50 mt-1 block">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || !currentMessage.trim()}
                className={`px-4 py-2 rounded-lg ${
                  isLoading || !currentMessage.trim()
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                } text-white transition-colors`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </motion.button>
            </form>
          </div>
        );

      case 'button':
        return (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={widget.action}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            {widget.title}
          </motion.button>
        );

      case 'card':
        return (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">{widget.title}</h3>
            <p className="text-gray-300">{widget.content}</p>
          </div>
        );

      case 'form':
        return (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">{widget.title}</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {widget.fields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'rating' && (
                    <StarRating
                      value={formData[field.label] || 0}
                      onChange={(value) => setFormData({ ...formData, [field.label]: value })}
                    />
                  )}
                  
                  {field.type === 'textarea' && (
                    <textarea
                      value={formData[field.label] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.label]: e.target.value })}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="4"
                    />
                  )}
                  
                  {field.type === 'email' && (
                    <input
                      type="email"
                      value={formData[field.label] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.label]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  )}
                </div>
              ))}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={widget.state?.isSubmitting}
                className={`w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors ${
                  widget.state?.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {widget.state?.isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </motion.button>
            </form>
          </div>
        );

      case 'chart':
        return (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">{widget.title}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={widget.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">{widget.title}</h3>
            <div className="h-64">
              <Editor
                height="100%"
                language={widget.language}
                theme="vs-dark"
                value={widget.code}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: "on",
                  folding: true,
                  wordWrap: "on"
                }}
              />
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-white">{widget.title}</h3>
              <span className="text-sm text-gray-400">{widget.status}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${widget.progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-2.5 rounded-full bg-purple-600"
              />
            </div>
          </div>
        );

      case 'alert':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg p-4 ${
              widget.alertType === 'error'
                ? 'bg-red-900/50 border border-red-700'
                : widget.alertType === 'success'
                ? 'bg-green-900/50 border border-green-700'
                : widget.alertType === 'warning'
                ? 'bg-yellow-900/50 border border-yellow-700'
                : 'bg-blue-900/50 border border-blue-700'
            }`}
          >
            <h3 className="text-lg font-semibold text-white mb-2">{widget.title}</h3>
            <p className="text-gray-300">{widget.message}</p>
          </motion.div>
        );

      case 'list':
        return (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">{widget.title}</h3>
            {widget.listType === 'ordered' ? (
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                {widget.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {widget.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return renderWidget();
};

export default WidgetRenderer; 