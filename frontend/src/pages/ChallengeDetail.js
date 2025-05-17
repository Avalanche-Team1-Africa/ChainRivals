import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { MetaMaskContext } from "../contexts/MetaMaskContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Sample initial contract code for gas optimization challenge
const gasOptimizationTemplate = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GasOptimizationChallenge {
    // This is a simple token transfer function
    // Your task is to optimize it for gas efficiency
    
    mapping(address => uint256) public balances;
    
    function initialize(address[] memory addresses, uint256[] memory amounts) public {
        require(addresses.length == amounts.length, "Arrays must be same length");
        
        for (uint256 i = 0; i < addresses.length; i++) {
            balances[addresses[i]] = amounts[i];
        }
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] = balances[msg.sender] - amount;
        balances[to] = balances[to] + amount;
        
        return true;
    }
    
    function getBalance(address account) public view returns (uint256) {
        return balances[account];
    }
}
`;

// Sample initial contract code for security challenge
const securityExploitTemplate = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableContract {
    // This contract has security vulnerabilities
    // Your task is to identify and fix them
    
    mapping(address => uint256) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        (bool success, ) = msg.sender.call{value: amount}("");
        
        balances[msg.sender] -= amount;
    }
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
`;

function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wallet } = useContext(MetaMaskContext);
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  
  // Fetch challenge details
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        // For demo purposes, we'll use mock data
        // In a real app, you'd fetch from the API: await axios.get(`${API}/challenges/${id}`);
        
        // Mock challenge data
        const mockChallenge = {
          id,
          title: id === "1" ? "Gas Optimization: Token Transfer" : "Fix the Reentrancy Vulnerability",
          description: id === "1" 
            ? "Optimize a basic ERC20 transfer function to use minimal gas."
            : "Identify and fix a reentrancy vulnerability in a mock contract.",
          challenge_type: id === "1" ? "gas_optimization" : "security_exploit",
          difficulty: id === "1" ? "beginner" : "intermediate",
          initial_code: id === "1" ? gasOptimizationTemplate : securityExploitTemplate,
          reward: id === "1" ? 100 : 200,
          chain: "avalanche",
          ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        };
        
        setChallenge(mockChallenge);
        setCode(mockChallenge.initial_code);
        
        // Calculate time left
        const endTime = new Date(mockChallenge.ends_at).getTime();
        const now = Date.now();
        setTimeLeft(Math.max(0, Math.floor((endTime - now) / 1000)));
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching challenge:", err);
        setError("Failed to load challenge details.");
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time remaining
  const formatTime = (seconds) => {
    if (seconds === null) return "--:--:--";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle code submission
  const handleSubmit = async () => {
    if (!wallet) {
      setError("Please connect your wallet to submit a solution.");
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // In a real app, this would call the backend API
      // const response = await axios.post(`${API}/submissions`, {
      //   challenge_id: challenge.id,
      //   user_id: wallet.address,
      //   code
      // });
      
      // For demo purposes, we'll use mock evaluation
      setTimeout(() => {
        // Mock AI feedback
        const mockFeedback = challenge.challenge_type === "gas_optimization" 
          ? {
              gas_score: 0.78,
              security_score: 0.65,
              feedback: "Good optimization of the transfer function. Using unchecked math saves gas. Consider further optimizations for storage variables.",
              recommendations: [
                "Consider using uint128 instead of uint256 if the values are small enough",
                "You can optimize further by using assembly for certain operations",
                "Add events for better contract monitoring"
              ]
            }
          : {
              gas_score: 0.45,
              security_score: 0.85,
              feedback: "Successfully identified the reentrancy vulnerability. Good job implementing the checks-effects-interactions pattern.",
              recommendations: [
                "Consider adding a reentrancy guard modifier for extra protection",
                "Implement rate limiting to prevent flash loan attacks",
                "Add more input validation"
              ]
            };
        
        setResult({
          score: challenge.challenge_type === "gas_optimization" ? mockFeedback.gas_score * 100 : mockFeedback.security_score * 100,
          feedback: mockFeedback.feedback,
          recommendations: mockFeedback.recommendations
        });
        setSubmitting(false);
      }, 2000);
      
    } catch (err) {
      console.error("Error submitting solution:", err);
      setError("Failed to submit your solution. Please try again.");
      setSubmitting(false);
    }
  };

  // Reset result to allow submitting again
  const handleReset = () => {
    setResult(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 border-t-purple-500 animate-spin"></div>
      </div>
    );
  }

  if (error && !challenge) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => navigate("/challenges")}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white transition"
        >
          Back to Challenges
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Challenge Header */}
      <div className="mb-6">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{challenge?.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={
                challenge?.challenge_type === "gas_optimization" 
                  ? "bg-green-900 text-green-300 px-3 py-1 rounded-full text-xs"
                  : "bg-red-900 text-red-300 px-3 py-1 rounded-full text-xs"
              }>
                {challenge?.challenge_type === "gas_optimization" ? "Gas Optimization" : "Security Exploit"}
              </span>
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">
                {challenge?.difficulty}
              </span>
              <div className="flex items-center text-xs text-gray-400">
                <img 
                  src={
                    challenge?.chain === "avalanche" 
                      ? "https://upload.wikimedia.org/wikipedia/en/0/03/Avalanche_logo_without_text.png"
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyejSxfv1VRb4-lAhpR2xyG-_-A1XH0n9riw&s"
                  } 
                  alt={challenge?.chain} 
                  className="w-4 h-4 mr-1"
                />
                {challenge?.chain}
              </div>
            </div>
            <p className="text-gray-400">{challenge?.description}</p>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="bg-gray-800 px-4 py-2 rounded-lg mb-2">
              <div className="text-sm text-gray-400 mb-1">Time Remaining:</div>
              <div className="text-xl font-mono">{formatTime(timeLeft)}</div>
            </div>
            
            <div className="bg-gray-800 px-4 py-2 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Reward:</div>
              <div className="text-xl font-medium text-yellow-500">{challenge?.reward} AVAX</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {/* Code Editor */}
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-700 px-4 py-2">
          <h3 className="font-medium">Smart Contract Editor</h3>
        </div>
        <div className="h-[500px]">
          <Editor
            height="100%"
            language="sol"
            theme="vs-dark"
            value={code}
            onChange={setCode}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              tabSize: 2
            }}
          />
        </div>
      </div>
      
      {/* AI Evaluation Result */}
      {result && (
        <div className="bg-gray-800 rounded-lg overflow-hidden mb-6 p-6">
          <h3 className="text-xl font-semibold mb-4">AI Evaluation Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-medium mb-2">Score</h4>
              <div className="flex items-center">
                <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={
                      result.score >= 80 
                        ? "absolute top-0 left-0 h-full bg-green-500"
                        : result.score >= 60
                          ? "absolute top-0 left-0 h-full bg-yellow-500"
                          : "absolute top-0 left-0 h-full bg-red-500"
                    }
                    style={{ width: `${result.score}%` }}
                  ></div>
                </div>
                <span className="ml-4 font-mono text-xl">{result.score.toFixed(1)}%</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2">Feedback</h4>
              <p className="text-gray-300">{result.feedback}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2">Recommendations</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {result.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Submission Buttons */}
      <div className="flex justify-end mt-6">
        {!result ? (
          <button
            onClick={handleSubmit}
            disabled={submitting || !wallet}
            className={
              submitting || !wallet
                ? "bg-gray-700 cursor-not-allowed text-gray-400 px-6 py-3 rounded-lg font-medium"
                : "bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition"
            }
          >
            {submitting ? "Submitting..." : wallet ? "Submit Solution" : "Connect Wallet to Submit"}
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Submit Another Solution
          </button>
        )}
      </div>
    </div>
  );
}

export default ChallengeDetail;