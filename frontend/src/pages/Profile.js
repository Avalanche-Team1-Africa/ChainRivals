import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { WalletContext } from "../contexts/MetaMaskContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function Profile() {
  const { address } = useParams();
  const { wallet } = useContext(WalletContext);
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("submissions");
  
  const isOwnProfile = wallet && wallet.address.toLowerCase() === address.toLowerCase();

  useEffect(() => {
    // Fetch profile data
    const fetchProfile = async () => {
      try {
        // In a real app, these would be API calls
        // const profileResponse = await axios.get(`${API}/users/${address}`);
        // const submissionsResponse = await axios.get(`${API}/submissions/user/${profileResponse.data.id}`);
        
        // Mock profile data
        const mockProfile = {
          id: "user_" + address.substring(0, 8),
          wallet_address: address,
          username: isOwnProfile ? "YourUsername" : "GasWizard",
          reputation_score: isOwnProfile ? 845 : 728,
          created_at: "2024-01-15T00:00:00Z"
        };
        
        // Mock submissions data
        const mockSubmissions = [
          {
            id: "sub1",
            challenge_id: "1",
            challenge_title: "Gas Optimization: Token Transfer",
            score: 87.5,
            feedback: "Excellent optimization of the transfer function.",
            created_at: "2024-03-10T14:25:00Z",
            challenge_type: "gas_optimization",
            is_winner: true
          },
          {
            id: "sub2",
            challenge_id: "2",
            challenge_title: "Fix the Reentrancy Vulnerability",
            score: 92.0,
            feedback: "Successfully identified and fixed the reentrancy issue.",
            created_at: "2024-03-05T16:42:00Z",
            challenge_type: "security_exploit",
            is_winner: true
          },
          {
            id: "sub3",
            challenge_id: "3",
            challenge_title: "Optimize NFT Minting Function",
            score: 78.5,
            feedback: "Good attempt, but missing some key optimizations.",
            created_at: "2024-02-25T10:15:00Z",
            challenge_type: "gas_optimization",
            is_winner: false
          },
          {
            id: "sub4",
            challenge_id: "4",
            challenge_title: "Secure Multi-Signature Wallet",
            score: 68.0,
            feedback: "Basic implementation, but lacks some security considerations.",
            created_at: "2024-02-18T11:30:00Z",
            challenge_type: "security_exploit",
            is_winner: false
          }
        ];
        
        setProfile(mockProfile);
        setSubmissions(mockSubmissions);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data. Please try again later.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [address, isOwnProfile]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 border-t-purple-500 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Calculate stats
  const totalSubmissions = submissions.length;
  const averageScore = submissions.length > 0 
    ? submissions.reduce((sum, sub) => sum + sub.score, 0) / submissions.length
    : 0;
  const wins = submissions.filter(sub => sub.is_winner).length;

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mr-4 text-2xl font-bold">
                {profile.username.substring(0, 1)}
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">{profile.username}</h1>
                <div className="text-gray-400 text-sm mb-2">
                  {profile.wallet_address.substring(0, 8)}...{profile.wallet_address.slice(-6)}
                </div>
                <div className="text-purple-400 font-medium">{profile.reputation_score} XP</div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-sm text-gray-400 mb-1">Member since</div>
              <div className="font-medium">{formatDate(profile.created_at)}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Total Submissions</div>
          <div className="text-2xl font-bold">{totalSubmissions}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Average Score</div>
          <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Challenges Won</div>
          <div className="text-2xl font-bold">{wins}</div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <div className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveTab("submissions")}
            className={`inline-block py-4 px-4 text-sm font-medium ${
              activeTab === "submissions"
                ? "text-purple-500 border-b-2 border-purple-500"
                : "text-gray-400 hover:text-gray-300 border-b-2 border-transparent"
            }`}
          >
            Submissions
          </button>
          <button
            onClick={() => setActiveTab("badges")}
            className={`inline-block py-4 px-4 text-sm font-medium ${
              activeTab === "badges"
                ? "text-purple-500 border-b-2 border-purple-500"
                : "text-gray-400 hover:text-gray-300 border-b-2 border-transparent"
            }`}
          >
            Achievement Badges
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      {activeTab === "submissions" && (
        <div>
          {submissions.length > 0 ? (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Challenge</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Feedback</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-700 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link to={'/challenges/' + submission.challenge_id} className="hover:text-purple-400 transition">
                            {submission.challenge_title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={
                            submission.challenge_type === "gas_optimization" 
                              ? "bg-green-900 text-green-300 px-2 py-1 rounded-full text-xs"
                              : "bg-red-900 text-red-300 px-2 py-1 rounded-full text-xs"
                          }>
                            {submission.challenge_type === "gas_optimization" ? "Gas Optimization" : "Security Exploit"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-12 bg-gray-700 h-2 rounded-full mr-2 overflow-hidden">
                              <div 
                                className={
                                  submission.score >= 80 
                                    ? "bg-green-500 h-full" 
                                    : submission.score >= 60 
                                      ? "bg-yellow-500 h-full" 
                                      : "bg-red-500 h-full"
                                }
                                style={{ width: `${submission.score}%` }}
                              ></div>
                            </div>
                            <span className="font-mono">{submission.score.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-300 line-clamp-1" title={submission.feedback}>
                            {submission.feedback}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-400 text-sm">{formatDate(submission.created_at)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {submission.is_winner ? (
                            <span className="text-green-400 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                              </svg>
                              Winner
                            </span>
                          ) : (
                            <span className="text-gray-400">Submitted</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-800 rounded-lg">
              <p className="text-gray-400 text-lg mb-4">No submissions yet.</p>
              <Link 
                to="/challenges"
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white transition"
              >
                Browse Challenges
              </Link>
            </div>
          )}
        </div>
      )}
      
      {activeTab === "badges" && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-900/50 border-2 border-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="font-medium">Gas Optimizer</div>
              <div className="text-sm text-gray-400">Level 2</div>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-900/50 border-2 border-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="font-medium">Security Expert</div>
              <div className="text-sm text-gray-400">Level 1</div>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-700/50 border-2 border-gray-600 rounded-lg flex items-center justify-center mx-auto mb-2 opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="font-medium">Vulnerability Hunter</div>
              <div className="text-sm text-gray-400">Locked</div>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-yellow-900/50 border-2 border-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="font-medium">Top Contributor</div>
              <div className="text-sm text-gray-400">Level 3</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;