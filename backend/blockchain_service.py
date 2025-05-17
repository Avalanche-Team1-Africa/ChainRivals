import os
import json
from web3 import Web3
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Connect to Avalanche Fuji Testnet
AVALANCHE_FUJI_RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc"
w3 = Web3(Web3.HTTPProvider(AVALANCHE_FUJI_RPC_URL))

# Contract addresses (would come from deployment)
# For demo purposes, we'll use placeholder addresses
BADGE_CONTRACT_ADDRESS = os.environ.get('BADGE_CONTRACT_ADDRESS', '0x0000000000000000000000000000000000000000')
LEADERBOARD_CONTRACT_ADDRESS = os.environ.get('LEADERBOARD_CONTRACT_ADDRESS', '0x0000000000000000000000000000000000000000')

# Load ABI from files
def load_abi(contract_name):
    abi_path = ROOT_DIR / 'contracts' / f'{contract_name}_abi.json'
    if abi_path.exists():
        with open(abi_path, 'r') as f:
            return json.load(f)
    else:
        # For demo purposes, return empty ABI
        return []

# Initialize contract instances
badge_abi = load_abi('ChainRivalsBadge')
leaderboard_abi = load_abi('ChainRivalsLeaderboard')

badge_contract = w3.eth.contract(address=BADGE_CONTRACT_ADDRESS, abi=badge_abi)
leaderboard_contract = w3.eth.contract(address=LEADERBOARD_CONTRACT_ADDRESS, abi=leaderboard_abi)

# Private key for transaction signing
PRIVATE_KEY = os.environ.get("PRIVATE_KEY")
if PRIVATE_KEY and not PRIVATE_KEY.startswith('0x'):
    PRIVATE_KEY = '0x' + PRIVATE_KEY

# Check if private key is set
if not PRIVATE_KEY:
    print("Warning: No private key set in environment. Only read operations will be available.")

# Get account address from private key
try:
    account = w3.eth.account.from_key(PRIVATE_KEY)
    address = account.address
except:
    address = None

class BlockchainService:
    """Service for interacting with on-chain contracts"""
    
    @staticmethod
    def is_connected():
        """Check if connected to blockchain"""
        return w3.is_connected()
    
    @staticmethod
    def get_block_number():
        """Get current block number"""
        return w3.eth.block_number
    
    @staticmethod
    def is_valid_address(address):
        """Check if an address is valid"""
        return w3.is_address(address)
    
    @staticmethod
    async def mint_badge(user_address, badge_type, level, metadata_uri=None):
        """
        Mint a new badge NFT for a user
        
        Args:
            user_address: Wallet address of the user
            badge_type: Type of badge (0=GasOptimizer, 1=SecurityExpert, etc.)
            level: Badge level (1-5)
            metadata_uri: Optional URI for badge metadata
            
        Returns:
            transaction hash if successful, None otherwise
        """
        if not PRIVATE_KEY:
            print("Cannot mint badge: No private key set")
            return None
            
        if not BlockchainService.is_valid_address(user_address):
            print(f"Invalid user address: {user_address}")
            return None
            
        try:
            nonce = w3.eth.get_transaction_count(address)
            
            # Call contract method to mint badge
            tx = badge_contract.functions.mintBadge(
                user_address,
                badge_type,
                level
            ).build_transaction({
                'from': address,
                'nonce': nonce,
                'gas': 500000,
                'gasPrice': w3.eth.gas_price
            })
            
            # Sign and send transaction
            signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            # Wait for transaction receipt
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # Check for success
            if receipt['status'] == 1:
                return tx_hash.hex()
            else:
                print(f"Transaction failed: {receipt}")
                return None
                
        except Exception as e:
            print(f"Error minting badge: {str(e)}")
            return None
            
    @staticmethod
    async def level_up_badge(user_address, badge_type):
        """
        Level up an existing badge for a user
        
        Args:
            user_address: Wallet address of the user
            badge_type: Type of badge (0=GasOptimizer, 1=SecurityExpert, etc.)
            
        Returns:
            transaction hash if successful, None otherwise
        """
        if not PRIVATE_KEY:
            print("Cannot level up badge: No private key set")
            return None
            
        if not BlockchainService.is_valid_address(user_address):
            print(f"Invalid user address: {user_address}")
            return None
            
        try:
            nonce = w3.eth.get_transaction_count(address)
            
            # Call contract method to level up badge
            tx = badge_contract.functions.levelUpBadge(
                user_address,
                badge_type
            ).build_transaction({
                'from': address,
                'nonce': nonce,
                'gas': 500000,
                'gasPrice': w3.eth.gas_price
            })
            
            # Sign and send transaction
            signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            # Wait for transaction receipt
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # Check for success
            if receipt['status'] == 1:
                return tx_hash.hex()
            else:
                print(f"Transaction failed: {receipt}")
                return None
                
        except Exception as e:
            print(f"Error leveling up badge: {str(e)}")
            return None
    
    @staticmethod
    async def get_user_badges(user_address):
        """
        Get all badges for a user
        
        Args:
            user_address: Wallet address of the user
            
        Returns:
            List of badge token IDs
        """
        if not BlockchainService.is_valid_address(user_address):
            print(f"Invalid user address: {user_address}")
            return []
            
        try:
            # Call contract method to get user badges
            badges = badge_contract.functions.getUserBadges(user_address).call()
            return badges
        except Exception as e:
            print(f"Error getting user badges: {str(e)}")
            return []
            
    @staticmethod
    async def get_badge_details(token_id):
        """
        Get details of a specific badge
        
        Args:
            token_id: Token ID of the badge
            
        Returns:
            Dictionary with badge details
        """
        try:
            # Call contract methods to get badge details
            badge_type = badge_contract.functions.getBadgeType(token_id).call()
            badge_uri = badge_contract.functions.tokenURI(token_id).call()
            owner = badge_contract.functions.ownerOf(token_id).call()
            
            return {
                'token_id': token_id,
                'badge_type': badge_type,
                'metadata_uri': badge_uri,
                'owner': owner
            }
        except Exception as e:
            print(f"Error getting badge details: {str(e)}")
            return None
            
    @staticmethod
    async def get_user_badge_level(user_address, badge_type):
        """
        Get user's level for a specific badge type
        
        Args:
            user_address: Wallet address of the user
            badge_type: Type of badge (0=GasOptimizer, 1=SecurityExpert, etc.)
            
        Returns:
            Badge level (0-5, 0 means no badge)
        """
        if not BlockchainService.is_valid_address(user_address):
            print(f"Invalid user address: {user_address}")
            return 0
            
        try:
            # Call contract method to get user badge level
            level = badge_contract.functions.getUserBadgeLevel(user_address, badge_type).call()
            return level
        except Exception as e:
            print(f"Error getting user badge level: {str(e)}")
            return 0
            
    @staticmethod
    async def update_leaderboard_entry(user_address, submission_count, win_count, total_score, reputation_score, username, chain):
        """
        Update a user's entry in the on-chain leaderboard
        
        Args:
            user_address: Wallet address of the user
            submission_count: Number of submissions
            win_count: Number of wins
            total_score: Total score across all submissions
            reputation_score: User reputation score
            username: User's username
            chain: Chain the user is primarily associated with
            
        Returns:
            transaction hash if successful, None otherwise
        """
        if not PRIVATE_KEY:
            print("Cannot update leaderboard: No private key set")
            return None
            
        if not BlockchainService.is_valid_address(user_address):
            print(f"Invalid user address: {user_address}")
            return None
            
        try:
            nonce = w3.eth.get_transaction_count(address)
            
            # Call contract method to update leaderboard
            tx = leaderboard_contract.functions.updateUserStats(
                user_address,
                submission_count,
                win_count,
                total_score,
                reputation_score,
                username,
                chain
            ).build_transaction({
                'from': address,
                'nonce': nonce,
                'gas': 500000,
                'gasPrice': w3.eth.gas_price
            })
            
            # Sign and send transaction
            signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            # Wait for transaction receipt
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # Check for success
            if receipt['status'] == 1:
                return tx_hash.hex()
            else:
                print(f"Transaction failed: {receipt}")
                return None
                
        except Exception as e:
            print(f"Error updating leaderboard: {str(e)}")
            return None
            
    @staticmethod
    async def get_top_users(count=20):
        """
        Get top users from the on-chain leaderboard
        
        Args:
            count: Number of top users to retrieve (max 100)
            
        Returns:
            List of user addresses sorted by rank
        """
        try:
            # Call contract method to get top users
            top_users = leaderboard_contract.functions.getTopUsers().call()
            return top_users[:min(count, len(top_users))]
        except Exception as e:
            print(f"Error getting top users: {str(e)}")
            return []
            
    @staticmethod
    async def get_user_stats(user_address):
        """
        Get a user's stats from the on-chain leaderboard
        
        Args:
            user_address: Wallet address of the user
            
        Returns:
            Dictionary with user stats
        """
        if not BlockchainService.is_valid_address(user_address):
            print(f"Invalid user address: {user_address}")
            return None
            
        try:
            # Call contract method to get user stats
            stats = leaderboard_contract.functions.getUserStats(user_address).call()
            
            # Format into dictionary
            return {
                'submission_count': stats[0],
                'win_count': stats[1],
                'total_score': stats[2],
                'reputation_score': stats[3],
                'username': stats[4],
                'chain': stats[5],
                'exists': stats[6]
            }
        except Exception as e:
            print(f"Error getting user stats: {str(e)}")
            return None
            
    @staticmethod
    async def get_user_rank(user_address):
        """
        Get a user's rank on the on-chain leaderboard
        
        Args:
            user_address: Wallet address of the user
            
        Returns:
            User rank (1-based, 0 if not in top 100)
        """
        if not BlockchainService.is_valid_address(user_address):
            print(f"Invalid user address: {user_address}")
            return 0
            
        try:
            # Call contract method to get user rank
            rank = leaderboard_contract.functions.getUserRank(user_address).call()
            return rank
        except Exception as e:
            print(f"Error getting user rank: {str(e)}")
            return 0
