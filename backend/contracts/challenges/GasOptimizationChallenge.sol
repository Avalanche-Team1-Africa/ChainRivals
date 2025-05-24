// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GasOptimizationChallenge is Ownable, ReentrancyGuard {
    // Structs
    struct GasTest {
        uint256 id;
        string name;
        uint256 gasLimit;
        bool isActive;
    }
    
    struct TestResult {
        uint256 gasUsed;
        bool passed;
        string error;
    }
    
    // State variables
    mapping(uint256 => GasTest) public gasTests;
    mapping(uint256 => mapping(address => TestResult)) public testResults;
    uint256 public testCount;
    
    // Events
    event TestCreated(uint256 indexed testId, string name, uint256 gasLimit);
    event TestUpdated(uint256 indexed testId, uint256 newGasLimit);
    event TestExecuted(uint256 indexed testId, address indexed user, uint256 gasUsed, bool passed);
    
    // Constructor
    constructor() {
        // Initialize with some default tests
        createTest("Basic Operation", 100000);
        createTest("Complex Operation", 200000);
        createTest("Storage Operation", 150000);
    }
    
    // Functions
    function createTest(string memory _name, uint256 _gasLimit) public onlyOwner {
        testCount++;
        uint256 testId = testCount;
        
        gasTests[testId] = GasTest({
            id: testId,
            name: _name,
            gasLimit: _gasLimit,
            isActive: true
        });
        
        emit TestCreated(testId, _name, _gasLimit);
    }
    
    function updateTest(uint256 _testId, uint256 _newGasLimit) external onlyOwner {
        require(gasTests[_testId].id != 0, "Test does not exist");
        gasTests[_testId].gasLimit = _newGasLimit;
        emit TestUpdated(_testId, _newGasLimit);
    }
    
    function executeTest(uint256 _testId, address _targetContract, bytes memory _calldata) 
        external 
        nonReentrant 
        returns (bool success, uint256 gasUsed) 
    {
        require(gasTests[_testId].id != 0, "Test does not exist");
        require(gasTests[_testId].isActive, "Test is not active");
        
        uint256 startGas = gasleft();
        
        (success, ) = _targetContract.call(_calldata);
        
        gasUsed = startGas - gasleft();
        
        bool passed = success && gasUsed <= gasTests[_testId].gasLimit;
        
        testResults[_testId][msg.sender] = TestResult({
            gasUsed: gasUsed,
            passed: passed,
            error: success ? "" : "Transaction failed"
        });
        
        emit TestExecuted(_testId, msg.sender, gasUsed, passed);
        
        return (success, gasUsed);
    }
    
    function toggleTest(uint256 _testId) external onlyOwner {
        require(gasTests[_testId].id != 0, "Test does not exist");
        gasTests[_testId].isActive = !gasTests[_testId].isActive;
    }
    
    // View functions
    function getTest(uint256 _testId) external view returns (
        string memory name,
        uint256 gasLimit,
        bool isActive
    ) {
        require(gasTests[_testId].id != 0, "Test does not exist");
        GasTest storage test = gasTests[_testId];
        return (test.name, test.gasLimit, test.isActive);
    }
    
    function getTestResult(uint256 _testId, address _user) external view returns (
        uint256 gasUsed,
        bool passed,
        string memory error
    ) {
        require(gasTests[_testId].id != 0, "Test does not exist");
        TestResult storage result = testResults[_testId][_user];
        return (result.gasUsed, result.passed, result.error);
    }
    
    // Helper function to measure gas usage of a function
    function measureGas(address _target, bytes memory _calldata) external view returns (uint256) {
        uint256 startGas = gasleft();
        (bool success, ) = _target.staticcall(_calldata);
        require(success, "Function call failed");
        return startGas - gasleft();
    }
} 