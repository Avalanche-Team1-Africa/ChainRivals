import axios from 'axios';
import { getMockChallenge, getMockEvaluation } from '../data/challengeTemplates';
import config from '../config';

// Create axios instance with default config
const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
const endpoints = {
  challenges: '/api/challenges',
  challenge: (id) => `/api/challenges/${id}`,
  submissions: '/api/submissions',
  userProfile: (address) => `/api/users/${address}`,
  userSubmissions: (userId) => `/api/submissions/user/${userId}`,
  leaderboard: '/api/leaderboard',
};

// Helper function to handle API calls with mock data fallback
const withMockFallback = async (apiCall, mockData) => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.log('Using mock data due to API error:', error);
    return mockData;
  }
};

// API service functions
export const apiService = {
  // Get all challenges
  getChallenges: async () => {
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

    return withMockFallback(
      () => api.get(endpoints.challenges),
      mockChallenges
    );
  },

  // Get single challenge
  getChallenge: async (id) => {
    const mockChallenge = getMockChallenge(id);
    return withMockFallback(
      () => api.get(endpoints.challenge(id)),
      mockChallenge
    );
  },

  // Submit solution
  submitSolution: async (challengeId, userId, code) => {
    const mockEvaluation = getMockEvaluation('gas_optimization');
    return withMockFallback(
      () => api.post(endpoints.submissions, {
        challenge_id: challengeId,
        user_id: userId,
        code
      }),
      {
        score: mockEvaluation.gas_score * 100,
        feedback: mockEvaluation.feedback,
        recommendations: mockEvaluation.recommendations
      }
    );
  },

  // Get user profile
  getUserProfile: async (address) => {
    const mockProfile = {
      id: "user_" + address.substring(0, 8),
      wallet_address: address,
      username: "GasWizard",
      reputation_score: 845,
      created_at: "2024-01-15T00:00:00Z"
    };

    return withMockFallback(
      () => api.get(endpoints.userProfile(address)),
      mockProfile
    );
  },

  // Get user submissions
  getUserSubmissions: async (userId) => {
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
      }
    ];

    return withMockFallback(
      () => api.get(endpoints.userSubmissions(userId)),
      mockSubmissions
    );
  },

  // Get leaderboard
  getLeaderboard: async () => {
    const mockLeaderboard = [
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
      }
    ];

    return withMockFallback(
      () => api.get(endpoints.leaderboard),
      mockLeaderboard
    );
  }
}; 