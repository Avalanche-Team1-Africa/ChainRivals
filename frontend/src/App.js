import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import "./App.css";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./pages/Homepage";
import ChallengeArena from "./pages/ChallengeArena";
import ChallengeDetail from "./pages/ChallengeDetail";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";

// MetaMask Context
import { MetaMaskContextProvider } from "./contexts/MetaMaskContext";

// Monaco Editor
import Editor from "@monaco-editor/react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// App Component
function App() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch challenges when component mounts
    const fetchChallenges = async () => {
      try {
        const response = await axios.get(`${API}/challenges`);
        setChallenges(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching challenges:", err);
        setError("Failed to load challenges. Please try again later.");
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Sample challenges for initial UI display when API isn't ready
  const sampleChallenges = [
    {
      id: "1",
      title: "Gas Optimization: Token Transfer",
      description: "Optimize a basic ERC20 transfer function to use minimal gas.",
      challenge_type: "gas_optimization",
      difficulty: "beginner",
      reward: 100,
      chain: "avalanche"
    },
    {
      id: "2",
      title: "Fix the Reentrancy Vulnerability",
      description: "Identify and fix a reentrancy vulnerability in a mock contract.",
      challenge_type: "security_exploit",
      difficulty: "intermediate",
      reward: 200,
      chain: "avalanche"
    },
    {
      id: "3",
      title: "Optimize NFT Minting Function",
      description: "Reduce gas costs for an NFT minting function.",
      challenge_type: "gas_optimization",
      difficulty: "advanced",
      reward: 300,
      chain: "celo"
    }
  ];

  // Use sample challenges if the API isn't ready
  const displayChallenges = challenges.length > 0 ? challenges : sampleChallenges;

  return (
    <MetaMaskContextProvider>
      <div className="App bg-gray-900 text-white min-h-screen flex flex-col">
        <BrowserRouter>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Homepage challenges={displayChallenges} />} />
              <Route path="/challenges" element={<ChallengeArena challenges={displayChallenges} />} />
              <Route path="/challenges/:id" element={<ChallengeDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile/:address" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </MetaMaskContextProvider>
  );
}

// Create components directory and components
const componentsCode = {
  Header: `
import { useContext } from "react";
import { Link } from "react-router-dom";
import { MetaMaskContext } from "../contexts/MetaMaskContext";

function Header() {
  const { 
    wallet, 
    isConnecting, 
    connectMetaMask, 
    error 
  } = useContext(MetaMaskContext);
  
  return (
    <header className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-purple-500">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
              <path fillRule="evenodd" d="M10 4a1 1 0 100 2 1 1 0 000-2zm0 8a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            ChainRivals
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/challenges" className="text-gray-300 hover:text-white transition">
            Challenges
          </Link>
          <Link to="/leaderboard" className="text-gray-300 hover:text-white transition">
            Leaderboard
          </Link>
          {wallet && (
            <Link to={'/profile/' + wallet.address} className="text-gray-300 hover:text-white transition">
              Profile
            </Link>
          )}
        </nav>
        
        <div>
          {!wallet ? (
            <button
              onClick={connectMetaMask}
              disabled={isConnecting}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <div className="flex items-center">
              <div className="bg-gray-700 rounded-lg px-3 py-1 text-sm mr-2">
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </div>
              <div className="bg-green-600 rounded-full h-3 w-3"></div>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-600 text-white text-center py-2">
          {error}
        </div>
      )}
    </header>
  );
}

export default Header;
  `,
  
  Footer: `
function Footer() {
  return (
    <footer className="bg-gray-800 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} ChainRivals - The Ultimate Smart Contract Battleground
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-500 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-500 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482A13.98 13.98 0 011.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
              </svg>
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-500 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.048.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192.983.336 1.512.456.756.12 1.648.156 2.628.012.996-.12 1.968-.42 3.012-.996 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
  `,
};

// Create pages
const pagesCode = {
  Homepage: `
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
          <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            ChainRivals<span className="text-sm align-sub ml-1 text-purple-300">beta</span>
          </h1>
          <h2 className="text-3xl font-semibold mb-8 text-gray-300">
            The Ultimate Smart Contract Battleground
          </h2>
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
  `,
  
  ChallengeArena: `
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
  `,
  
  ChallengeDetail: `
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { MetaMaskContext } from "../contexts/MetaMaskContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = \`\${BACKEND_URL}/api\`;

// Sample initial contract code for gas optimization challenge
const gasOptimizationTemplate = \`// SPDX-License-Identifier: MIT
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
\`;

// Sample initial contract code for security challenge
const securityExploitTemplate = \`// SPDX-License-Identifier: MIT
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
\`;

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
        // In a real app, you'd fetch from the API: await axios.get(\`\${API}/challenges/\${id}\`);
        
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
    
    return \`\${hours.toString().padStart(2, '0')}:\${minutes.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;
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
      // const response = await axios.post(\`\${API}/submissions\`, {
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
                    style={{ width: \`\${result.score}%\` }}
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
  `,
  
  Leaderboard: `
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = \`\${BACKEND_URL}/api\`;

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
        // In a real app: const response = await axios.get(\`\${API}/leaderboard\`);
        
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
                              ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyejSxfv1VRb4-lAhpR2xyG-_-A1XH0n9riw&s"
                              : user.chain === "polygon"
                                ? "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Polygon_Icon.svg/800px-Polygon_Icon.svg.png"
                                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnzyhzN1YSR8HlnU962hUG0BJv4FaSm9NljA&s"
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
  `,
  
  Profile: `
import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { MetaMaskContext } from "../contexts/MetaMaskContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = \`\${BACKEND_URL}/api\`;

function Profile() {
  const { address } = useParams();
  const { wallet } = useContext(MetaMaskContext);
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
        // const profileResponse = await axios.get(\`\${API}/users/\${address}\`);
        // const submissionsResponse = await axios.get(\`\${API}/submissions/user/\${profileResponse.data.id}\`);
        
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
            className={\`inline-block py-4 px-4 text-sm font-medium \${
              activeTab === "submissions"
                ? "text-purple-500 border-b-2 border-purple-500"
                : "text-gray-400 hover:text-gray-300 border-b-2 border-transparent"
            }\`}
          >
            Submissions
          </button>
          <button
            onClick={() => setActiveTab("badges")}
            className={\`inline-block py-4 px-4 text-sm font-medium \${
              activeTab === "badges"
                ? "text-purple-500 border-b-2 border-purple-500"
                : "text-gray-400 hover:text-gray-300 border-b-2 border-transparent"
            }\`}
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
                                style={{ width: \`\${submission.score}%\` }}
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
  `,
};

// Create context for MetaMask integration
const contextCode = {
  MetaMaskContext: `
import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

export const MetaMaskContext = createContext();

export const MetaMaskContextProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Check if already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if MetaMask is installed
        if (window.ethereum) {
          // Get accounts
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          
          if (accounts.length > 0) {
            // Get the provider and signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            setWallet({
              address: accounts[0],
              provider,
              signer
            });
          }
        }
      } catch (err) {
        console.error("Error checking existing connection:", err);
      }
    };

    checkConnection();
  }, []);

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected
          setWallet(null);
        } else if (wallet && accounts[0] !== wallet.address) {
          // User switched accounts
          connectMetaMask();
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, [wallet]);

  // Connect to MetaMask
  const connectMetaMask = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
      }
      
      // Request accounts
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      
      if (accounts.length === 0) {
        throw new Error("No accounts found. Please create an account in MetaMask.");
      }
      
      // Get the provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Get network info
      const network = await provider.getNetwork();
      console.log("Connected to network:", network.name);
      
      setWallet({
        address: accounts[0],
        provider,
        signer
      });
      
      setIsConnecting(false);
    } catch (err) {
      console.error("Error connecting to MetaMask:", err);
      setError(err.message || "Failed to connect to MetaMask. Please try again.");
      setIsConnecting(false);
    }
  };

  return (
    <MetaMaskContext.Provider value={{ wallet, isConnecting, error, connectMetaMask }}>
      {children}
    </MetaMaskContext.Provider>
  );
};
  `,
};

// Export components, pages, and context
export default App;
