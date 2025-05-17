from fastapi import FastAPI, APIRouter, HTTPException, Depends, Body
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from web3 import Web3
import json

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

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    wallet_address: str
    username: Optional[str] = None
    avatar: Optional[str] = None
    reputation_score: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    wallet_address: str
    username: Optional[str] = None
    avatar: Optional[str] = None

class Challenge(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    challenge_type: str  # "gas_optimization" or "security_exploit"
    difficulty: str  # "beginner", "intermediate", "advanced"
    initial_code: str
    test_cases: List[Dict[str, Any]]
    reward: float
    chain: str  # "avalanche", "celo", "polygon", etc.
    created_at: datetime = Field(default_factory=datetime.utcnow)
    ends_at: Optional[datetime] = None
    is_active: bool = True

class ChallengeCreate(BaseModel):
    title: str
    description: str
    challenge_type: str
    difficulty: str
    initial_code: str
    test_cases: List[Dict[str, Any]]
    reward: float
    chain: str
    ends_at: Optional[datetime] = None

class Submission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    challenge_id: str
    user_id: str
    code: str
    score: Optional[float] = None
    feedback: Optional[str] = None
    transaction_hash: Optional[str] = None
    is_winner: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SubmissionCreate(BaseModel):
    challenge_id: str
    user_id: str
    code: str

class AIFeedback(BaseModel):
    gas_score: float
    security_score: float
    feedback: str
    recommendations: List[str]

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
        return {
            "status": "connected",
            "network": "Avalanche Fuji Testnet",
            "block_number": block_number
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
    
    return User(**user)

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
async def get_leaderboard():
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
    
    leaderboard_data = await db.submissions.aggregate(pipeline).to_list(20)
    
    # Get user details for each entry
    result = []
    for entry in leaderboard_data:
        user = await db.users.find_one({"id": entry["_id"]})
        if user:
            result.append({
                "user_id": entry["_id"],
                "username": user.get("username", "Anonymous"),
                "wallet_address": user["wallet_address"],
                "submission_count": entry["submission_count"],
                "average_score": round(entry["average_score"], 2),
                "wins": entry["wins"],
                "reputation_score": user.get("reputation_score", 0)
            })
    
    return result

# AI Evaluation Route
@api_router.post("/evaluate")
async def evaluate_code(code: str = Body(...), challenge_type: str = Body(...)):
    """
    Evaluate smart contract code using the mock AI system
    """
    evaluation = evaluate_contract(code, challenge_type)
    return evaluation

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
