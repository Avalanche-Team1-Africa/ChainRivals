import { motion } from 'framer-motion';

const AIScreeningResults = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return 'bg-green-900/20 border-green-500';
      case 'rejected':
        return 'bg-red-900/20 border-red-500';
      case 'flagged':
        return 'bg-yellow-900/20 border-yellow-500';
      default:
        return 'bg-gray-900/20 border-gray-500';
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'passed':
        return 'Contract passed initial screening';
      case 'rejected':
        return 'Contract failed screening';
      case 'flagged':
        return 'Contract needs review';
      case 'screening':
        return 'Analyzing contract...';
      default:
        return 'Waiting for analysis';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`border rounded-lg p-6 ${getStatusColor(status)}`}
    >
      <h2 className="text-2xl font-semibold mb-4">AI Analysis Results</h2>
      
      {status === 'screening' ? (
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <p className="text-gray-300">{getStatusMessage(status)}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-300">{getStatusMessage(status)}</p>
          
          {status === 'passed' && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-green-400">Summary</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>No critical vulnerabilities detected</li>
                <li>Code follows best practices</li>
                <li>Gas optimization opportunities identified</li>
              </ul>
            </div>
          )}
          
          {status === 'rejected' && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-red-400">Issues Found</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Critical security vulnerabilities detected</li>
                <li>Code quality issues need addressing</li>
                <li>Missing important safety checks</li>
              </ul>
            </div>
          )}
          
          {status === 'flagged' && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-yellow-400">Review Required</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Potential security concerns identified</li>
                <li>Complex logic needs manual review</li>
                <li>Some best practices not followed</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AIScreeningResults; 