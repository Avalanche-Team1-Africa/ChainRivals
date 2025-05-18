# 🚀 ChainRivals: Smart Contract Wars Leaderboard Platform

## 🔥 Overview

**ChainRivals** is a decentralized, blockchain-based gamified platform/ecosystem that enables users to compete in smart contract wars , with a leaderboard system to track the top performers. The platform utilizes a combination of smart contracts and a decentralized application (dApp) to facilitate the competition.
The leaderboard is updated in real-time, reflecting the current standings of participants. The platform's primary goal is to provide a fun and engaging experience for users while promoting the development and deployment of resilient smart contracts.

The **ChainRivals platform** gamified ecosystem is designed to advance **smart contract security, optimization, and developer upskilling**. It provides a dynamic space where **Web3 developers, security researchers, and blockchain startups** can compete, audit, and optimize smart contracts through **leaderboards, challenges, and tokenized incentives**.

## 🎯 Core Features

- **Leaderboard-Driven Competitions** – Rank top developers based on contract security, optimization, and performance metrics
- **Gamified Bounty Challenges** – Developers compete in security audits and gas optimization challenges with real-world impact
- **Reputation NFTs & Rewards** – Earn reputation-based NFTs and tokenized incentives for contributions
- **AI-Assisted Contract Analysis** – Get real-time feedback on contract security and efficiency
- **Decentralized Governance** – Community-driven curation of challenges and rewards
- **Smart Contract Security Audits** – Verified security challenges inspired by real-world vulnerabilities

## 🏗 Architecture

```text
To be updated regulalrly as the ChainRivals Development Progresses
```

### Frontend Architecture

- **React.js** with TypeScript for type safety
- **TailwindCSS** for responsive and modern UI
- **Ethers.js** for blockchain interactions
- **WalletConnect** for seamless wallet integration
- **React Query** for efficient data fetching and caching

### Backend Architecture

- **Node.js** with Express.js for RESTful APIs
- **GraphQL** for flexible data querying
- **PostgreSQL** for persistent data storage
- **Firebase** for real-time leaderboard updates
- **Redis** for caching and rate limiting

### Smart Contract Architecture

- **Solidity** for smart contract development
- **Hardhat/Foundry** for development environment
- **OpenZeppelin** for secure contract standards
- **Chainlink** for oracle integration
- **Multi-chain support** (Ethereum, Polygon, Arbitrum, Optimism)

## 📁 Project Structure

```tree
chainrivals/
├── contracts/           # Smart contracts
│   ├── core/           # Core contract implementations
│   ├── challenges/     # Challenge-specific contracts
│   └── rewards/        # Reward and NFT contracts
├── frontend/           # React frontend application
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   └── utils/         # Utility functions
├── backend/           # Node.js backend
│   ├── api/          # API routes
│   ├── services/     # Business logic
│   ├── models/       # Database models
│   └── utils/        # Utility functions
└── scripts/          # Deployment and utility scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (>=16.x)
- Yarn or NPM
- Hardhat / Foundry
- PostgreSQL (>=13.x)
- Redis (>=6.x)
- A Web3-enabled wallet (MetaMask, WalletConnect)

### Environment Setup

 1. Clone the repository:

```sh
git clone https://github.com/Avalanche-Team1-Africa/ChainRivals.git
cd ChainRivals
```

 1. Install dependencies:

```sh
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install contract dependencies
cd ../contracts
npm install
```

1. Configure environment variables:

```sh
# Frontend (.env)
REACT_APP_API_URL=http://localhost:4000
REACT_APP_CHAIN_ID=11155111 # Sepolia testnet

# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/chainrivals
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key

# Contracts (.env)
PRIVATE_KEY=your-private-key
INFURA_API_KEY=your-infura-key
```

### Development Workflow

#### 1. Start Development Servers

```sh
# Start frontend (from frontend directory)
npm run dev

# Start backend (from backend directory)
npm run dev

# Start contract development (from contracts directory)
npx hardhat node
```

#### 2. Smart Contract Development

```sh
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to testnet
npx hardhat run scripts/deploy.js --network sepolia
```

#### 3. Database Migrations

```sh
# Run migrations
npm run migrate

# Seed development data
npm run seed
```

## 🧪 Testing

- **Frontend**: Jest + React Testing Library
- **Backend**: Jest + Supertest
- **Smart Contracts**: Hardhat + Chai
- **Integration**: Cypress

Run tests:

```sh
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# Contract tests
cd contracts
npx hardhat test
```

## 🔄 CI/CD Pipeline

- GitHub Actions for automated testing and deployment
- Automated security scanning with Slither and Mythril
- Automated code quality checks with ESLint and Prettier
- Automated dependency updates with Dependabot

## 🛠 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/xyz`)
3. Commit changes (`git commit -m "Add feature XYZ"`)
4. Push to branch (`git push origin feature/xyz`)
5. Open a pull request

### Code Style Guidelines

- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🌐 Community & Support (Connect With Us)

- **Documentation**: [docs.chainrivals.com](https://docs.chainrivals.com)
- **Twitter**: [@ChainRivals](https://twitter.com/ChainRivals)
- **Discord**: [Join Community](https://discord.gg/chainrivals)
- **Website**: [ChainRivals.com](https://chainrivals.com)

## 🔐 Security

If you discover any security vulnerabilities, please report them to [security@chainrivals.com](mailto:security@chainrivals.com)

- Report security vulnerabilities to [security@chainrivals.com](mailto:security@chainrivals.com)
- All smart contracts are audited by leading security firms
- Bug bounty program available for critical vulnerabilities
