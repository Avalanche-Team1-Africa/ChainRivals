from fastapi import FastAPI, APIRouter, HTTPException, Depends, Body
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from web3 import Web3
import json

# Import models
from models import (
    StatusCheck, StatusCheckCreate, User, UserCreate,
    Challenge, ChallengeCreate, Submission, SubmissionCreate,
    AIFeedback, Badge, BadgeCreate, LeaderboardEntry
)

# Import blockchain service
from blockchain_service import BlockchainService

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Constants
AVALANCHE_FUJI_RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc"

# Initialize Web3 connection to Avalanche Fuji Testnet
w3 = Web3(Web3.HTTPProvider(AVALANCHE_FUJI_RPC_URL))

# Mock AI evaluator for contract submissions
def evaluate_contract(code: str, challenge_type: str) -> AIFeedback:
    """
    Mock AI evaluation system for smart contracts.
    In a real implementation, this would call an LLM or specialized code analysis tool.
    """
    if challenge_type == "gas_optimization":
        # Simple analysis checking for common gas optimization patterns
        gas_score = 0
        security_score = 0
        feedback = ""
        recommendations = []
        
        # Check for gas optimization patterns
        if "uint256" in code and "uint8" in code:
            gas_score += 0.2
            feedback += "Good use of appropriate integer sizes. "
        else:
            recommendations.append("Consider using smaller uint types where appropriate")
            
        if "memory" in code:
            gas_score += 0.3
            feedback += "Using memory storage appropriately. "
        else:
            recommendations.append("Consider using memory for temporary variables")
            
        if "require" in code:
            security_score += 0.4
            feedback += "Using require statements for validation. "
        else:
            recommendations.append("Add input validation with require statements")
            
        if "view" in code or "pure" in code:
            gas_score += 0.2
            feedback += "Proper use of view/pure functions. "
        else:
            recommendations.append("Mark read-only functions as view or pure")
        
        # Generate random scores if nothing else matched
        if gas_score == 0:
            gas_score = 0.3
        if security_score == 0:
            security_score = 0.2
            
        if not feedback:
            feedback = "Basic implementation detected."
            
        if not recommendations:
            recommendations = ["Consider using events for important state changes"]
    
    elif challenge_type == "security_exploit":
        # Mock security analysis
        gas_score = 0.1
        security_score = 0
        feedback = ""
        recommendations = []
        
        # Check for security patterns
        if "reentrancy" in code.lower():
            security_score += 0.5
            feedback += "Potential reentrancy vulnerability identified. "
        
        if "selfdestruct" in code:
            security_score += 0.3
            feedback += "Use of selfdestruct identified - can be dangerous. "
        
        if "tx.origin" in code:
            security_score += 0.4
            feedback += "Using tx.origin for authentication is vulnerable. "
        
        if "require" in code or "assert" in code:
            security_score += 0.2
            feedback += "Using validation checks. "
        else:
            recommendations.append("Add input validation with require statements")
        
        # Generate random scores if nothing else matched
        if security_score == 0:
            security_score = 0.3
            
        if not feedback:
            feedback = "Basic security implementation detected."
            
        if not recommendations:
            recommendations = ["Consider using OpenZeppelin's security contracts"]
    
    else:
        # Default evaluation
        gas_score = 0.5
        security_score = 0.5
        feedback = "Standard implementation."
        recommendations = ["Review gas optimization techniques", "Consider security best practices"]
    
    return AIFeedback(
        gas_score=min(gas_score, 1.0),
        security_score=min(security_score, 1.0),
        feedback=feedback,
        recommendations=recommendations
    )

# Routes
@api_router.get("/")
async def root():
    return {"message": "Welcome to ChainRivals API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Web3 Routes
@api_router.get("/web3/status")
async def web3_status():
    """Check if Web3 connection is working"""
    try:
        block_number = w3.eth.block_number
        is_connected = BlockchainService.is_connected()
        return {
            "status": "connected" if is_connected else "disconnected",
            "network": "Avalanche Fuji Testnet",
            "block_number": block_number,
            "badge_contract_available": os.environ.get('BADGE_CONTRACT_ADDRESS') != '0x0000000000000000000000000000000000000000',
            "leaderboard_contract_available": os.environ.get('LEADERBOARD_CONTRACT_ADDRESS') != '0x0000000000000000000000000000000000000000'
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect to blockchain: {str(e)}")

# User Routes
@api_router.post("/users", response_model=User)
async def create_user(user: UserCreate):
    # Validate Ethereum address
    if not w3.is_address(user.wallet_address):
        raise HTTPException(status_code=400, detail="Invalid wallet address")
    
    # Check if user already exists
    existing_user = await db.users.find_one({"wallet_address": user.wallet_address})
    if existing_user:
        return User(**existing_user)
    
    # Create new user
    user_dict = user.dict()
    user_obj = User(**user_dict)
    await db.users.insert_one(user_obj.dict())
    return user_obj

@api_router.get("/users/{wallet_address}", response_model=User)
async def get_user(wallet_address: str):
    # Validate Ethereum address
    if not w3.is_address(wallet_address):
        raise HTTPException(status_code=400, detail="Invalid wallet address")
    
    user = await db.users.find_one({"wallet_address": wallet_address})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get on-chain rank if available
    try:
        onchain_rank = await BlockchainService.get_user_rank(wallet_address)
        user["onchain_rank"] = onchain_rank
    except Exception as e:
        logging.error(f"Failed to get on-chain rank: {str(e)}")
    
    return User(**user)

@api_router.get("/users/{wallet_address}/badges", response_model=List[Badge])
async def get_user_badges(wallet_address: str):
    """Get all badges for a user"""
    # Validate Ethereum address
    if not w3.is_address(wallet_address):
        raise HTTPException(status_code=400, detail="Invalid wallet address")
    
    # Get user from database
    user = await db.users.find_one({"wallet_address": wallet_address})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get badges from database
    badges = await db.badges.find({"user_id": user["id"]}).to_list(100)
    
    # Get on-chain badges if available
    try:
        onchain_badge_ids = await BlockchainService.get_user_badges(wallet_address)
        
        # For each on-chain badge, check if it's in our database
        for token_id in onchain_badge_ids:
            badge_details = await BlockchainService.get_badge_details(token_id)
            if badge_details:
                # Check if this badge is already in our database
                existing_badge = next((b for b in badges if b.get("token_id") == token_id), None)
                if not existing_badge:
                    # Add this badge to our database
                    badge_type_map = {
                        0: "gas_optimizer",
                        1: "security_expert", 
                        2: "vulnerability_hunter",
                        3: "top_contributor",
                        4: "challenge_master",
                        5: "avalanche_specialist"
                    }
                    badge_type = badge_type_map.get(badge_details["badge_type"], "unknown")
                    
                    # Create default image URL based on badge type
                    image_url = f"https://api.chainrivals.com/badges/images/{badge_type}.png"
                    
                    # Create new badge in database
                    new_badge = Badge(
                        user_id=user["id"],
                        token_id=token_id,
                        badge_type=badge_type,
                        level=1,  # Default, would need to query contract for actual level
                        description=f"{badge_type.replace('_', ' ').title()} Badge",
                        image_url=image_url,
                        is_onchain=True,
                        metadata_uri=badge_details["metadata_uri"]
                    )
                    await db.badges.insert_one(new_badge.dict())
                    badges.append(new_badge.dict())
    except Exception as e:
        logging.error(f"Failed to get on-chain badges: {str(e)}")
    
    return [Badge(**badge) for badge in badges]

@api_router.post("/badges", response_model=Badge)
async def create_badge(badge: BadgeCreate):
    """Create a new badge for a user"""
    # Check if user exists
    user = await db.users.find_one({"id": badge.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create badge
    badge_dict = badge.dict()
    badge_obj = Badge(**badge_dict)
    await db.badges.insert_one(badge_obj.dict())
    
    # Try to mint on-chain badge
    try:
        # Map badge type to contract enum
        badge_type_map = {
            "gas_optimizer": 0,
            "security_expert": 1,
            "vulnerability_hunter": 2,
            "top_contributor": 3,
            "challenge_master": 4,
            "avalanche_specialist": 5
        }
        
        badge_type_enum = badge_type_map.get(badge.badge_type, 0)
        tx_hash = await BlockchainService.mint_badge(
            user["wallet_address"],
            badge_type_enum,
            badge.level
        )
        
        if tx_hash:
            # Update badge with transaction hash
            await db.badges.update_one(
                {"id": badge_obj.id},
                {"$set": {"transaction_hash": tx_hash, "is_onchain": True}}
            )
            badge_obj.transaction_hash = tx_hash
            badge_obj.is_onchain = True
    except Exception as e:
        logging.error(f"Failed to mint on-chain badge: {str(e)}")
    
    return badge_obj

@api_router.post("/badges/{badge_id}/level-up", response_model=Badge)
async def level_up_badge(badge_id: str):
    """Level up a badge"""
    # Get badge
    badge = await db.badges.find_one({"id": badge_id})
    if not badge:
        raise HTTPException(status_code=404, detail="Badge not found")
    
    # Check if level is already max
    if badge["level"] >= 5:
        raise HTTPException(status_code=400, detail="Badge already at max level")
    
    # Get user
    user = await db.users.find_one({"id": badge["user_id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update badge level
    new_level = badge["level"] + 1
    await db.badges.update_one(
        {"id": badge_id},
        {"$set": {"level": new_level}}
    )
    
    # Try to level up on-chain badge
    try:
        # Map badge type to contract enum
        badge_type_map = {
            "gas_optimizer": 0,
            "security_expert": 1,
            "vulnerability_hunter": 2,
            "top_contributor": 3,
            "challenge_master": 4,
            "avalanche_specialist": 5
        }
        
        badge_type_enum = badge_type_map.get(badge["badge_type"], 0)
        tx_hash = await BlockchainService.level_up_badge(
            user["wallet_address"],
            badge_type_enum
        )
        
        if tx_hash:
            # Update badge with transaction hash
            await db.badges.update_one(
                {"id": badge_id},
                {"$set": {"transaction_hash": tx_hash, "is_onchain": True}}
            )
            badge["transaction_hash"] = tx_hash
            badge["is_onchain"] = True
    except Exception as e:
        logging.error(f"Failed to level up on-chain badge: {str(e)}")
    
    # Return updated badge
    badge["level"] = new_level
    return Badge(**badge)

# Challenge Routes
@api_router.post("/challenges", response_model=Challenge)
async def create_challenge(challenge: ChallengeCreate):
    challenge_dict = challenge.dict()
    challenge_obj = Challenge(**challenge_dict)
    await db.challenges.insert_one(challenge_obj.dict())
    return challenge_obj

@api_router.get("/challenges", response_model=List[Challenge])
async def get_challenges(active_only: bool = True, chain: Optional[str] = None):
    query = {}
    
    if active_only:
        query["is_active"] = True
    
    if chain:
        query["chain"] = chain
    
    challenges = await db.challenges.find(query).to_list(100)
    return [Challenge(**challenge) for challenge in challenges]

@api_router.get("/challenges/{challenge_id}", response_model=Challenge)
async def get_challenge(challenge_id: str):
    challenge = await db.challenges.find_one({"id": challenge_id})
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    return Challenge(**challenge)

# Submission Routes
@api_router.post("/submissions", response_model=Submission)
async def create_submission(submission: SubmissionCreate):
    # Check if challenge exists
    challenge = await db.challenges.find_one({"id": submission.challenge_id})
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # Check if user exists
    user = await db.users.find_one({"id": submission.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Evaluate the contract code
    challenge_obj = Challenge(**challenge)
    evaluation = evaluate_contract(submission.code, challenge_obj.challenge_type)
    
    # Calculate score based on challenge type
    if challenge_obj.challenge_type == "gas_optimization":
        score = evaluation.gas_score * 100
    else:  # security_exploit
        score = evaluation.security_score * 100
    
    # Create submission
    submission_dict = submission.dict()
    submission_obj = Submission(
        **submission_dict,
        score=score,
        feedback=evaluation.feedback
    )
    
    # Check if this is a winning submission (top 85+ score)
    is_winner = score >= 85.0
    if is_winner:
        submission_obj.is_winner = True
        
        # Update user reputation
        reputation_increase = int(score / 10)  # E.g., 85 score = 8 reputation points
        new_reputation = user.get("reputation_score", 0) + reputation_increase
        
        await db.users.update_one(
            {"id": user["id"]},
            {"$set": {"reputation_score": new_reputation}}
        )
        
        # Check if user deserves a badge or level up
        await check_and_award_badges(user, challenge_obj, score)
        
        # Try to update on-chain leaderboard
        try:
            # Get all user's submissions
            user_submissions = await db.submissions.find({"user_id": user["id"]}).to_list(1000)
            submission_count = len(user_submissions)
            win_count = len([s for s in user_submissions if s.get("is_winner", False)])
            total_score = sum([s.get("score", 0) for s in user_submissions])
            
            tx_hash = await BlockchainService.update_leaderboard_entry(
                user["wallet_address"],
                submission_count,
                win_count,
                int(total_score),
                new_reputation,
                user.get("username", "Anonymous"),
                challenge_obj.chain
            )
            
            if tx_hash:
                # Update submission with on-chain verification
                submission_obj.onchain_verification = tx_hash
        except Exception as e:
            logging.error(f"Failed to update on-chain leaderboard: {str(e)}")
    
    await db.submissions.insert_one(submission_obj.dict())
    return submission_obj

@api_router.get("/submissions/{challenge_id}", response_model=List[Submission])
async def get_challenge_submissions(challenge_id: str):
    submissions = await db.submissions.find({"challenge_id": challenge_id}).to_list(100)
    return [Submission(**submission) for submission in submissions]

@api_router.get("/submissions/user/{user_id}", response_model=List[Submission])
async def get_user_submissions(user_id: str):
    submissions = await db.submissions.find({"user_id": user_id}).to_list(100)
    return [Submission(**submission) for submission in submissions]

# Leaderboard Route
@api_router.get("/leaderboard")
async def get_leaderboard(chain: Optional[str] = None):
    # Aggregate to calculate user stats
    pipeline = [
        {"$group": {
            "_id": "$user_id",
            "submission_count": {"$sum": 1},
            "average_score": {"$avg": "$score"},
            "wins": {"$sum": {"$cond": [{"$eq": ["$is_winner", True]}, 1, 0]}}
        }},
        {"$sort": {"average_score": -1}},
        {"$limit": 20}
    ]
    
    if chain:
        # First get challenges for this chain
        chain_challenges = await db.challenges.find({"chain": chain}).to_list(1000)
        challenge_ids = [c["id"] for c in chain_challenges]
        
        # Then filter submissions by these challenges
        pipeline.insert(0, {"$match": {"challenge_id": {"$in": challenge_ids}}})
    
    leaderboard_data = await db.submissions.aggregate(pipeline).to_list(20)
    
    # Get user details for each entry
    result = []
    for entry in leaderboard_data:
        user = await db.users.find_one({"id": entry["_id"]})
        if user:
            # Get user badges
            badges = await db.badges.find({"user_id": entry["_id"]}).to_list(100)
            badges_count = len(badges)
            highest_badge_level = max([b.get("level", 0) for b in badges]) if badges else 0
            
            # Get on-chain rank if available
            onchain_rank = None
            try:
                onchain_rank = await BlockchainService.get_user_rank(user["wallet_address"])
            except Exception as e:
                logging.error(f"Failed to get on-chain rank: {str(e)}")
            
            result.append({
                "user_id": entry["_id"],
                "username": user.get("username", "Anonymous"),
                "wallet_address": user["wallet_address"],
                "submission_count": entry["submission_count"],
                "average_score": round(entry["average_score"], 2),
                "wins": entry["wins"],
                "reputation_score": user.get("reputation_score", 0),
                "chain": chain or "all",
                "onchain_rank": onchain_rank,
                "badges_count": badges_count,
                "highest_badge_level": highest_badge_level
            })
    
    return result

@api_router.get("/leaderboard/onchain")
async def get_onchain_leaderboard(limit: int = 10):
    """Get leaderboard data directly from on-chain contract"""
    try:
        # Get top users from blockchain
        top_addresses = await BlockchainService.get_top_users(limit)
        
        result = []
        for i, address in enumerate(top_addresses):
            # Get user stats from blockchain
            stats = await BlockchainService.get_user_stats(address)
            if stats and stats["exists"]:
                # Find user in database if possible
                user = await db.users.find_one({"wallet_address": address})
                user_id = user["id"] if user else None
                
                # Get user badges if possible
                badges_count = 0
                highest_badge_level = 0
                if user_id:
                    badges = await db.badges.find({"user_id": user_id}).to_list(100)
                    badges_count = len(badges)
                    highest_badge_level = max([b.get("level", 0) for b in badges]) if badges else 0
                
                result.append({
                    "rank": i + 1,
                    "user_id": user_id,
                    "username": stats["username"],
                    "wallet_address": address,
                    "submission_count": stats["submission_count"],
                    "average_score": round(stats["total_score"] / max(stats["submission_count"], 1), 2),
                    "wins": stats["win_count"],
                    "reputation_score": stats["reputation_score"],
                    "chain": stats["chain"],
                    "badges_count": badges_count,
                    "highest_badge_level": highest_badge_level
                })
        
        return result
    except Exception as e:
        logging.error(f"Failed to get on-chain leaderboard: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get on-chain leaderboard: {str(e)}")

# AI Evaluation Route
@api_router.post("/evaluate")
async def evaluate_code(code: str = Body(...), challenge_type: str = Body(...)):
    """
    Evaluate smart contract code using the mock AI system
    """
    evaluation = evaluate_contract(code, challenge_type)
    return evaluation

# Badge award helper function
async def check_and_award_badges(user, challenge, score):
    """Check if user deserves a badge based on their performance"""
    user_id = user["id"]
    wallet_address = user["wallet_address"]
    
    # Get user's submissions
    submissions = await db.submissions.find({"user_id": user_id}).to_list(1000)
    win_count = len([s for s in submissions if s.get("is_winner", False)])
    
    # Get user's badges
    badges = await db.badges.find({"user_id": user_id}).to_list(100)
    
    # Check for challenge type specific badges
    if challenge.challenge_type == "gas_optimization":
        # Check for Gas Optimizer badge
        gas_wins = len([s for s in submissions if s.get("is_winner", False) and 
                        db.challenges.find_one({"id": s["challenge_id"]})["challenge_type"] == "gas_optimization"])
        
        # Badge level requirements
        level_requirements = [1, 3, 10, 25, 50]
        
        # Find existing badge
        gas_optimizer_badge = next((b for b in badges if b["badge_type"] == "gas_optimizer"), None)
        
        if gas_optimizer_badge:
            # Check if user qualifies for level up
            current_level = gas_optimizer_badge["level"]
            if current_level < 5 and gas_wins >= level_requirements[current_level]:
                # Level up badge
                await level_up_badge(gas_optimizer_badge["id"])
        elif gas_wins >= level_requirements[0]:
            # Create new badge
            badge = BadgeCreate(
                user_id=user_id,
                badge_type="gas_optimizer",
                level=1,
                description="Gas Optimization Expert",
                image_url="https://api.chainrivals.com/badges/images/gas_optimizer.png"
            )
            await create_badge(badge)
    
    elif challenge.challenge_type == "security_exploit":
        # Check for Security Expert badge
        security_wins = len([s for s in submissions if s.get("is_winner", False) and 
                            db.challenges.find_one({"id": s["challenge_id"]})["challenge_type"] == "security_exploit"])
        
        # Badge level requirements
        level_requirements = [1, 3, 10, 25, 50]
        
        # Find existing badge
        security_expert_badge = next((b for b in badges if b["badge_type"] == "security_expert"), None)
        
        if security_expert_badge:
            # Check if user qualifies for level up
            current_level = security_expert_badge["level"]
            if current_level < 5 and security_wins >= level_requirements[current_level]:
                # Level up badge
                await level_up_badge(security_expert_badge["id"])
        elif security_wins >= level_requirements[0]:
            # Create new badge
            badge = BadgeCreate(
                user_id=user_id,
                badge_type="security_expert",
                level=1,
                description="Security Exploit Expert",
                image_url="https://api.chainrivals.com/badges/images/security_expert.png"
            )
            await create_badge(badge)
    
    # Check for Top Contributor badge based on total submissions
    total_submissions = len(submissions)
    level_requirements = [5, 20, 50, 100, 200]
    
    top_contributor_badge = next((b for b in badges if b["badge_type"] == "top_contributor"), None)
    
    if top_contributor_badge:
        # Check if user qualifies for level up
        current_level = top_contributor_badge["level"]
        if current_level < 5 and total_submissions >= level_requirements[current_level]:
            # Level up badge
            await level_up_badge(top_contributor_badge["id"])
    elif total_submissions >= level_requirements[0]:
        # Create new badge
        badge = BadgeCreate(
            user_id=user_id,
            badge_type="top_contributor",
            level=1,
            description="Top Contributor",
            image_url="https://api.chainrivals.com/badges/images/top_contributor.png"
        )
        await create_badge(badge)
    
    # Check for Challenge Master badge based on total wins
    level_requirements = [3, 10, 25, 50, 100]
    
    challenge_master_badge = next((b for b in badges if b["badge_type"] == "challenge_master"), None)
    
    if challenge_master_badge:
        # Check if user qualifies for level up
        current_level = challenge_master_badge["level"]
        if current_level < 5 and win_count >= level_requirements[current_level]:
            # Level up badge
            await level_up_badge(challenge_master_badge["id"])
    elif win_count >= level_requirements[0]:
        # Create new badge
        badge = BadgeCreate(
            user_id=user_id,
            badge_type="challenge_master",
            level=1,
            description="Challenge Master",
            image_url="https://api.chainrivals.com/badges/images/challenge_master.png"
        )
        await create_badge(badge)
    
    # Check for Avalanche Specialist badge based on Avalanche chain submissions
    avalanche_submissions = [s for s in submissions if 
                             db.challenges.find_one({"id": s["challenge_id"]})["chain"] == "avalanche"]
    avalanche_wins = len([s for s in avalanche_submissions if s.get("is_winner", False)])
    
    level_requirements = [2, 5, 15, 30, 50]
    
    avalanche_specialist_badge = next((b for b in badges if b["badge_type"] == "avalanche_specialist"), None)
    
    if avalanche_specialist_badge:
        # Check if user qualifies for level up
        current_level = avalanche_specialist_badge["level"]
        if current_level < 5 and avalanche_wins >= level_requirements[current_level]:
            # Level up badge
            await level_up_badge(avalanche_specialist_badge["id"])
    elif avalanche_wins >= level_requirements[0]:
        # Create new badge
        badge = BadgeCreate(
            user_id=user_id,
            badge_type="avalanche_specialist",
            level=1,
            description="Avalanche Specialist",
            image_url="https://api.chainrivals.com/badges/images/avalanche_specialist.png"
        )
        await create_badge(badge)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
