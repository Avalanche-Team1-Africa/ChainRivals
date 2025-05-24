import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { WalletContext } from "../contexts/MetaMaskContext";
import { apiService } from '../services/api';
import config from '../config';
import AICompanion from "../components/AICompanion";

function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wallet } = useContext(WalletContext);
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
        const challengeData = await apiService.getChallenge(id);
        
        // Ensure we have the initial code
        if (!challengeData.initial_code) {
          console.error("No initial code found in challenge");
          setError("Failed to load challenge code.");
          setLoading(false);
          return;
        }

        setChallenge(challengeData);
        setCode(challengeData.initial_code);
        
        // Calculate time left
        const endTime = new Date(challengeData.ends_at).getTime();
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
      const submissionResult = await apiService.submitSolution(
        challenge.id,
        wallet.address,
        code
      );
      
      setResult(submissionResult);
      setSubmitting(false);
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

  // Helper function to get challenge type color
  const getChallengeTypeColor = (type) => {
    switch (type) {
      case 'gas_optimization':
        return 'bg-green-900 text-green-300';
      case 'security_exploit':
        return 'bg-red-900 text-red-300';
      case 'access_control':
        return 'bg-blue-900 text-blue-300';
      case 'event_logging':
        return 'bg-purple-900 text-purple-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  // Helper function to get challenge type label
  const getChallengeTypeLabel = (type) => {
    switch (type) {
      case 'gas_optimization':
        return 'Gas Optimization';
      case 'security_exploit':
        return 'Security Exploit';
      case 'access_control':
        return 'Access Control';
      case 'event_logging':
        return 'Event Logging';
      default:
        return type;
    }
  };

  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-900 text-green-300';
      case 'intermediate':
        return 'bg-yellow-900 text-yellow-300';
      case 'advanced':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  // Helper function to get chain info
  const getChainInfo = (chainId) => {
    return config.supportedChains[chainId] || {
      name: chainId,
      symbol: chainId.toUpperCase(),
      logo: ''
    };
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
              <span className={`${getChallengeTypeColor(challenge?.challenge_type)} px-3 py-1 rounded-full text-xs`}>
                {getChallengeTypeLabel(challenge?.challenge_type)}
              </span>
              <span className={`${getDifficultyColor(challenge?.difficulty)} px-3 py-1 rounded-full text-xs`}>
                {challenge?.difficulty}
              </span>
              <div className="flex items-center text-xs text-gray-400">
                {challenge?.chain && (
                  <>
                    <img 
                      src={getChainInfo(challenge.chain).logo}
                      alt={getChainInfo(challenge.chain).name}
                      className="w-4 h-4 mr-1"
                    />
                    {getChainInfo(challenge.chain).name}
                  </>
                )}
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
              <div className="text-xl font-medium text-yellow-500">
                {challenge?.reward} {challenge?.chain && getChainInfo(challenge.chain).symbol}
              </div>
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
      
      {/* Initial Smart Contract Code */}
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-700 px-4 py-2 flex justify-between items-center">
          <h3 className="font-medium">Initial Smart Contract Code</h3>
          <span className="text-sm text-gray-400">Read-only</span>
        </div>
        <div className="h-[300px]">
          {challenge?.initial_code ? (
            <Editor
              height="100%"
              language="sol"
              theme="vs-dark"
              value={challenge.initial_code}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                tabSize: 2,
                readOnly: true,
                lineNumbers: "on",
                folding: true,
                wordWrap: "on"
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Loading initial code...
            </div>
          )}
        </div>
      </div>

      {/* Solution Editor */}
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-700 px-4 py-2">
          <h3 className="font-medium">Your Solution</h3>
        </div>
        <div className="h-[500px]">
          {code ? (
            <Editor
              height="100%"
              language="sol"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                tabSize: 2,
                lineNumbers: "on",
                folding: true,
                wordWrap: "on"
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Loading editor...
            </div>
          )}
        </div>
      </div>
      
      {/* AI Evaluation Result */}
      {result && (
        <div className="mb-6">
          <AICompanion
            feedback={result.feedback}
            recommendations={result.recommendations}
            score={result.score}
          />
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