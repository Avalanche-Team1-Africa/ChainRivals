// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecurityChallenge is Ownable, ReentrancyGuard {
    // Structs
    struct SecurityTest {
        uint256 id;
        string name;
        string vulnerability;
        bool isActive;
        uint256 reward;
    }
    
    struct TestResult {
        bool exploited;
        bool fixed;
        string explanation;
        uint256 timestamp;
    }
    
    // State variables
    mapping(uint256 => SecurityTest) public securityTests;
    mapping(uint256 => mapping(address => TestResult)) public testResults;
    mapping(address => uint256) public userRewards;
    uint256 public testCount;
    
    // Events
    event TestCreated(uint256 indexed testId, string name, string vulnerability);
    event TestUpdated(uint256 indexed testId, string newVulnerability);
    event TestExploited(uint256 indexed testId, address indexed user);
    event TestFixed(uint256 indexed testId, address indexed user);
    event RewardClaimed(address indexed user, uint256 amount);
    
    // Constructor
    constructor() {
        // Initialize with some default tests
        createTest(
            "Reentrancy Attack",
            "Contract is vulnerable to reentrancy attacks",
            1 ether
        );
        createTest(
            "Integer Overflow",
            "Contract has integer overflow vulnerabilities",
            0.5 ether
        );
        createTest(
            "Access Control",
            "Contract has improper access control",
            0.75 ether
        );
    }
    
    // Functions
    function createTest(
        string memory _name,
        string memory _vulnerability,
        uint256 _reward
    ) public onlyOwner {
        testCount++;
        uint256 testId = testCount;
        
        securityTests[testId] = SecurityTest({
            id: testId,
            name: _name,
            vulnerability: _vulnerability,
            isActive: true,
            reward: _reward
        });
        
        emit TestCreated(testId, _name, _vulnerability);
    }
    
    function updateTest(
        uint256 _testId,
        string memory _newVulnerability,
        uint256 _newReward
    ) external onlyOwner {
        require(securityTests[_testId].id != 0, "Test does not exist");
        securityTests[_testId].vulnerability = _newVulnerability;
        securityTests[_testId].reward = _newReward;
        emit TestUpdated(_testId, _newVulnerability);
    }
    
    function submitExploit(
        uint256 _testId,
        address _targetContract,
        bytes memory _exploitData,
        string memory _explanation
    ) external nonReentrant {
        require(securityTests[_testId].id != 0, "Test does not exist");
        require(securityTests[_testId].isActive, "Test is not active");
        
        // Execute the exploit
        (bool success, ) = _targetContract.call(_exploitData);
        require(success, "Exploit failed");
        
        // Record the exploit
        testResults[_testId][msg.sender] = TestResult({
            exploited: true,
            fixed: false,
            explanation: _explanation,
            timestamp: block.timestamp
        });
        
        // Award the reward
        userRewards[msg.sender] += securityTests[_testId].reward;
        
        emit TestExploited(_testId, msg.sender);
    }
    
    function submitFix(
        uint256 _testId,
        address _targetContract,
        bytes memory _fixData,
        string memory _explanation
    ) external nonReentrant {
        require(securityTests[_testId].id != 0, "Test does not exist");
        require(securityTests[_testId].isActive, "Test is not active");
        
        // Execute the fix
        (bool success, ) = _targetContract.call(_fixData);
        require(success, "Fix failed");
        
        // Record the fix
        testResults[_testId][msg.sender] = TestResult({
            exploited: false,
            fixed: true,
            explanation: _explanation,
            timestamp: block.timestamp
        });
        
        // Award the reward
        userRewards[msg.sender] += securityTests[_testId].reward;
        
        emit TestFixed(_testId, msg.sender);
    }
    
    function claimReward() external nonReentrant {
        uint256 reward = userRewards[msg.sender];
        require(reward > 0, "No rewards to claim");
        
        userRewards[msg.sender] = 0;
        
        // Transfer the reward
        (bool success, ) = msg.sender.call{value: reward}("");
        require(success, "Reward transfer failed");
        
        emit RewardClaimed(msg.sender, reward);
    }
    
    function toggleTest(uint256 _testId) external onlyOwner {
        require(securityTests[_testId].id != 0, "Test does not exist");
        securityTests[_testId].isActive = !securityTests[_testId].isActive;
    }
    
    // View functions
    function getTest(uint256 _testId) external view returns (
        string memory name,
        string memory vulnerability,
        bool isActive,
        uint256 reward
    ) {
        require(securityTests[_testId].id != 0, "Test does not exist");
        SecurityTest storage test = securityTests[_testId];
        return (test.name, test.vulnerability, test.isActive, test.reward);
    }
    
    function getTestResult(uint256 _testId, address _user) external view returns (
        bool exploited,
        bool fixed,
        string memory explanation,
        uint256 timestamp
    ) {
        require(securityTests[_testId].id != 0, "Test does not exist");
        TestResult storage result = testResults[_testId][_user];
        return (result.exploited, result.fixed, result.explanation, result.timestamp);
    }
    
    function getPendingReward(address _user) external view returns (uint256) {
        return userRewards[_user];
    }
    
    // Receive function to accept ETH
    receive() external payable {}
} 