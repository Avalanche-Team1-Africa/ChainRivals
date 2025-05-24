import os
import json
import logging
from web3 import Web3
from dotenv import load_dotenv
from pathlib import Path
import solcx
import sys

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
ROOT_DIR = Path(__file__).parent
env_path = ROOT_DIR / '.env'

try:
    load_dotenv(env_path)
    logger.info(f"Loading environment variables from {env_path}")
except Exception as e:
    logger.error(f"Failed to load .env file: {str(e)}")
    logger.error("Please ensure .env file exists and is properly formatted")
    sys.exit(1)

# Connect to Avalanche Fuji Testnet
AVALANCHE_FUJI_RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc"

try:
    w3 = Web3(Web3.HTTPProvider(AVALANCHE_FUJI_RPC_URL))
    if not w3.is_connected():
        raise ConnectionError("Failed to connect to Avalanche Fuji Testnet")
    logger.info(f"Connected to Avalanche Fuji Testnet. Current block: {w3.eth.block_number}")
except Exception as e:
    logger.error(f"Network connection error: {str(e)}")
    logger.error("Please check your internet connection and the RPC URL")
    sys.exit(1)

# Get private key
PRIVATE_KEY = os.environ.get("PRIVATE_KEY")
if not PRIVATE_KEY:
    logger.error("No private key found in .env file")
    logger.error("Please add your private key as PRIVATE_KEY in the .env file")
    sys.exit(1)

# Validate private key format
try:
    if not PRIVATE_KEY.startswith('0x'):
        PRIVATE_KEY = '0x' + PRIVATE_KEY
    # Test if the private key is valid
    account = w3.eth.account.from_key(PRIVATE_KEY)
    address = account.address
    logger.info(f"Using account: {address}")
except ValueError as e:
    logger.error(f"Invalid private key format: {str(e)}")
    logger.error("Private key must be a 64-character hexadecimal string")
    sys.exit(1)
except Exception as e:
    logger.error(f"Error processing private key: {str(e)}")
    sys.exit(1)

# Check account balance
try:
    balance = w3.eth.get_balance(address)
    balance_avax = w3.from_wei(balance, 'ether')
    logger.info(f"Account balance: {balance_avax} AVAX")
    
    if balance == 0:
        logger.error("Account has no balance")
        logger.error("Please fund your account on Fuji Testnet")
        logger.error("You can get testnet AVAX from: https://faucet.avax.network/")
        sys.exit(1)
except Exception as e:
    logger.error(f"Error checking balance: {str(e)}")
    sys.exit(1)

# Compile contracts
def compile_contract(contract_path):
    try:
        logger.info(f"Compiling contract: {contract_path}")
        with open(contract_path, 'r') as f:
            contract_source = f.read()
        
        # Compile the contract
        compiled_sol = solcx.compile_standard(
            {
                "language": "Solidity",
                "sources": {
                    contract_path: {
                        "content": contract_source
                    }
                },
                "settings": {
                    "outputSelection": {
                        "*": {
                            "*": ["abi", "evm.bytecode"]
                        }
                    }
                }
            },
            solc_version="0.8.19"
        )
        
        # Get the contract name from the path
        contract_name = Path(contract_path).stem
        
        # Extract the ABI and bytecode
        abi = compiled_sol['contracts'][contract_path][contract_name]['abi']
        bytecode = compiled_sol['contracts'][contract_path][contract_name]['evm']['bytecode']['object']
        
        logger.info(f"Successfully compiled {contract_name}")
        return abi, bytecode
    except FileNotFoundError:
        logger.error(f"Contract file not found: {contract_path}")
        raise
    except solcx.exceptions.SolcError as e:
        logger.error(f"Solidity compilation error: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during compilation: {str(e)}")
        raise

# Function to deploy a contract
def deploy_contract(abi, bytecode, constructor_args=None):
    try:
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
        logger.info(f"Transaction sent: {tx_hash.hex()}")
        
        # Wait for the transaction to be mined
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        contract_address = tx_receipt.contractAddress
        logger.info(f"Contract deployed at: {contract_address}")
        
        return contract_address, tx_receipt
    except ValueError as e:
        logger.error(f"Transaction error: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Deployment error: {str(e)}")
        raise

# Main deployment function
def main():
    try:
        logger.info("Starting deployment to Avalanche Fuji Testnet...")
        
        # Compile and deploy contracts
        contracts_dir = ROOT_DIR / 'contracts'
        
        # Deploy Core contract
        logger.info("Deploying ChainRivalsCore contract...")
        core_abi, core_bytecode = compile_contract(str(contracts_dir / 'core/ChainRivalsCore.sol'))
        core_address, core_receipt = deploy_contract(core_abi, core_bytecode)
        
        # Deploy GasOptimizationChallenge contract
        logger.info("Deploying GasOptimizationChallenge contract...")
        gas_abi, gas_bytecode = compile_contract(str(contracts_dir / 'challenges/GasOptimizationChallenge.sol'))
        gas_address, gas_receipt = deploy_contract(gas_abi, gas_bytecode)
        
        # Deploy SecurityChallenge contract
        logger.info("Deploying SecurityChallenge contract...")
        security_abi, security_bytecode = compile_contract(str(contracts_dir / 'challenges/SecurityChallenge.sol'))
        security_address, security_receipt = deploy_contract(security_abi, security_bytecode)
        
        # Deploy Badge contract
        logger.info("Deploying ChainRivalsBadge contract...")
        badge_abi, badge_bytecode = compile_contract(str(contracts_dir / 'rewards/ChainRivalsBadge.sol'))
        badge_base_uri = "https://api.chainrivals.com/badges/"
        badge_address, badge_receipt = deploy_contract(badge_abi, badge_bytecode, [badge_base_uri])
        
        # Deploy Leaderboard contract
        logger.info("Deploying ChainRivalsLeaderboard contract...")
        leaderboard_abi, leaderboard_bytecode = compile_contract(str(contracts_dir / 'rewards/ChainRivalsLeaderboard.sol'))
        leaderboard_address, leaderboard_receipt = deploy_contract(leaderboard_abi, leaderboard_bytecode)
        
        # Save deployment info
        deployment_info = {
            "core_contract": {
                "address": core_address,
                "transaction_hash": core_receipt.transactionHash.hex(),
                "block_number": core_receipt.blockNumber
            },
            "gas_challenge_contract": {
                "address": gas_address,
                "transaction_hash": gas_receipt.transactionHash.hex(),
                "block_number": gas_receipt.blockNumber
            },
            "security_challenge_contract": {
                "address": security_address,
                "transaction_hash": security_receipt.transactionHash.hex(),
                "block_number": security_receipt.blockNumber
            },
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
        
        logger.info("Deployment complete! Info saved to deployment_info.json")
        logger.info(f"Core contract: {core_address}")
        logger.info(f"Gas Challenge contract: {gas_address}")
        logger.info(f"Security Challenge contract: {security_address}")
        logger.info(f"Badge contract: {badge_address}")
        logger.info(f"Leaderboard contract: {leaderboard_address}")
        
    except Exception as e:
        logger.error(f"Deployment failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
