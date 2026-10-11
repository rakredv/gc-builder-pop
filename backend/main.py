import os
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from .models import (
    ItemFeedbackRequest,
    RedeemRequest,
    ShiftSummaryRequest,
    AskGeminiRequest,
    TableSession,
    OrderItem
)
from .storage import storage, MENU_ITEMS, REWARDS_CATALOG
from .gemini_service import analyze_item_feedback, generate_shift_intelligence, ask_gemini_assistant

app = FastAPI(
    title="AuraCafe Live Sentiment & Rewards API",
    description="Live table session feedback analysis, Gemini AI intelligence, and customer rewards wallet",
    version="1.0.0"
)

# Enable CORS for local development with Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "project": os.environ.get("GOOGLE_CLOUD_PROJECT", "adk-dev-502909"),
        "active_tables": len([s for s in storage.sessions.values() if s.is_active])
    }

@app.get("/api/cafe")
def get_cafe_info():
    active_sessions = [s for s in storage.sessions.values() if s.is_active]
    return {
        "id": storage.cafe_id,
        "name": storage.cafe_name,
        "address": storage.cafe_address,
        "active_tables_count": len(active_sessions),
        "total_active_diners": sum(len(s.members) for s in active_sessions),
        "total_feedbacks_today": len(storage.feedback_history),
        "rewards_available": len(REWARDS_CATALOG)
    }

@app.get("/api/menu")
def get_menu():
    return list(storage.menu_items.values())

@app.get("/api/rewards")
def get_rewards():
    return REWARDS_CATALOG

@app.get("/api/sessions")
def get_all_sessions():
    return list(storage.sessions.values())

@app.get("/api/sessions/{session_id}")
def get_session(session_id: str):
    session = storage.sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

class StartSessionRequest(BaseModel):
    table_number: int
    table_label: Optional[str] = None
    members: List[str]
    customer_name: str
    customer_id: Optional[str] = None
    initial_items: Optional[List[str]] = []  # List of item IDs

@app.post("/api/sessions/start")
def start_session(req: StartSessionRequest):
    session_id = f"session-tbl-{req.table_number}-{uuid.uuid4().hex[:6]}"
    customer_id = req.customer_id or f"cust-{uuid.uuid4().hex[:6]}"
    now_str = datetime.now().strftime("%H:%M")

    # Order items lookup
    ordered_items: List[OrderItem] = []
    total_bill = 0.0

    if req.initial_items:
        for it_id in req.initial_items:
            menu_item = storage.menu_items.get(it_id)
            if menu_item:
                ordered_items.append(OrderItem(
                    item_id=menu_item.id,
                    name=menu_item.name,
                    category=menu_item.category,
                    price=menu_item.price,
                    quantity=1
                ))
                total_bill += menu_item.price
    else:
        # Default order if none selected
        default_item = storage.menu_items.get("item-1")
        if default_item:
            ordered_items.append(OrderItem(
                item_id=default_item.id,
                name=default_item.name,
                category=default_item.category,
                price=default_item.price,
                quantity=1
            ))
            total_bill += default_item.price

    # Ensure wallet exists
    storage.get_or_create_wallet(customer_id, req.customer_name)

    session = TableSession(
        id=session_id,
        cafe_id=storage.cafe_id,
        table_number=req.table_number,
        table_label=req.table_label or f"Table {req.table_number}",
        members=req.members if req.members else [req.customer_name],
        time_in=now_str,
        time_out=None,
        is_active=True,
        items_ordered=ordered_items,
        wallet_id=customer_id,
        customer_name=req.customer_name,
        total_bill=round(total_bill, 2)
    )

    storage.sessions[session_id] = session
    return session

class AddItemRequest(BaseModel):
    item_id: str
    quantity: int = 1

@app.post("/api/sessions/{session_id}/add-item")
def add_item_to_session(session_id: str, req: AddItemRequest):
    session = storage.sessions.get(session_id)
    if not session or not session.is_active:
        raise HTTPException(status_code=404, detail="Active table session not found")

    menu_item = storage.menu_items.get(req.item_id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    order_item = OrderItem(
        item_id=menu_item.id,
        name=menu_item.name,
        category=menu_item.category,
        price=menu_item.price,
        quantity=req.quantity
    )
    session.items_ordered.append(order_item)
    session.total_bill = round(session.total_bill + (menu_item.price * req.quantity), 2)
    return session

@app.post("/api/sessions/{session_id}/checkout")
def checkout_session(session_id: str):
    session = storage.sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    now_str = datetime.now().strftime("%H:%M")
    session.time_out = now_str
    session.is_active = False

    # Award checkout loyalty bonus to customer wallet
    checkout_bonus = 50
    storage.add_wallet_points(
        customer_id=session.wallet_id,
        amount=checkout_bonus,
        desc=f"Table {session.table_number} visit checkout bonus points"
    )

    wallet = storage.wallets.get(session.wallet_id)
    return {
        "message": f"Table {session.table_number} checked out successfully.",
        "session": session,
        "bonus_points_awarded": checkout_bonus,
        "wallet_balance": wallet.balance if wallet else 0
    }

@app.post("/api/feedback")
def submit_item_feedback(req: ItemFeedbackRequest):
    session = storage.sessions.get(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Locate the ordered item in session
    target_item = None
    for item in session.items_ordered:
        if item.item_id == req.item_id:
            target_item = item
            break

    if not target_item:
        raise HTTPException(status_code=404, detail="Item not found in current table order")

    # Run Gemini AI live sentiment analysis
    sentiment_result = analyze_item_feedback(
        cafe_name=storage.cafe_name,
        table_number=session.table_number,
        item_name=req.item_name,
        rating=req.rating,
        tags=req.tags,
        comment=req.comment,
        customer_name=req.customer_name or session.customer_name
    )

    # Calculate wallet reward points:
    # +25 base points for rating
    # +50 bonus points for helpful written comments (>15 chars)
    # +15 bonus points for selecting sensory aspect tags
    reward_points = 25
    if len(req.comment.strip()) >= 15:
        reward_points += 50
    if req.tags:
        reward_points += 15

    sentiment_result["reward_points_awarded"] = reward_points

    # Update item in session
    target_item.feedback_submitted = True
    target_item.rating = req.rating
    target_item.feedback_text = req.comment
    target_item.sentiment = sentiment_result

    # Deposit reward points to customer wallet
    storage.add_wallet_points(
        customer_id=session.wallet_id,
        amount=reward_points,
        desc=f"Feedback reward for {req.item_name}",
        item_name=req.item_name
    )

    now_str = datetime.now().strftime("%H:%M")
    # Add to feedback history
    fb_record = {
        "id": f"fb-{uuid.uuid4().hex[:6]}",
        "session_id": session.id,
        "table_number": session.table_number,
        "item_name": req.item_name,
        "rating": req.rating,
        "comment": req.comment,
        "tags": req.tags,
        "sentiment_score": sentiment_result.get("sentiment_score", 0.0),
        "sentiment_label": sentiment_result.get("sentiment_label", "Positive"),
        "emotion_tags": sentiment_result.get("emotion_tags", []),
        "timestamp": now_str
    }
    storage.feedback_history.append(fb_record)

    # If critical urgency, trigger real-time barista kitchen alert
    if sentiment_result.get("urgency_level") == "HIGH" or sentiment_result.get("barista_kitchen_alert"):
        alert_msg = sentiment_result.get("barista_kitchen_alert") or f"Table {session.table_number}: Rating {req.rating}/5 on {req.item_name}. Immediate check required."
        storage.alerts.insert(0, {
            "id": f"alert-{uuid.uuid4().hex[:6]}",
            "table_number": session.table_number,
            "item_name": req.item_name,
            "message": alert_msg,
            "urgency": "HIGH",
            "timestamp": now_str,
            "resolved": False
        })

    wallet = storage.wallets.get(session.wallet_id)

    return {
        "status": "success",
        "sentiment": sentiment_result,
        "points_earned": reward_points,
        "wallet_balance": wallet.balance if wallet else 0,
        "wallet_tier": wallet.tier if wallet else "Bronze",
        "updated_item": target_item
    }

@app.get("/api/wallet/{customer_id}")
def get_customer_wallet(customer_id: str):
    wallet = storage.get_or_create_wallet(customer_id, "Guest")
    return wallet

@app.post("/api/wallet/redeem")
def redeem_wallet_reward(req: RedeemRequest):
    success = storage.redeem_reward(
        customer_id=req.customer_id,
        cost=req.cost,
        title=req.reward_title
    )
    if not success:
        raise HTTPException(status_code=400, detail="Insufficient wallet points")

    wallet = storage.wallets.get(req.customer_id)
    return {
        "success": True,
        "message": f"Successfully redeemed '{req.reward_title}'!",
        "new_balance": wallet.balance,
        "transactions": wallet.transactions
    }

@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    active_sessions = [s for s in storage.sessions.values() if s.is_active]
    feedbacks = storage.feedback_history

    if feedbacks:
        avg_rating = round(sum(f["rating"] for f in feedbacks) / len(feedbacks), 1)
        positive_count = sum(1 for f in feedbacks if f["rating"] >= 4)
        sentiment_pct = int((positive_count / len(feedbacks)) * 100)
    else:
        avg_rating = 4.8
        sentiment_pct = 92

    # Calculate item rating rankings
    item_stats: Dict[str, Dict[str, Any]] = {}
    for f in feedbacks:
        name = f["item_name"]
        if name not in item_stats:
            item_stats[name] = {"count": 0, "sum_rating": 0, "ratings": []}
        item_stats[name]["count"] += 1
        item_stats[name]["sum_rating"] += f["rating"]
        item_stats[name]["ratings"].append(f["rating"])

    ranking = []
    for name, st in item_stats.items():
        avg = round(st["sum_rating"] / st["count"], 1)
        ranking.append({
            "item_name": name,
            "average_rating": avg,
            "reviews_count": st["count"],
            "status": "Loved" if avg >= 4.2 else ("Watch" if avg >= 3.0 else "Critical")
        })

    ranking.sort(key=lambda x: x["average_rating"], reverse=True)

    return {
        "active_tables_count": len(active_sessions),
        "total_diners_active": sum(len(s.members) for s in active_sessions),
        "total_feedbacks": len(feedbacks),
        "average_rating": avg_rating,
        "customer_delight_pct": sentiment_pct,
        "active_alerts_count": len([a for a in storage.alerts if not a["resolved"]]),
        "item_rankings": ranking,
        "recent_feedbacks": feedbacks[-12:][::-1]  # reverse to show newest first
    }

@app.get("/api/dashboard/alerts")
def get_alerts():
    return storage.alerts

@app.post("/api/dashboard/alerts/{alert_id}/resolve")
def resolve_alert(alert_id: str):
    for a in storage.alerts:
        if a["id"] == alert_id:
            a["resolved"] = True
            return {"status": "resolved", "alert": a}
    raise HTTPException(status_code=404, detail="Alert not found")

@app.post("/api/ai/shift-summary")
def get_ai_shift_summary(req: ShiftSummaryRequest):
    active_count = len([s for s in storage.sessions.values() if s.is_active])
    summary = generate_shift_intelligence(
        cafe_name=storage.cafe_name,
        feedback_history=storage.feedback_history,
        active_tables_count=active_count
    )
    return summary

@app.post("/api/ai/ask")
def ask_gemini(req: AskGeminiRequest):
    active_sessions = [s for s in storage.sessions.values() if s.is_active]
    avg_rating = 4.6
    if storage.feedback_history:
        avg_rating = round(sum(f["rating"] for f in storage.feedback_history) / len(storage.feedback_history), 1)

    context = {
        "active_tables": [
            {
                "table": s.table_number,
                "label": s.table_label,
                "members": s.members,
                "seated_since": s.time_in,
                "items": [it.name for it in s.items_ordered]
            }
            for s in active_sessions
        ],
        "recent_feedback": storage.feedback_history[-8:],
        "avg_rating": avg_rating
    }

    reply = ask_gemini_assistant(
        cafe_name=storage.cafe_name,
        query=req.query,
        context_data=context
    )
    return {"reply": reply}

@app.post("/api/seed-demo")
def reset_seed_demo():
    storage._init_seed_data()
    return {"message": "Demo shift data loaded with active tables and live reviews!"}

# Mount frontend production build if directory exists
dist_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
if os.path.exists(dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = os.path.join(dist_path, full_path)
        if full_path and os.path.exists(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_path, "index.html"))
