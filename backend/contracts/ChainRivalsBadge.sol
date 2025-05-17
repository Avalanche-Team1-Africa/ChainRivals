// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ChainRivalsBadge
 * @dev ERC721 contract for ChainRivals achievement badges
 * Specially optimized for deployment on Avalanche
 */
contract ChainRivalsBadge is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    
    Counters.Counter private _tokenIdCounter;
    
    // Badge types
    enum BadgeType {
        GasOptimizer,
        SecurityExpert,
        VulnerabilityHunter,
        TopContributor,
        ChallengeMaster,
        AvalancheSpecialist
    }
    
    // Mapping from token ID to badge type
    mapping(uint256 => BadgeType) private _badgeTypes;
    
    // Mapping from badge type to level requirements
    mapping(BadgeType => uint256[]) private _levelRequirements;
    
    // Mapping from user address to badge level for each badge type
    mapping(address => mapping(BadgeType => uint256)) private _userBadgeLevels;
    
    // Base URI for badge metadata
    string private _baseTokenURI;
    
    // Events
    event BadgeMinted(address indexed to, uint256 tokenId, BadgeType badgeType, uint256 level);
    event BadgeLeveledUp(address indexed owner, BadgeType badgeType, uint256 newLevel);
    
    constructor(string memory baseURI) ERC721("ChainRivals Badge", "CRBADGE") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
        
        // Set level requirements for each badge type
        _levelRequirements[BadgeType.GasOptimizer] = [1, 3, 10, 25, 50];           // Number of gas optimization challenge wins
        _levelRequirements[BadgeType.SecurityExpert] = [1, 3, 10, 25, 50];         // Number of security challenge wins
        _levelRequirements[BadgeType.VulnerabilityHunter] = [1, 5, 15, 30, 50];    // Number of vulnerabilities found
        _levelRequirements[BadgeType.TopContributor] = [5, 20, 50, 100, 200];      // Total submissions
        _levelRequirements[BadgeType.ChallengeMaster] = [3, 10, 25, 50, 100];      // Total wins
        _levelRequirements[BadgeType.AvalancheSpecialist] = [2, 5, 15, 30, 50];    // Avalanche-specific challenges completed
    }
    
    // Override functions to resolve inheritance conflicts
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }
    
    function _increaseBalance(address account, uint128 amount) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, amount);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    // Mint new badge
    function mintBadge(address to, BadgeType badgeType, uint256 level) external onlyOwner returns (uint256) {
        require(level > 0 && level <= 5, "Level must be between 1 and 5");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _mint(to, tokenId);
        _badgeTypes[tokenId] = badgeType;
        _userBadgeLevels[to][badgeType] = level;
        
        // Set token URI with badge type and level
        string memory badgeTypeStr;
        if (badgeType == BadgeType.GasOptimizer) badgeTypeStr = "gas-optimizer";
        else if (badgeType == BadgeType.SecurityExpert) badgeTypeStr = "security-expert";
        else if (badgeType == BadgeType.VulnerabilityHunter) badgeTypeStr = "vulnerability-hunter";
        else if (badgeType == BadgeType.TopContributor) badgeTypeStr = "top-contributor";
        else if (badgeType == BadgeType.ChallengeMaster) badgeTypeStr = "challenge-master";
        else if (badgeType == BadgeType.AvalancheSpecialist) badgeTypeStr = "avalanche-specialist";
        
        _setTokenURI(tokenId, string(abi.encodePacked(
            badgeTypeStr, "/", level.toString()
        )));
        
        emit BadgeMinted(to, tokenId, badgeType, level);
        
        return tokenId;
    }
    
    // Level up existing badge (creates new badge if user doesn't have one)
    function levelUpBadge(address user, BadgeType badgeType) external onlyOwner returns (uint256) {
        uint256 currentLevel = _userBadgeLevels[user][badgeType];
        uint256 newLevel = currentLevel + 1;
        
        require(newLevel <= 5, "Maximum level reached");
        
        // If user doesn't have this badge type yet, mint a new one
        if (currentLevel == 0) {
            return mintBadge(user, badgeType, newLevel);
        } else {
            // Update user's badge level
            _userBadgeLevels[user][badgeType] = newLevel;
            
            emit BadgeLeveledUp(user, badgeType, newLevel);
            
            // Return 0 as no new token was minted
            return 0;
        }
    }
    
    // Check user's level for a specific badge type
    function getUserBadgeLevel(address user, BadgeType badgeType) external view returns (uint256) {
        return _userBadgeLevels[user][badgeType];
    }
    
    // Get badge type for a specific token
    function getBadgeType(uint256 tokenId) external view returns (BadgeType) {
        require(_exists(tokenId), "Badge does not exist");
        return _badgeTypes[tokenId];
    }
    
    // Get level requirement for a badge type and level
    function getLevelRequirement(BadgeType badgeType, uint256 level) external view returns (uint256) {
        require(level > 0 && level <= 5, "Level must be between 1 and 5");
        return _levelRequirements[badgeType][level - 1];
    }
    
    // Check if token exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
    
    // Get all badges owned by a user
    function getUserBadges(address user) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory tokenIds = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(user, i);
        }
        
        return tokenIds;
    }
}
