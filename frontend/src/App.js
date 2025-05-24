import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import "./App.css";
import { getMockChallenge } from './data/challengeTemplates';
import { apiService } from './services/api';

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./pages/Homepage";
import ChallengeArena from "./pages/ChallengeArena";
import ChallengeDetail from "./pages/ChallengeDetail";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import AIHelper from "./components/ai-helper/AIHelper";
import SubmitContract from "./pages/SubmitContract.js";

// User Experience Components
import {
  FAQ,
  Changelog,
  FeedbackWidget,
  QuickNav,
  EmailSignup,
  ProductTour
} from "./components/user-experience";

// MetaMask Context
import { WalletContextProvider } from "./contexts/MetaMaskContext";

// Monaco Editor
import Editor from "@monaco-editor/react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '';

// Conditional EmailSignup Component
const ConditionalEmailSignup = () => {
  const location = useLocation();
  const isChallengesPage = location.pathname.startsWith('/challenges');
  
  if (isChallengesPage) {
    return null;
  }
  
  return <EmailSignup />;
};

// App Component
function App() {
  const [displayChallenges, setDisplayChallenges] = useState([]);
  const [showTour, setShowTour] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const challenges = await apiService.getChallenges();
        setDisplayChallenges(challenges);
      } catch (error) {
        console.error("Error fetching challenges:", error);
        setDisplayChallenges([]);
      }
    };

    fetchChallenges();
  }, []);

  return (
    <WalletContextProvider>
      <div className="App bg-gray-900 text-white min-h-screen flex flex-col">
        <BrowserRouter>
          <Header />
          <Changelog />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Homepage challenges={displayChallenges} />} />
              <Route path="/challenges" element={<ChallengeArena challenges={displayChallenges} />} />
              <Route path="/challenges/:id" element={<ChallengeDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile/:address" element={<Profile />} />
              <Route path="/submit-contract" element={<SubmitContract />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </main>
          <ConditionalEmailSignup />
          <Footer />
          <QuickNav />
          <FeedbackWidget />
          <AIHelper />
          {showTour && (
            <ProductTour
              steps={[
                {
                  title: 'Welcome to ChainRivals!',
                  content: 'Let us show you around and help you get started.',
                  position: {
                    top: '50%',
                    left: '50%',
                    arrowTop: '-8px',
                    arrowLeft: '50%',
                  },
                },
                {
                  title: 'Connect Your Wallet',
                  content: 'First, connect your wallet to start participating in challenges.',
                  position: {
                    top: '10%',
                    left: '90%',
                    arrowTop: '50%',
                    arrowLeft: '-8px',
                  },
                },
                {
                  title: 'Browse Challenges',
                  content: 'Explore available challenges and find ones that match your skills.',
                  position: {
                    top: '30%',
                    left: '50%',
                    arrowTop: '-8px',
                    arrowLeft: '50%',
                  },
                },
                {
                  title: 'Submit Solutions',
                  content: 'Write and submit your solutions to earn rewards.',
                  position: {
                    top: '50%',
                    left: '70%',
                    arrowTop: '50%',
                    arrowLeft: '-8px',
                  },
                }
              ]}
              onComplete={() => setShowTour(false)}
            />
          )}
        </BrowserRouter>
      </div>
    </WalletContextProvider>
  );
}

export default App;
