import { Link } from "react-router-dom";
import { useContext } from "react";
import { MetaMaskContext } from "../contexts/MetaMaskContext";

function Homepage({ challenges }) {
  const { wallet } = useContext(MetaMaskContext);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-extrabold mb-6">
            The Smart Contract Battleground
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Compete in gas optimization and security challenges, earn rewards, and build your Web3 reputation across multiple chains.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/challenges"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition"
            >
              Start Competing
            </Link>
            {!wallet && (
              <button
                className="bg-transparent border-2 border-white hover:bg-white hover:text-purple-900 text-white px-8 py-3 rounded-lg text-lg font-medium transition"
              >
                Learn More
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Challenges */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Challenges</h2>
          <Link
            to="/challenges"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.slice(0, 3).map((challenge) => (
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
                            : "https://cryptologos.cc/logos/celo-celo-logo.png"
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
      </section>

      {/* How It Works */}
      <section className="py-10">
        <h2 className="text-3xl font-bold mb-12 text-center">How ChainRivals Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <div className="bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect</h3>
            <p className="text-gray-400">
              Link your wallet to join the platform and access challenges across multiple chains.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <div className="bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Compete</h3>
            <p className="text-gray-400">
              Solve gas optimization and security challenges using our built-in code editor.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <div className="bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Earn</h3>
            <p className="text-gray-400">
              Win rewards in AVAX or CELO and build your reputation with on-chain NFT badges.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="bg-gray-800 rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Platform Stats</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-4xl font-bold text-purple-400 mb-2">150+</p>
            <p className="text-gray-400">Active Challenges</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-purple-400 mb-2">25K+</p>
            <p className="text-gray-400">AVAX Rewarded</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-purple-400 mb-2">3.5K+</p>
            <p className="text-gray-400">Developers</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-purple-400 mb-2">4</p>
            <p className="text-gray-400">Chains Supported</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage;