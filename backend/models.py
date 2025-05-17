from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime

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
    # Added fields for on-chain data
    onchain_rank: Optional[int] = None
    badges: List[Dict[str, Any]] = []

class UserCreate(BaseModel):
    wallet_address: str
    username: Optional[str] = None
    avatar: Optional[str] = None

class Badge(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    token_id: Optional[int] = None  # On-chain NFT token ID
    user_id: str  # Owner of the badge
    badge_type: str  # "gas_optimizer", "security_expert", etc.
    level: int  # 1-5
    description: str
    image_url: str
    transaction_hash: Optional[str] = None  # Transaction hash from minting
    created_at: datetime = Field(default_factory=datetime.utcnow)
    metadata_uri: Optional[str] = None  # URI for badge metadata
    is_onchain: bool = False  # Whether the badge exists on-chain

class BadgeCreate(BaseModel):
    user_id: str
    badge_type: str
    level: int
    description: str
    image_url: str

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
    # Added field for on-chain verification
    onchain_verification: Optional[str] = None

class SubmissionCreate(BaseModel):
    challenge_id: str
    user_id: str
    code: str

class AIFeedback(BaseModel):
    gas_score: float
    security_score: float
    feedback: str
    recommendations: List[str]

class LeaderboardEntry(BaseModel):
    user_id: str
    username: str
    wallet_address: str
    submission_count: int
    average_score: float
    wins: int
    reputation_score: int
    chain: str
    # Added fields for on-chain data
    onchain_rank: Optional[int] = None
    badges_count: int = 0
    highest_badge_level: int = 0
