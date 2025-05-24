// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ChainRivalsCore is Ownable, ReentrancyGuard {
    // Structs
    struct Challenge {
        uint256 id;
        string title;
        string description;
        address creator;
        uint256 reward;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        string chain;
        string challengeType;
        string difficulty;
        string initialCode;
    }

    struct Submission {
        uint256 challengeId;
        address submitter;
        string solution;
        uint256 score;
        bool isEvaluated;
        uint256 timestamp;
    }

    // State variables
    mapping(uint256 => Challenge) public challenges;
    mapping(uint256 => mapping(address => Submission)) public submissions;
    mapping(address => uint256[]) public userSubmissions;
    mapping(string => bool) public supportedChains;
    mapping(string => bool) public supportedChallengeTypes;
    
    uint256 public challengeCount;
    uint256 public submissionCount;
    
    // Events
    event ChallengeCreated(uint256 indexed challengeId, address indexed creator, string title);
    event ChallengeUpdated(uint256 indexed challengeId, address indexed creator);
    event SubmissionSubmitted(uint256 indexed challengeId, address indexed submitter);
    event SubmissionEvaluated(uint256 indexed challengeId, address indexed submitter, uint256 score);
    event RewardDistributed(uint256 indexed challengeId, address indexed winner, uint256 amount);
    
    // Constructor
    constructor() {
        // Initialize supported chains
        supportedChains["avalanche"] = true;
        supportedChains["ethereum"] = true;
        supportedChains["polygon"] = true;
        supportedChains["celo"] = true;
        
        // Initialize supported challenge types
        supportedChallengeTypes["gas_optimization"] = true;
        supportedChallengeTypes["security_exploit"] = true;
        supportedChallengeTypes["access_control"] = true;
        supportedChallengeTypes["event_logging"] = true;
    }
    
    // Modifiers
    modifier validChallenge(uint256 _challengeId) {
        require(challenges[_challengeId].id != 0, "Challenge does not exist");
        _;
    }
    
    modifier challengeActive(uint256 _challengeId) {
        require(challenges[_challengeId].isActive, "Challenge is not active");
        require(block.timestamp >= challenges[_challengeId].startTime, "Challenge has not started");
        require(block.timestamp <= challenges[_challengeId].endTime, "Challenge has ended");
        _;
    }
    
    // Functions
    function createChallenge(
        string memory _title,
        string memory _description,
        uint256 _reward,
        uint256 _duration,
        string memory _chain,
        string memory _challengeType,
        string memory _difficulty,
        string memory _initialCode
    ) external onlyOwner {
        require(supportedChains[_chain], "Unsupported chain");
        require(supportedChallengeTypes[_challengeType], "Unsupported challenge type");
        require(_duration > 0, "Duration must be greater than 0");
        
        challengeCount++;
        uint256 challengeId = challengeCount;
        
        challenges[challengeId] = Challenge({
            id: challengeId,
            title: _title,
            description: _description,
            creator: msg.sender,
            reward: _reward,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            isActive: true,
            chain: _chain,
            challengeType: _challengeType,
            difficulty: _difficulty,
            initialCode: _initialCode
        });
        
        emit ChallengeCreated(challengeId, msg.sender, _title);
    }
    
    function updateChallenge(
        uint256 _challengeId,
        string memory _title,
        string memory _description,
        uint256 _reward,
        string memory _chain,
        string memory _challengeType,
        string memory _difficulty,
        string memory _initialCode
    ) external onlyOwner validChallenge(_challengeId) {
        require(supportedChains[_chain], "Unsupported chain");
        require(supportedChallengeTypes[_challengeType], "Unsupported challenge type");
        
        Challenge storage challenge = challenges[_challengeId];
        challenge.title = _title;
        challenge.description = _description;
        challenge.reward = _reward;
        challenge.chain = _chain;
        challenge.challengeType = _challengeType;
        challenge.difficulty = _difficulty;
        challenge.initialCode = _initialCode;
        
        emit ChallengeUpdated(_challengeId, msg.sender);
    }
    
    function submitSolution(
        uint256 _challengeId,
        string memory _solution
    ) external validChallenge(_challengeId) challengeActive(_challengeId) nonReentrant {
        require(bytes(_solution).length > 0, "Solution cannot be empty");
        
        submissionCount++;
        uint256 submissionId = submissionCount;
        
        submissions[_challengeId][msg.sender] = Submission({
            challengeId: _challengeId,
            submitter: msg.sender,
            solution: _solution,
            score: 0,
            isEvaluated: false,
            timestamp: block.timestamp
        });
        
        userSubmissions[msg.sender].push(submissionId);
        
        emit SubmissionSubmitted(_challengeId, msg.sender);
    }
    
    function evaluateSubmission(
        uint256 _challengeId,
        address _submitter,
        uint256 _score
    ) external onlyOwner validChallenge(_challengeId) {
        require(_score <= 100, "Score must be between 0 and 100");
        
        Submission storage submission = submissions[_challengeId][_submitter];
        require(submission.submitter != address(0), "No submission found");
        require(!submission.isEvaluated, "Submission already evaluated");
        
        submission.score = _score;
        submission.isEvaluated = true;
        
        emit SubmissionEvaluated(_challengeId, _submitter, _score);
    }
    
    function distributeReward(
        uint256 _challengeId,
        address _winner
    ) external onlyOwner validChallenge(_challengeId) nonReentrant {
        Challenge storage challenge = challenges[_challengeId];
        require(block.timestamp > challenge.endTime, "Challenge has not ended");
        
        Submission storage submission = submissions[_challengeId][_winner];
        require(submission.isEvaluated, "Submission not evaluated");
        require(submission.score > 0, "Invalid submission score");
        
        // Transfer reward to winner
        // Note: In a real implementation, you would need to handle the actual token transfer
        // This is just a placeholder for the reward distribution logic
        
        emit RewardDistributed(_challengeId, _winner, challenge.reward);
    }
    
    // View functions
    function getChallenge(uint256 _challengeId) external view validChallenge(_challengeId) returns (
        string memory title,
        string memory description,
        address creator,
        uint256 reward,
        uint256 startTime,
        uint256 endTime,
        bool isActive,
        string memory chain,
        string memory challengeType,
        string memory difficulty,
        string memory initialCode
    ) {
        Challenge storage challenge = challenges[_challengeId];
        return (
            challenge.title,
            challenge.description,
            challenge.creator,
            challenge.reward,
            challenge.startTime,
            challenge.endTime,
            challenge.isActive,
            challenge.chain,
            challenge.challengeType,
            challenge.difficulty,
            challenge.initialCode
        );
    }
    
    function getSubmission(
        uint256 _challengeId,
        address _submitter
    ) external view validChallenge(_challengeId) returns (
        string memory solution,
        uint256 score,
        bool isEvaluated,
        uint256 timestamp
    ) {
        Submission storage submission = submissions[_challengeId][_submitter];
        return (
            submission.solution,
            submission.score,
            submission.isEvaluated,
            submission.timestamp
        );
    }
    
    function getUserSubmissions(address _user) external view returns (uint256[] memory) {
        return userSubmissions[_user];
    }
    
    // Admin functions
    function addSupportedChain(string memory _chain) external onlyOwner {
        supportedChains[_chain] = true;
    }
    
    function removeSupportedChain(string memory _chain) external onlyOwner {
        supportedChains[_chain] = false;
    }
    
    function addSupportedChallengeType(string memory _type) external onlyOwner {
        supportedChallengeTypes[_type] = true;
    }
    
    function removeSupportedChallengeType(string memory _type) external onlyOwner {
        supportedChallengeTypes[_type] = false;
    }
    
    function toggleChallengeStatus(uint256 _challengeId) external onlyOwner validChallenge(_challengeId) {
        challenges[_challengeId].isActive = !challenges[_challengeId].isActive;
    }
} 