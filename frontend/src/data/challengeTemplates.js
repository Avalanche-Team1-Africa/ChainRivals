// Smart Contract Templates
export const gasOptimizationTemplate = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GasOptimizationChallenge {
    // This is a simple token transfer function
    // Your task is to optimize it for gas efficiency
    
    mapping(address => uint256) public balances;
    
    function initialize(address[] memory addresses, uint256[] memory amounts) public {
        require(addresses.length == amounts.length, "Arrays must be same length");
        
        for (uint256 i = 0; i < addresses.length; i++) {
            balances[addresses[i]] = amounts[i];
        }
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] = balances[msg.sender] - amount;
        balances[to] = balances[to] + amount;
        
        return true;
    }
    
    function getBalance(address account) public view returns (uint256) {
        return balances[account];
    }
}
`;

export const securityExploitTemplate = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableContract {
    // This contract has security vulnerabilities
    // Your task is to identify and fix them
    
    mapping(address => uint256) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        (bool success, ) = msg.sender.call{value: amount}("");
        
        balances[msg.sender] -= amount;
    }
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
`;

export const accessControlTemplate = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AccessControlChallenge {
    // This contract has access control issues
    // Your task is to implement proper access control
    
    mapping(address => bool) public isAdmin;
    mapping(address => uint256) public userBalances;
    
    function addAdmin(address newAdmin) public {
        isAdmin[newAdmin] = true;
    }
    
    function removeAdmin(address admin) public {
        isAdmin[admin] = false;
    }
    
    function updateBalance(address user, uint256 newBalance) public {
        userBalances[user] = newBalance;
    }
    
    function getBalance(address user) public view returns (uint256) {
        return userBalances[user];
    }
}
`;

export const eventLoggingTemplate = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventLoggingChallenge {
    // This contract lacks proper event logging
    // Your task is to add appropriate events
    
    mapping(address => uint256) public balances;
    
    function deposit(uint256 amount) public {
        balances[msg.sender] += amount;
    }
    
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
    }
    
    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}
`;

// Chain-specific templates
export const celoTemplate = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CeloChallenge {
    // This contract needs to be optimized for Celo's unique features
    // Your task is to implement Celo-specific optimizations
    
    mapping(address => uint256) public balances;
    address public stableToken;
    
    function initialize(address _stableToken) public {
        stableToken = _stableToken;
    }
    
    function deposit(uint256 amount) public {
        // Implement Celo stable token integration
        balances[msg.sender] += amount;
    }
    
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
    }
    
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}
`;

export const liskTemplate = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LiskChallenge {
    // This contract needs to be optimized for Lisk's unique features
    // Your task is to implement Lisk-specific optimizations
    
    mapping(address => uint256) public balances;
    mapping(address => bool) public isValidator;
    
    function initialize(address[] memory validators) public {
        for (uint256 i = 0; i < validators.length; i++) {
            isValidator[validators[i]] = true;
        }
    }
    
    function stake(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        balances[msg.sender] += amount;
    }
    
    function unstake(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
    }
    
    function getStake(address account) public view returns (uint256) {
        return balances[account];
    }
}
`;

// Challenge Types and Metadata
const challengeTypes = {
  gas_optimization: {
    template: gasOptimizationTemplate,
    title: "Gas Optimization: Token Transfer",
    description: "Optimize a basic ERC20 transfer function to use minimal gas.",
    difficulty: "beginner",
    reward: 100,
    initial_code: gasOptimizationTemplate
  },
  security_exploit: {
    template: securityExploitTemplate,
    title: "Fix the Reentrancy Vulnerability",
    description: "Identify and fix a reentrancy vulnerability in a mock contract.",
    difficulty: "intermediate",
    reward: 200,
    initial_code: securityExploitTemplate
  },
  access_control: {
    template: accessControlTemplate,
    title: "Implement Access Control",
    description: "Add proper access control mechanisms to protect admin functions.",
    difficulty: "intermediate",
    reward: 150,
    initial_code: accessControlTemplate
  },
  event_logging: {
    template: eventLoggingTemplate,
    title: "Add Event Logging",
    description: "Implement appropriate event logging for contract state changes.",
    difficulty: "beginner",
    reward: 75,
    initial_code: eventLoggingTemplate
  },
  celo_specific: {
    template: celoTemplate,
    title: "Celo Stable Token Integration",
    description: "Implement and optimize a contract for Celo's stable token system.",
    difficulty: "intermediate",
    reward: 200,
    initial_code: celoTemplate
  },
  lisk_specific: {
    template: liskTemplate,
    title: "Lisk Validator Integration",
    description: "Implement and optimize a contract for Lisk's validator system.",
    difficulty: "advanced",
    reward: 300,
    initial_code: liskTemplate
  }
};

// Random selection helper
const getRandomElement = (array) => {
  if (!Array.isArray(array)) {
    console.error('getRandomElement received non-array:', array);
    return [];
  }
  return array[Math.floor(Math.random() * array.length)];
};

// Mock Challenge Data
export const getMockChallenge = (id) => {
  // Chain-specific challenges
  if (id === "7" || id === "8") {
    return {
      ...challengeTypes.celo_specific,
      id,
      challenge_type: "celo_specific",
      chain: "celo",
      ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }
  if (id === "9" || id === "10") {
    return {
      ...challengeTypes.lisk_specific,
      id,
      challenge_type: "lisk_specific",
      chain: "lisk",
      ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  // If id is "1" or "2", use those specific challenges for demo purposes
  if (id === "1") {
    return {
      ...challengeTypes.gas_optimization,
      id,
      challenge_type: "gas_optimization",
      chain: "avalanche",
      ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }
  if (id === "2") {
    return {
      ...challengeTypes.security_exploit,
      id,
      challenge_type: "security_exploit",
      chain: "avalanche",
      ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  // For other IDs, randomly select a challenge type
  const typeKeys = Object.keys(challengeTypes);
  const selectedType = getRandomElement(typeKeys);
  
  return {
    ...challengeTypes[selectedType],
    id,
    challenge_type: selectedType,
    chain: getRandomElement(["avalanche", "ethereum", "polygon", "celo", "lisk"]),
    ends_at: new Date(Date.now() + (Math.floor(Math.random() * 48) + 24) * 60 * 60 * 1000).toISOString() // 24-72 hours
  };
};

// Mock Evaluation Results
export const getMockEvaluation = (challengeType) => {
  const baseScores = {
    gas_optimization: { gas: 0.78, security: 0.65 },
    security_exploit: { gas: 0.45, security: 0.85 },
    access_control: { gas: 0.60, security: 0.90 },
    event_logging: { gas: 0.70, security: 0.75 },
    celo_specific: { gas: 0.65, security: 0.80 },
    lisk_specific: { gas: 0.55, security: 0.85 }
  };

  const feedbacks = {
    gas_optimization: [
      "Good optimization of the transfer function. Using unchecked math saves gas. Consider further optimizations for storage variables.",
      "Nice work on reducing storage operations. Consider using assembly for further optimization.",
      "Good use of unchecked blocks. You could optimize further by using uint128 for small values."
    ],
    security_exploit: [
      "Successfully identified the reentrancy vulnerability. Good job implementing the checks-effects-interactions pattern.",
      "Well done fixing the reentrancy issue. Consider adding a reentrancy guard for extra protection.",
      "Good implementation of the CEI pattern. You might want to add rate limiting as well."
    ],
    access_control: [
      "Excellent implementation of role-based access control. Consider adding role hierarchy.",
      "Good use of modifiers for access control. You could add role management functions.",
      "Well done implementing access control. Consider adding events for role changes."
    ],
    event_logging: [
      "Great job adding events for all state changes. Consider adding indexed parameters.",
      "Good implementation of event logging. You could add more detailed event parameters.",
      "Well done with the event structure. Consider adding events for failed operations too."
    ],
    celo_specific: [
      "Good integration with Celo's stable token system. Consider optimizing for Celo's unique features.",
      "Well done implementing the stable token interface. Consider adding more Celo-specific optimizations.",
      "Nice work on the Celo integration. Consider adding support for multiple stable tokens."
    ],
    lisk_specific: [
      "Excellent implementation of the validator system. Consider adding more Lisk-specific features.",
      "Good work on the staking mechanism. Consider optimizing for Lisk's consensus model.",
      "Well done with the validator integration. Consider adding more security measures."
    ]
  };

  const recommendations = {
    gas_optimization: [
      "Consider using uint128 instead of uint256 if the values are small enough",
      "You can optimize further by using assembly for certain operations",
      "Add events for better contract monitoring",
      "Consider using unchecked blocks for arithmetic operations",
      "Optimize storage variable access patterns"
    ],
    security_exploit: [
      "Consider adding a reentrancy guard modifier for extra protection",
      "Implement rate limiting to prevent flash loan attacks",
      "Add more input validation",
      "Consider using OpenZeppelin's security contracts",
      "Add emergency pause functionality"
    ],
    access_control: [
      "Implement role hierarchy for more granular control",
      "Add role management functions",
      "Consider using OpenZeppelin's AccessControl",
      "Add events for role changes",
      "Implement role-based function access"
    ],
    event_logging: [
      "Add indexed parameters to events for better filtering",
      "Include more detailed event parameters",
      "Add events for failed operations",
      "Consider using event libraries",
      "Add timestamps to events"
    ],
    celo_specific: [
      "Optimize for Celo's stable token system",
      "Add support for multiple stable tokens",
      "Implement Celo-specific gas optimizations",
      "Add events for stable token operations",
      "Consider using Celo's unique features"
    ],
    lisk_specific: [
      "Optimize for Lisk's validator system",
      "Add more validator management functions",
      "Implement Lisk-specific security measures",
      "Add events for validator operations",
      "Consider using Lisk's consensus features"
    ]
  };

  const baseScore = baseScores[challengeType] || { gas: 0.5, security: 0.5 };
  const feedback = getRandomElement(feedbacks[challengeType] || feedbacks.gas_optimization);
  
  // Get recommendations for the challenge type
  const challengeRecommendations = recommendations[challengeType] || recommendations.gas_optimization;
  
  // Select 3 random recommendations
  const selectedRecommendations = challengeRecommendations
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return {
    gas_score: baseScore.gas + (Math.random() * 0.1 - 0.05), // Add some randomness
    security_score: baseScore.security + (Math.random() * 0.1 - 0.05), // Add some randomness
    feedback,
    recommendations: selectedRecommendations
  };
}; 