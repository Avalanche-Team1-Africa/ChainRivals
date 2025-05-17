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

# Check connection
if not w3.is_connected():
    print("Failed to connect to Avalanche Fuji Testnet")
    exit(1)

print(f"Connected to Avalanche Fuji Testnet. Current block: {w3.eth.block_number}")

# Add your private key to .env file
# Format: PRIVATE_KEY=0xabc123...
PRIVATE_KEY = os.environ.get("PRIVATE_KEY")
if not PRIVATE_KEY:
    print("No private key found in .env file. Please add your private key as PRIVATE_KEY.")
    exit(1)

# Make sure to add 0x prefix if it's not there
if not PRIVATE_KEY.startswith('0x'):
    PRIVATE_KEY = '0x' + PRIVATE_KEY

# Get account address from private key
account = w3.eth.account.from_key(PRIVATE_KEY)
address = account.address
print(f"Using account: {address}")

# Check account balance
balance = w3.eth.get_balance(address)
balance_avax = w3.from_wei(balance, 'ether')
print(f"Account balance: {balance_avax} AVAX")

if balance == 0:
    print("Account has no balance. Please fund your account on Fuji Testnet.")
    print("You can get testnet AVAX from a faucet: https://faucet.avax.network/")
    exit(1)

# Contract compilation would normally be done with a build system like Hardhat or Truffle
# For this script, we'll assume you've already compiled the contracts and have the ABI and bytecode
# In a production environment, you'd use something like brownie or web3.py with solcx

# For demonstration, we'll use pre-compiled contract data
# This is a placeholder for your actual compiled contract data
BADGE_CONTRACT_ABI = []  # Replace with actual ABI
BADGE_CONTRACT_BYTECODE = "0x"  # Replace with actual bytecode
LEADERBOARD_CONTRACT_ABI = []  # Replace with actual ABI
LEADERBOARD_CONTRACT_BYTECODE = "0x"  # Replace with actual bytecode

# Function to deploy a contract
def deploy_contract(abi, bytecode, constructor_args=None):
    contract = w3.eth.contract(abi=abi, bytecode=bytecode)
    
    # Prepare the transaction
    if constructor_args:
        tx_data = contract.constructor(*constructor_args).build_transaction({
            'from': address,
            'nonce': w3.eth.get_transaction_count(address),
            'gas': 3000000,  # Adjust as needed
            'gasPrice': w3.eth.gas_price
        })
    else:
        tx_data = contract.constructor().build_transaction({
            'from': address,
            'nonce': w3.eth.get_transaction_count(address),
            'gas': 3000000,  # Adjust as needed
            'gasPrice': w3.eth.gas_price
        })
    
    # Sign the transaction
    signed_tx = w3.eth.account.sign_transaction(tx_data, PRIVATE_KEY)
    
    # Send the transaction
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    print(f"Transaction sent: {tx_hash.hex()}")
    
    # Wait for the transaction to be mined
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    contract_address = tx_receipt.contractAddress
    print(f"Contract deployed at: {contract_address}")
    
    return contract_address, tx_receipt

# Main deployment function
def main():
    print("Starting deployment to Avalanche Fuji Testnet...")
    
    # Deploy Badge contract
    badge_base_uri = "https://api.chainrivals.com/badges/"  # Replace with your actual metadata URI
    print("Deploying ChainRivalsBadge contract...")
    badge_address, badge_receipt = deploy_contract(
        BADGE_CONTRACT_ABI,
        BADGE_CONTRACT_BYTECODE,
        [badge_base_uri]
    )
    
    # Deploy Leaderboard contract 
    print("Deploying ChainRivalsLeaderboard contract...")
    leaderboard_address, leaderboard_receipt = deploy_contract(
        LEADERBOARD_CONTRACT_ABI,
        LEADERBOARD_CONTRACT_BYTECODE
    )
    
    # Save contract addresses and transaction receipts
    deployment_info = {
        "badge_contract": {
            "address": badge_address,
            "transaction_hash": badge_receipt.transactionHash.hex(),
            "block_number": badge_receipt.blockNumber
        },
        "leaderboard_contract": {
            "address": leaderboard_address,
            "transaction_hash": leaderboard_receipt.transactionHash.hex(),
            "block_number": leaderboard_receipt.blockNumber
        },
        "network": "Avalanche Fuji Testnet",
        "deployed_by": address,
        "timestamp": w3.eth.get_block('latest').timestamp
    }
    
    # Save deployment info to a JSON file
    with open('deployment_info.json', 'w') as f:
        json.dump(deployment_info, f, indent=2)
    
    print(f"Deployment complete! Info saved to deployment_info.json")
    print(f"Badge contract: {badge_address}")
    print(f"Leaderboard contract: {leaderboard_address}")

if __name__ == "__main__":
    main()
