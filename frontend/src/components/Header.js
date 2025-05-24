import { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { WalletContext } from "../contexts/MetaMaskContext";

function Header() {
  const { 
    wallet, 
    isConnecting, 
    connectWallet,
    disconnectWallet,
    network,
    switchNetwork,
    supportedNetworks,
    walletTypes,
    error 
  } = useContext(WalletContext);

  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const walletMenuRef = useRef(null);
  const networkMenuRef = useRef(null);
  const walletSelectorRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (walletMenuRef.current && !walletMenuRef.current.contains(event.target)) {
        setShowWalletMenu(false);
      }
      if (networkMenuRef.current && !networkMenuRef.current.contains(event.target)) {
        setShowNetworkMenu(false);
      }
      if (walletSelectorRef.current && !walletSelectorRef.current.contains(event.target)) {
        setShowWalletSelector(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle wallet menu toggle
  const toggleWalletMenu = () => {
    setShowWalletMenu(!showWalletMenu);
    setShowNetworkMenu(false);
    setShowWalletSelector(false);
  };

  // Handle network menu toggle
  const toggleNetworkMenu = () => {
    setShowNetworkMenu(!showNetworkMenu);
    setShowWalletMenu(false);
    setShowWalletSelector(false);
  };

  // Handle wallet selector toggle
  const toggleWalletSelector = () => {
    setShowWalletSelector(!showWalletSelector);
    setShowWalletMenu(false);
    setShowNetworkMenu(false);
  };

  // Handle disconnect
  const handleDisconnect = () => {
    disconnectWallet();
    setShowWalletMenu(false);
  };

  // Handle network switch
  const handleNetworkSwitch = async (chainId) => {
    try {
      await switchNetwork(chainId);
      setShowNetworkMenu(false);
    } catch (err) {
      console.error("Error switching network:", err);
    }
  };

  // Handle wallet connection
  const handleWalletConnect = async (type) => {
    try {
      await connectWallet(type);
      setShowWalletSelector(false);
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

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
          <Link to="/vulnerability-guide" className="text-gray-300 hover:text-white transition">
            Security Guide
          </Link>
          <Link to="/faq" className="text-gray-300 hover:text-white transition">
            FAQ
          </Link>
          {wallet && (
            <Link to={'/profile/' + wallet.address} className="text-gray-300 hover:text-white transition">
              Profile
            </Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {wallet && (
            <div className="relative" ref={networkMenuRef}>
              <button
                onClick={toggleNetworkMenu}
                className="flex items-center bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 transition"
              >
                <div className="flex items-center">
                  <span className="text-sm mr-2">
                    {network?.currency.symbol || "Network"}
                  </span>
                  <svg
                    className={`h-4 w-4 transition-transform ${showNetworkMenu ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {showNetworkMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg py-1 z-50">
                  {Object.values(supportedNetworks).map((net) => (
                    <button
                      key={net.chainId}
                      onClick={() => handleNetworkSwitch(net.chainId)}
                      className={`w-full text-left px-4 py-2 text-sm transition ${
                        network?.chainId === net.chainId
                          ? 'text-purple-400 bg-gray-600'
                          : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                      }`}
                    >
                      {net.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="relative" ref={walletMenuRef}>
            {!wallet ? (
              <div className="relative" ref={walletSelectorRef}>
                <button
                  onClick={toggleWalletSelector}
                  disabled={isConnecting}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </button>

                {showWalletSelector && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg py-1 z-50">
                    <button
                      onClick={() => handleWalletConnect(walletTypes.METAMASK)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition flex items-center"
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-5 h-5 mr-2" />
                      MetaMask
                    </button>
                    <button
                      onClick={() => handleWalletConnect(walletTypes.CORE)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition flex items-center"
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/en/0/03/Avalanche_logo_without_text.png" alt="Core" className="w-5 h-5 mr-2" />
                      Core Wallet
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <button
                  onClick={toggleWalletMenu}
                  className="flex items-center bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 transition"
                >
                  <div className="flex items-center">
                    <div className="bg-green-600 rounded-full h-3 w-3 mr-2"></div>
                    <span className="text-sm">
                      {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </span>
                    <svg
                      className={`ml-2 h-4 w-4 transition-transform ${showWalletMenu ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {showWalletMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-600">
                      Connected to {network?.name}
                    </div>
                    <button
                      onClick={handleDisconnect}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition"
                    >
                      Disconnect Wallet
                    </button>
                    <button
                      onClick={() => handleWalletConnect(walletTypes.METAMASK)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition"
                    >
                      Switch Account
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
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