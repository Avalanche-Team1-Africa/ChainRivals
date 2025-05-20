// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ChainRivalsLeaderboard
 * @dev On-chain leaderboard contract for ChainRivals platform
 * Optimized for Avalanche deployment
 */
contract ChainRivalsLeaderboard is Ownable {
    struct UserStats {
        uint256 submissionCount;
        uint256 winCount;
        uint256 totalScore;
        uint256 reputationScore;
        string username;
        string chain;
        bool exists;
    }
    
    // Mapping from user address to their stats
    mapping(address => UserStats) private _userStats;
    
    // Array of all user addresses (for iteration)
    address[] private _users;
    
    // Top users by reputation score (limited to 100)
    address[] private _topUsers;
    
    // Events
    event UserStatsUpdated(address indexed user, uint256 submissionCount, uint256 winCount, uint256 reputationScore);
    event LeaderboardUpdated(address[] topUsers);
    
    constructor() Ownable(msg.sender) {}
    
    // Update user stats
    function updateUserStats(
        address user,
        uint256 submissionCount,
        uint256 winCount,
        uint256 totalScore,
        uint256 reputationScore,
        string calldata username,
        string calldata chain
    ) external onlyOwner {
        bool userExists = _userStats[user].exists;
        
        _userStats[user] = UserStats({
            submissionCount: submissionCount,
            winCount: winCount,
            totalScore: totalScore,
            reputationScore: reputationScore,
            username: username,
            chain: chain,
            exists: true
        });
        
        if (!userExists) {
            _users.push(user);
        }
        
        emit UserStatsUpdated(user, submissionCount, winCount, reputationScore);
        
        // Update top users if necessary
        _updateTopUsers();
    }
    
    // Update a subset of user stats (gas efficient for partial updates)
    function updatePartialUserStats(
        address user,
        uint256 addToSubmissionCount,
        uint256 addToWinCount,
        uint256 addToTotalScore,
        uint256 newReputationScore
    ) external onlyOwner {
        if (!_userStats[user].exists) {
            revert("User does not exist");
        }
        
        _userStats[user].submissionCount += addToSubmissionCount;
        _userStats[user].winCount += addToWinCount;
        _userStats[user].totalScore += addToTotalScore;
        _userStats[user].reputationScore = newReputationScore;
        
        emit UserStatsUpdated(
            user, 
            _userStats[user].submissionCount, 
            _userStats[user].winCount, 
            _userStats[user].reputationScore
        );
        
        // Update top users if necessary
        _updateTopUsers();
    }
    
    // Update top users (sorted by reputation score)
    function _updateTopUsers() internal {
        uint256 userCount = _users.length;
        if (userCount == 0) return;
        
        // Clear current top users
        delete _topUsers;
        
        // Sort users by reputation score (simple implementation for on-chain efficiency)
        // For large user bases, this should be done off-chain and results submitted via a trusted oracle
        // or using a more gas-efficient sorting algorithm
        
        // Add users to top users
        for (uint256 i = 0; i < userCount; i++) {
            if (_topUsers.length < 100) {
                // If we have less than 100 top users, add the user
                _topUsers.push(_users[i]);
                
                // Sort the user if needed
                if (_topUsers.length > 1) {
                    for (uint256 j = _topUsers.length - 1; j > 0; j--) {
                        if (_userStats[_topUsers[j]].reputationScore > _userStats[_topUsers[j-1]].reputationScore) {
                            // Swap positions
                            address temp = _topUsers[j];
                            _topUsers[j] = _topUsers[j-1];
                            _topUsers[j-1] = temp;
                        } else {
                            break;
                        }
                    }
                }
            } else if (_userStats[_users[i]].reputationScore > _userStats[_topUsers[99]].reputationScore) {
                // If we already have 100 top users but this user has a higher score than the last one
                _topUsers[99] = _users[i];
                
                // Sort the user if needed
                for (uint256 j = 99; j > 0; j--) {
                    if (_userStats[_topUsers[j]].reputationScore > _userStats[_topUsers[j-1]].reputationScore) {
                        // Swap positions
                        address temp = _topUsers[j];
                        _topUsers[j] = _topUsers[j-1];
                        _topUsers[j-1] = temp;
                    } else {
                        break;
                    }
                }
            }
        }
        
        emit LeaderboardUpdated(_topUsers);
    }
    
    // Manually trigger top users update
    function updateTopUsers() external onlyOwner {
        _updateTopUsers();
    }
    
    // Get user stats
    function getUserStats(address user) external view returns (
        uint256 submissionCount,
        uint256 winCount,
        uint256 totalScore,
        uint256 reputationScore,
        string memory username,
        string memory chain,
        bool exists
    ) {
        UserStats memory stats = _userStats[user];
        return (
            stats.submissionCount,
            stats.winCount,
            stats.totalScore,
            stats.reputationScore,
            stats.username,
            stats.chain,
            stats.exists
        );
    }
    
    // Get top users (up to 100)
    function getTopUsers() external view returns (address[] memory) {
        return _topUsers;
    }
    
    // Get top users with their stats (paginated)
    function getTopUsersWithStats(uint256 offset, uint256 limit) external view returns (
        address[] memory users,
        uint256[] memory submissionCounts,
        uint256[] memory winCounts,
        uint256[] memory reputationScores,
        string[] memory usernames,
        string[] memory chains
    ) {
        uint256 topUsersCount = _topUsers.length;
        if (offset >= topUsersCount) {
            return (
                new address[](0),
                new uint256[](0),
                new uint256[](0),
                new uint256[](0),
                new string[](0),
                new string[](0)
            );
        }
        
        uint256 end = offset + limit;
        if (end > topUsersCount) {
            end = topUsersCount;
        }
        
        uint256 resultSize = end - offset;
        users = new address[](resultSize);
        submissionCounts = new uint256[](resultSize);
        winCounts = new uint256[](resultSize);
        reputationScores = new uint256[](resultSize);
        usernames = new string[](resultSize);
        chains = new string[](resultSize);
        
        for (uint256 i = 0; i < resultSize; i++) {
            address user = _topUsers[offset + i];
            users[i] = user;
            submissionCounts[i] = _userStats[user].submissionCount;
            winCounts[i] = _userStats[user].winCount;
            reputationScores[i] = _userStats[user].reputationScore;
            usernames[i] = _userStats[user].username;
            chains[i] = _userStats[user].chain;
        }
        
        return (users, submissionCounts, winCounts, reputationScores, usernames, chains);
    }
    
    // Get user rank (if in top 100, otherwise returns 0)
    function getUserRank(address user) external view returns (uint256) {
        for (uint256 i = 0; i < _topUsers.length; i++) {
            if (_topUsers[i] == user) {
                return i + 1;
            }
        }
        return 0;
    }
    
    // Get total user count
    function getTotalUserCount() external view returns (uint256) {
        return _users.length;
    }
    
    // Calculate average score for a user
    function getUserAverageScore(address user) external view returns (uint256) {
        UserStats memory stats = _userStats[user];
        if (stats.submissionCount == 0) return 0;
        return stats.totalScore / stats.submissionCount;
    }
    
    // Filter top users by chain (gas inefficient, intended for off-chain calling)
    function getTopUsersByChain(string calldata chain) external view returns (address[] memory) {
        uint256 count = 0;
        
        // First count how many users match the chain
        for (uint256 i = 0; i < _topUsers.length; i++) {
            if (_compareStrings(_userStats[_topUsers[i]].chain, chain)) {
                count++;
            }
        }
        
        // Then create and populate the result array
        address[] memory result = new address[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _topUsers.length && index < count; i++) {
            if (_compareStrings(_userStats[_topUsers[i]].chain, chain)) {
                result[index] = _topUsers[i];
                index++;
            }
        }
        
        return result;
    }
    
    // Helper function to compare strings
    function _compareStrings(string memory a, string memory b) private pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}
