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