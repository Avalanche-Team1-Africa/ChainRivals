import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Editor from '@monaco-editor/react';
import { useAIHelperStore } from '../../stores/aiHelperStore';

const WidgetRenderer = ({ widget }) => {
  const { 
    chatMessages, 
    currentMessage, 
    setCurrentMessage, 
    addChatMessage,
    isLoading 
  } = useAIHelperStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      addChatMessage({
        id: Date.now(),
        text: currentMessage.trim(),
        sender: 'user',
        timestamp: new Date().toISOString()
      });
      // Here you would typically make an API call to get the AI response
      // For now, we'll simulate a response
      setTimeout(() => {
        addChatMessage({
          id: Date.now() + 1,
          text: "I'm analyzing your request. How can I help you with your code?",
          sender: 'ai',
          timestamp: new Date().toISOString()
        });
      }, 1000);
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
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">{widget.title}</h3>
            {widget.fields.map((field, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {field.label}
                </label>
                {field.type === 'text' && (
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                )}
                {field.type === 'select' && (
                  <select
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={widget.onSubmit}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors mt-4"
            >
              {widget.submitLabel || 'Submit'}
            </motion.button>
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
        const alertColors = {
          info: 'bg-blue-900/50 border-blue-700 text-blue-300',
          success: 'bg-green-900/50 border-green-700 text-green-300',
          warning: 'bg-yellow-900/50 border-yellow-700 text-yellow-300',
          error: 'bg-red-900/50 border-red-700 text-red-300'
        };

        return (
          <div className={`rounded-lg p-4 border ${alertColors[widget.alertType]}`}>
            <h3 className="font-semibold mb-2">{widget.title}</h3>
            <p>{widget.message}</p>
          </div>
        );

      case 'list':
        const ListComponent = widget.listType === 'ordered' ? 'ol' : 'ul';
        const listStyle = widget.listType === 'ordered' ? 'list-decimal' : 'list-disc';

        return (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">{widget.title}</h3>
            <ListComponent className={`${listStyle} list-inside space-y-2 text-gray-300`}>
              {widget.items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                </motion.li>
              ))}
            </ListComponent>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      {renderWidget()}
    </motion.div>
  );
};

export default WidgetRenderer; 