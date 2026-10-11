from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class MenuItem(BaseModel):
    id: str
    name: str
    category: str
    price: float
    description: str
    image_url: Optional[str] = None

class OrderItem(BaseModel):
    item_id: str
    name: str
    category: str
    price: float
    quantity: int = 1
    notes: Optional[str] = None
    feedback_submitted: bool = False
    rating: Optional[int] = None
    feedback_text: Optional[str] = None
    sentiment: Optional[Dict[str, Any]] = None

class TableSession(BaseModel):
    id: str
    cafe_id: str
    table_number: int
    table_label: str
    members: List[str]
    time_in: str
    time_out: Optional[str] = None
    is_active: bool = True
    items_ordered: List[OrderItem] = []
    wallet_id: str
    customer_name: str
    total_bill: float = 0.0

class ItemFeedbackRequest(BaseModel):
    session_id: str
    item_id: str
    item_name: str
    rating: int  # 1 to 5
    tags: List[str] = []
    comment: str = ""
    customer_name: Optional[str] = "Guest"

class SentimentAnalysisResult(BaseModel):
    sentiment_score: float  # -1.0 to 1.0
    sentiment_label: str    # "Delightful", "Positive", "Neutral", "Needs Attention", "Critical"
    emotion_tags: List[str]
    highlight: str
    barista_kitchen_alert: Optional[str] = None
    urgency_level: str      # "LOW", "MEDIUM", "HIGH"
    reward_points_awarded: int

class WalletTransaction(BaseModel):
    id: str
    timestamp: str
    type: str  # "EARNED", "REDEEMED", "BONUS"
    amount: int
    description: str
    item_name: Optional[str] = None

class Wallet(BaseModel):
    customer_id: str
    customer_name: str
    balance: int = 0
    tier: str = "Bronze"  # Bronze, Silver, Gold, VIP Club
    transactions: List[WalletTransaction] = []

class RedeemRequest(BaseModel):
    customer_id: str
    reward_id: str
    cost: int
    reward_title: str

class ShiftSummaryRequest(BaseModel):
    cafe_id: str

class AskGeminiRequest(BaseModel):
    cafe_id: str
    query: str
