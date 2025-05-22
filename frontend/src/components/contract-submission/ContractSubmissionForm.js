import { useState } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';

const SOLIDITY_VERSIONS = [
  '0.8.0',
  '0.8.1',
  '0.8.2',
  '0.8.3',
  '0.8.4',
  '0.8.5',
  '0.8.6',
  '0.8.7',
  '0.8.8',
  '0.8.9',
  '0.8.10',
  '0.8.11',
  '0.8.12',
  '0.8.13',
  '0.8.14',
  '0.8.15',
  '0.8.16',
  '0.8.17',
  '0.8.18',
  '0.8.19',
  '0.8.20'
];

const ContractSubmissionForm = ({ submission, setSubmission, onFileDrop }) => {
  const [inputMethod, setInputMethod] = useState('code'); // 'code' or 'file'

  const handleFileChange = (event) => {
    const file = event.target.files[0];
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

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Contract Name
        </label>
        <input
          type="text"
          value={submission.name}
          onChange={(e) => setSubmission(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter contract name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={submission.description}
          onChange={(e) => setSubmission(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
          placeholder="Describe your contract's purpose and functionality"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Solidity Version
        </label>
        <select
          value={submission.solidityVersion}
          onChange={(e) => setSubmission(prev => ({ ...prev, solidityVersion: e.target.value }))}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Select Solidity version"
        >
          {SOLIDITY_VERSIONS.map(version => (
            <option key={version} value={version}>
              {version}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Input Method
        </label>
        <div className="flex space-x-4">
          <button
            onClick={() => setInputMethod('code')}
            className={`px-4 py-2 rounded-lg ${
              inputMethod === 'code'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            Paste Code
          </button>
          <button
            onClick={() => setInputMethod('file')}
            className={`px-4 py-2 rounded-lg ${
              inputMethod === 'file'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            Upload File
          </button>
        </div>
      </div>

      {inputMethod === 'file' ? (
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".sol"
            onChange={handleFileChange}
            className="hidden"
            id="contract-file"
          />
          <label
            htmlFor="contract-file"
            className="cursor-pointer text-purple-400 hover:text-purple-300"
          >
            Click to upload or drag and drop
            <br />
            <span className="text-sm text-gray-400">.sol files only</span>
          </label>
        </div>
      ) : (
        <div className="h-96 border border-gray-600 rounded-lg overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="solidity"
            value={submission.sourceCode}
            onChange={(value) => setSubmission(prev => ({ ...prev, sourceCode: value }))}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true
            }}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Optional Metadata (JSON)
        </label>
        <textarea
          value={submission.metadata || ''}
          onChange={(e) => setSubmission(prev => ({ ...prev, metadata: e.target.value }))}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
          placeholder="Enter any additional metadata or ABI in JSON format"
        />
      </div>
    </div>
  );
};

export default ContractSubmissionForm; 