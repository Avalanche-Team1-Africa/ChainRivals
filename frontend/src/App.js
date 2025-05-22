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
import AIHelper from "./components/ai-helper/AIHelper";

// MetaMask Context
import { MetaMaskContextProvider } from "./contexts/MetaMaskContext";

// Monaco Editor
import Editor from "@monaco-editor/react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// App Component
function App() {
  const [displayChallenges, setDisplayChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get(`${API}/challenges`);
        setDisplayChallenges(response.data);
      } catch (error) {
        console.error("Error fetching challenges:", error);
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
