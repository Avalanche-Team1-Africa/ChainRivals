import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import "./App.css";
import { getMockChallenge } from './data/challengeTemplates';

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

// MetaMask Context
import { MetaMaskContextProvider } from "./contexts/MetaMaskContext";

// Monaco Editor
import Editor from "@monaco-editor/react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '';

// App Component
function App() {
  const [displayChallenges, setDisplayChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        // Try to fetch from API first
        const response = await axios.get(`${API}/challenges`);
        setDisplayChallenges(response.data);
      } catch (error) {
        console.log("Using mock challenges due to API error:", error);
        // If API fails, use mock challenges
        const mockChallenges = [
          // Avalanche Challenges
          {
            ...getMockChallenge("1"),
            chain: "avalanche",
            reward: 100
          },
          {
            ...getMockChallenge("2"),
            chain: "avalanche",
            reward: 150
          },
          // Ethereum Challenges
          {
            ...getMockChallenge("3"),
            chain: "ethereum",
            reward: 0.5
          },
          {
            ...getMockChallenge("4"),
            chain: "ethereum",
            reward: 0.75
          },
          // Polygon Challenges
          {
            ...getMockChallenge("5"),
            chain: "polygon",
            reward: 50
          },
          {
            ...getMockChallenge("6"),
            chain: "polygon",
            reward: 75
          },
          // Celo Challenges
          {
            ...getMockChallenge("7"),
            chain: "celo",
            reward: 200
          },
          {
            ...getMockChallenge("8"),
            chain: "celo",
            reward: 250
          },
          // Lisk Challenges
          {
            ...getMockChallenge("9"),
            chain: "lisk",
            reward: 300
          },
          {
            ...getMockChallenge("10"),
            chain: "lisk",
            reward: 350
          }
        ];
        setDisplayChallenges(mockChallenges);
      }
    };

    fetchChallenges();
  }, []);

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
              <Route path="/submit-contract" element={<SubmitContract />} />
            </Routes>
          </main>
          <Footer />
          <AIHelper />
        </BrowserRouter>
      </div>
    </MetaMaskContextProvider>
  );
}

export default App;
