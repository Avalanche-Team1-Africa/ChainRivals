import { useState } from "react";
import { Link } from "react-router-dom";

function ChallengeArena({ challenges }) {
  const [filters, setFilters] = useState({
    type: "all",
    difficulty: "all",
    chain: "all"
  });

  // Filter challenges based on current filter state
  const filteredChallenges = challenges.filter(challenge => {
    let matchesType = filters.type === "all" || challenge.challenge_type === filters.type;
    let matchesDifficulty = filters.difficulty === "all" || challenge.difficulty === filters.difficulty;
    let matchesChain = filters.chain === "all" || challenge.chain === filters.chain;
    
    return matchesType && matchesDifficulty && matchesChain;
  });

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Challenge Arena</h1>
        <p className="text-gray-400">
          Browse and participate in smart contract challenges across multiple blockchains.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Challenge Type</label>
            <select 
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="gas_optimization">Gas Optimization</option>
              <option value="security_exploit">Security Exploit</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
            <select 
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filters.difficulty}
              onChange={(e) => handleFilterChange("difficulty", e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Blockchain</label>
            <select 
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filters.chain}
              onChange={(e) => handleFilterChange("chain", e.target.value)}
            >
              <option value="all">All Chains</option>
              <option value="avalanche">Avalanche</option>
              <option value="celo">Celo</option>
              <option value="polygon">Polygon</option>
              <option value="lisk">Lisk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => (
          <Link key={challenge.id} to={'/challenges/' + challenge.id}>
            <div className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-900/20 transition">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={
                    challenge.challenge_type === "gas_optimization" 
                      ? "bg-green-900 text-green-300 px-3 py-1 rounded-full text-xs"
                      : "bg-red-900 text-red-300 px-3 py-1 rounded-full text-xs"
                  }>
                    {challenge.challenge_type === "gas_optimization" ? "Gas Optimization" : "Security Exploit"}
                  </span>
                  <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">
                    {challenge.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{challenge.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-yellow-500 font-medium">{challenge.reward} AVAX</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <img 
                      src={
                        challenge.chain === "avalanche" 
                          ? "https://upload.wikimedia.org/wikipedia/en/0/03/Avalanche_logo_without_text.png"
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyejSxfv1VRb4-lAhpR2xyG-_-A1XH0n9riw&s"
                      } 
                      alt={challenge.chain} 
                      className="w-4 h-4 mr-1"
                    />
                    {challenge.chain}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-4">No challenges match your current filters.</p>
          <button 
            onClick={() => setFilters({ type: "all", difficulty: "all", chain: "all" })}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default ChallengeArena;