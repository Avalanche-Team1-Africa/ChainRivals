import { createContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

export const WalletContext = createContext();

// Supported networks
const SUPPORTED_NETWORKS = {
  ethereum: {
    chainId: "0x1",
    name: "Ethereum Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/",
    blockExplorer: "https://etherscan.io",
    currency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    }
  },
  avalanche: {
    chainId: "0xa86a",
    name: "Avalanche C-Chain",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    blockExplorer: "https://snowtrace.io",
    currency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18
    }
  },
  polygon: {
    chainId: "0x89",
    name: "Polygon Mainnet",
    rpcUrl: "https://polygon-rpc.com",
    blockExplorer: "https://polygonscan.com",
    currency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18
    }
  }
};

// Wallet types
const WALLET_TYPES = {
  METAMASK: 'metamask',
  CORE: 'core'
};

export const WalletContextProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [network, setNetwork] = useState(null);
  const [walletType, setWalletType] = useState(null);

  // Reset wallet state
  const resetWallet = useCallback(() => {
    setWallet(null);
    setNetwork(null);
    setError(null);
    setWalletType(null);
  }, []);

  // Get current network
  const getCurrentNetwork = useCallback(async (provider) => {
    try {
      const network = await provider.getNetwork();
      const chainId = `0x${network.chainId.toString(16)}`;
      const networkInfo = Object.values(SUPPORTED_NETWORKS).find(
        net => net.chainId === chainId
      );
      
      if (!networkInfo) {
        throw new Error(`Unsupported network: ${network.name} (${chainId})`);
      }
      
      return networkInfo;
    } catch (err) {
      console.error("Error getting network:", err);
      throw err;
    }
  }, []);

  // Switch network
  const switchNetwork = useCallback(async (targetChainId) => {
    if (!window.ethereum && !window.avalanche) {
      throw new Error("No wallet detected");
    }

    try {
      if (walletType === WALLET_TYPES.METAMASK) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetChainId }],
        });
      } else if (walletType === WALLET_TYPES.CORE) {
        // Core wallet uses the same RPC methods as MetaMask
        await window.avalanche.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetChainId }],
        });
      }
    } catch (switchError) {
      // This error code indicates that the chain has not been added to the wallet
      if (switchError.code === 4902) {
        const network = Object.values(SUPPORTED_NETWORKS).find(
          net => net.chainId === targetChainId
        );
        
        if (!network) {
          throw new Error(`Unsupported network: ${targetChainId}`);
        }

        try {
          const params = {
            chainId: targetChainId,
            chainName: network.name,
            nativeCurrency: network.currency,
            rpcUrls: [network.rpcUrl],
            blockExplorerUrls: [network.blockExplorer]
          };

          if (walletType === WALLET_TYPES.METAMASK) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [params],
            });
          } else if (walletType === WALLET_TYPES.CORE) {
            await window.avalanche.request({
              method: "wallet_addEthereumChain",
              params: [params],
            });
          }
        } catch (addError) {
          throw new Error(`Failed to add network: ${addError.message}`);
        }
      } else {
        throw new Error(`Failed to switch network: ${switchError.message}`);
      }
    }
  }, [walletType]);

  // Initialize wallet connection
  const initializeWallet = useCallback(async (accounts, type) => {
    try {
      let provider;
      if (type === WALLET_TYPES.METAMASK) {
        provider = new ethers.BrowserProvider(window.ethereum);
      } else if (type === WALLET_TYPES.CORE) {
        provider = new ethers.BrowserProvider(window.avalanche);
      } else {
        throw new Error("Unsupported wallet type");
      }

      const signer = await provider.getSigner();
      const networkInfo = await getCurrentNetwork(provider);
      
      setWallet({
        address: accounts[0],
        provider,
        signer
      });
      setNetwork(networkInfo);
      setWalletType(type);
      setError(null);
    } catch (err) {
      console.error("Error initializing wallet:", err);
      throw err;
    }
  }, [getCurrentNetwork]);

  // Check if already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check MetaMask
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            await initializeWallet(accounts, WALLET_TYPES.METAMASK);
            return;
          }
        }

        // Check Core wallet
        if (window.avalanche) {
          const accounts = await window.avalanche.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            await initializeWallet(accounts, WALLET_TYPES.CORE);
            return;
          }
        }
      } catch (err) {
        console.error("Error checking existing connection:", err);
        setError(err.message);
      }
    };

    checkConnection();
  }, [initializeWallet]);

  // Handle account changes
  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        resetWallet();
      } else {
        await initializeWallet(accounts, walletType);
      }
    };

    const handleChainChanged = async () => {
      if (wallet) {
        try {
          const networkInfo = await getCurrentNetwork(wallet.provider);
          setNetwork(networkInfo);
        } catch (err) {
          setError(err.message);
        }
      }
    };

    if (walletType === WALLET_TYPES.METAMASK && window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    } else if (walletType === WALLET_TYPES.CORE && window.avalanche) {
      window.avalanche.on("accountsChanged", handleAccountsChanged);
      window.avalanche.on("chainChanged", handleChainChanged);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
      if (window.avalanche) {
        window.avalanche.removeListener("accountsChanged", handleAccountsChanged);
        window.avalanche.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [wallet, walletType, initializeWallet, getCurrentNetwork, resetWallet]);

  // Connect to wallet
  const connectWallet = async (type) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (type === WALLET_TYPES.METAMASK) {
        if (!window.ethereum) {
          throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
        }
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length === 0) {
          throw new Error("No accounts found. Please create an account in MetaMask.");
        }
        await initializeWallet(accounts, WALLET_TYPES.METAMASK);
      } else if (type === WALLET_TYPES.CORE) {
        if (!window.avalanche) {
          throw new Error("Avalanche Core wallet is not installed. Please install it to continue.");
        }
        const accounts = await window.avalanche.request({ method: "eth_requestAccounts" });
        if (accounts.length === 0) {
          throw new Error("No accounts found. Please create an account in Core wallet.");
        }
        await initializeWallet(accounts, WALLET_TYPES.CORE);
      } else {
        throw new Error("Unsupported wallet type");
      }
    } catch (err) {
      console.error("Error connecting to wallet:", err);
      setError(err.message || "Failed to connect to wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    resetWallet();
  }, [resetWallet]);

  return (
    <WalletContext.Provider 
      value={{ 
        wallet, 
        isConnecting, 
        error, 
        network,
        walletType,
        connectWallet, 
        disconnectWallet,
        switchNetwork,
        supportedNetworks: SUPPORTED_NETWORKS,
        walletTypes: WALLET_TYPES
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};