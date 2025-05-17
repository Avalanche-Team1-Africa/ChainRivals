import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Fetch leaderboard data
    const fetchLeaderboard = async () => {
      try {
        // For demo purposes, use mock data
        // In a real app: const response = await axios.get(`${API}/leaderboard`);
        
        // Mock leaderboard data
        const mockData = [
          {
            user_id: "1",
            username: "GasWizard",
            wallet_address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
            submission_count: 28,
            average_score: 87.4,
            wins: 12,
            reputation_score: 845,
            chain: "avalanche"
          },
          {
            user_id: "2",
            username: "SecuritySage",
            wallet_address: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
            submission_count: 19,
            average_score: 82.1,
            wins: 8,
            reputation_score: 728,
            chain: "celo"
          },
          {
            user_id: "3",
            username: "CryptoNinja",
            wallet_address: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
            submission_count: 34,
            average_score: 79.8,
            wins: 10,
            reputation_score: 712,
            chain: "polygon"
          },
          {
            user_id: "4",
            username: "EtherExplorer",
            wallet_address: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e",
            submission_count: 23,
            average_score: 76.5,
            wins: 7,
            reputation_score: 654,
            chain: "avalanche"
          },
          {
            user_id: "5",
            username: "ChainChampion",
            wallet_address: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
            submission_count: 15,
            average_score: 73.2,
            wins: 5,
            reputation_score: 615,
            chain: "celo"
          },
          {
            user_id: "6",
            username: "OptimizePro",
            wallet_address: "0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a",
            submission_count: 27,
            average_score: 71.9,
            wins: 6,
            reputation_score: 589,
            chain: "lisk"
          },
          {
            user_id: "7",
            username: "CodeCommander",
            wallet_address: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
            submission_count: 18,
            average_score: 68.3,
            wins: 4,
            reputation_score: 542,
            chain: "avalanche"
          },
          {
            user_id: "8",
            username: "BlockBuilder",
            wallet_address: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
            submission_count: 21,
            average_score: 65.7,
            wins: 3,
            reputation_score: 512,
            chain: "polygon"
          }
        ];
        
        setLeaderboardData(mockData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Filter leaderboard data based on selected filter
  const filteredData = filter === "all" 
    ? leaderboardData 
    : leaderboardData.filter(user => user.chain === filter);

  // Handle filter change
  const handleFilterChange = (value) => {
    setFilter(value);
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Leaderboard</h1>
        <p className="text-gray-400">
          Top developers ranked by performance across all challenges.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center mb-6 overflow-x-auto pb-2">
        <span className="text-gray-400 mr-4">Filter by Chain:</span>
        <div className="flex space-x-2">
          <button
            onClick={() => handleFilterChange("all")}
            className={
              filter === "all"
                ? "bg-purple-600 text-white px-4 py-2 rounded-lg font-medium"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition"
            }
          >
            All Chains
          </button>
          <button
            onClick={() => handleFilterChange("avalanche")}
            className={
              filter === "avalanche"
                ? "bg-purple-600 text-white px-4 py-2 rounded-lg font-medium"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition"
            }
          >
            Avalanche
          </button>
          <button
            onClick={() => handleFilterChange("celo")}
            className={
              filter === "celo"
                ? "bg-purple-600 text-white px-4 py-2 rounded-lg font-medium"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition"
            }
          >
            Celo
          </button>
          <button
            onClick={() => handleFilterChange("polygon")}
            className={
              filter === "polygon"
                ? "bg-purple-600 text-white px-4 py-2 rounded-lg font-medium"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition"
            }
          >
            Polygon
          </button>
          <button
            onClick={() => handleFilterChange("lisk")}
            className={
              filter === "lisk"
                ? "bg-purple-600 text-white px-4 py-2 rounded-lg font-medium"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition"
            }
          >
            Lisk
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Developer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Average Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Wins</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Reputation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Chain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredData.map((user, index) => (
                <tr key={user.user_id} className="hover:bg-gray-700 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg font-semibold">{index + 1}</span>
                      {index < 3 && (
                        <svg className={
                          index === 0 
                            ? "w-5 h-5 ml-2 text-yellow-400" 
                            : index === 1 
                              ? "w-5 h-5 ml-2 text-gray-400" 
                              : "w-5 h-5 ml-2 text-yellow-700"
                          } 
                          fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                        >
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={'/profile/' + user.wallet_address} className="flex items-center hover:text-purple-400 transition">
                      <div className="w-8 h-8 bg-purple-900 rounded-full flex items-center justify-center mr-3">
                        {user.username.substring(0, 1)}
                      </div>
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-xs text-gray-400">
                          {user.wallet_address.substring(0, 6)}...{user.wallet_address.slice(-4)}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-opacity-50 bg-gray-700">
                      {user.average_score.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono">{user.wins}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono">{user.submission_count}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-purple-400 font-medium">{user.reputation_score} XP</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={
                          user.chain === "avalanche" 
                            ? "https://upload.wikimedia.org/wikipedia/en/0/03/Avalanche_logo_without_text.png"
                            : user.chain === "celo"
                              ? "https://cryptologos.cc/logos/celo-celo-logo.png"
                              : user.chain === "polygon"
                                ? "https://cryptologos.cc/logos/polygon-matic-logo.png"
                                : "https://cryptologos.cc/logos/lisk-lsk-logo.png"
                        } 
                        alt={user.chain} 
                        className="w-4 h-4 mr-1"
                      />
                      <span className="capitalize">{user.chain}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No data available for this chain.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;