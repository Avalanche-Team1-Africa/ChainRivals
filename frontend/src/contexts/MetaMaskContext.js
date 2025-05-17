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