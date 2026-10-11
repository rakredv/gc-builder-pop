import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from .models import MenuItem, OrderItem, TableSession, Wallet, WalletTransaction

# Catalog of cafe menu items
MENU_ITEMS = [
    MenuItem(
        id="item-1",
        name="Honey Oat Flat White",
        category="Espresso & Coffee",
        price=5.75,
        description="Double ristretto shot, velvety steamed oat milk, wildflower honey drizzle",
        image_url="☕"
    ),
    MenuItem(
        id="item-2",
        name="Kyoto Style Nitro Cold Brew",
        category="Espresso & Coffee",
        price=6.25,
        description="16-hour slow drip Ethiopian Yirgacheffe infused with creamy micro-nitrogen",
        image_url="🧊"
    ),
    MenuItem(
        id="item-3",
        name="Ceremonial Iced Matcha Latte",
        category="Specialty Matcha & Tea",
        price=6.50,
        description="First-harvest Uji matcha whisked fresh, organic Madagascar vanilla, almond milk",
        image_url="🍵"
    ),
    MenuItem(
        id="item-4",
        name="Truffle Mushroom Sourdough Toast",
        category="Brunch & Artisan Bites",
        price=14.50,
        description="Charred country sourdough, sautéed wild mushrooms, white truffle oil, poached egg",
        image_url="🍞"
    ),
    MenuItem(
        id="item-5",
        name="Avocado & Heirloom Bruschetta",
        category="Brunch & Artisan Bites",
        price=12.75,
        description="Whipped Haas avocado, marinated heirloom cherry tomatoes, basil oil, za'atar crunch",
        image_url="🥑"
    ),
    MenuItem(
        id="item-6",
        name="Warm Pistachio Cardamom Croissant",
        category="Fresh Bakery & Pastries",
        price=5.95,
        description="Twice-baked flaky butter croissant, Sicilian pistachio frangipane, crushed rose petals",
        image_url="🥐"
    ),
    MenuItem(
        id="item-7",
        name="Açai Berry Superfood Bowl",
        category="Refreshing Bowls",
        price=11.50,
        description="Organic pure açai, banana purée, house maple granola, dragonfruit, cacao nibs",
        image_url="🍓"
    ),
    MenuItem(
        id="item-8",
        name="Spiced Chai Spelt Scone",
        category="Fresh Bakery & Pastries",
        price=4.50,
        description="Stoneground spelt flour, ginger-cinnamon glaze, whipped clotted Devon cream",
        image_url="🧁"
    )
]

REWARDS_CATALOG = [
    {
        "id": "rew-1",
        "title": "Complimentary Double Espresso",
        "cost": 60,
        "description": "Any single origin or house blend shot on the house.",
        "icon": "☕"
    },
    {
        "id": "rew-2",
        "title": "Fresh Artisan Bakery Item",
        "cost": 100,
        "description": "Choice of croissant, scone, or daily fresh pastry.",
        "icon": "🥐"
    },
    {
        "id": "rew-3",
        "title": "Signature Specialty Beverage",
        "cost": 150,
        "description": "Nitro Cold Brew or Ceremonial Matcha Latte on us.",
        "icon": "🍵"
    },
    {
        "id": "rew-4",
        "title": "$10 Off Total Table Bill",
        "cost": 250,
        "description": "Instant $10 credit applied to your current or next cafe checkout.",
        "icon": "🎟️"
    }
]

class CafeStorage:
    def __init__(self):
        self.cafe_id = "cafe-aura"
        self.cafe_name = "Aura Artisan Coffee & Kitchen"
        self.cafe_address = "742 Magnolia Blvd, Arts District"
        self.menu_items: Dict[str, MenuItem] = {item.id: item for item in MENU_ITEMS}
        self.sessions: Dict[str, TableSession] = {}
        self.wallets: Dict[str, Wallet] = {}
        self.feedback_history: List[Dict[str, Any]] = []
        self.alerts: List[Dict[str, Any]] = []
        self._init_seed_data()

    def _init_seed_data(self):
        now = datetime.now()

        # Seed Customer 1: Sarah Jenkins (Table 4)
        c1_id = "cust-sarah"
        w1 = Wallet(
            customer_id=c1_id,
            customer_name="Sarah Jenkins",
            balance=185,
            tier="Silver",
            transactions=[
                WalletTransaction(
                    id=str(uuid.uuid4())[:8],
                    timestamp=(now - timedelta(days=2)).strftime("%b %d, %H:%M"),
                    type="EARNED",
                    amount=50,
                    description="Feedback reward for Truffle Mushroom Toast",
                    item_name="Truffle Mushroom Sourdough Toast"
                ),
                WalletTransaction(
                    id=str(uuid.uuid4())[:8],
                    timestamp=(now - timedelta(days=2)).strftime("%b %d, %H:%M"),
                    type="BONUS",
                    amount=25,
                    description="Detailed feedback bonus",
                    item_name="Honey Oat Flat White"
                ),
                WalletTransaction(
                    id=str(uuid.uuid4())[:8],
                    timestamp=(now - timedelta(days=1)).strftime("%b %d, %H:%M"),
                    type="EARNED",
                    amount=110,
                    description="Visit checkout bonus points"
                )
            ]
        )
        self.wallets[c1_id] = w1

        # Seed Session 1: Table 4 (Active, 3 members)
        s1_time_in = (now - timedelta(minutes=38)).strftime("%H:%M")
        s1 = TableSession(
            id="session-tbl-4",
            cafe_id=self.cafe_id,
            table_number=4,
            table_label="Table 4 (Window Banquette)",
            members=["Sarah Jenkins", "Liam Vance", "Elena Rostova"],
            time_in=s1_time_in,
            time_out=None,
            is_active=True,
            wallet_id=c1_id,
            customer_name="Sarah Jenkins",
            total_bill=32.95,
            items_ordered=[
                OrderItem(
                    item_id="item-1",
                    name="Honey Oat Flat White",
                    category="Espresso & Coffee",
                    price=5.75,
                    quantity=2,
                    feedback_submitted=True,
                    rating=5,
                    feedback_text="Silky smooth oat milk and wonderful honey notes. Gorgeous swan latte art!",
                    sentiment={
                        "sentiment_score": 0.95,
                        "sentiment_label": "Delightful",
                        "emotion_tags": ["Silky", "Honey Notes", "Latte Art"],
                        "highlight": "Guest loved the silky texture and latte art presentation.",
                        "urgency_level": "LOW",
                        "barista_kitchen_alert": None
                    }
                ),
                OrderItem(
                    item_id="item-4",
                    name="Truffle Mushroom Sourdough Toast",
                    category="Brunch & Artisan Bites",
                    price=14.50,
                    quantity=1,
                    feedback_submitted=True,
                    rating=4,
                    feedback_text="Mushrooms were seasoned to perfection! Bread crust was slightly tough to cut.",
                    sentiment={
                        "sentiment_score": 0.6,
                        "sentiment_label": "Positive",
                        "emotion_tags": ["Savory", "Truffle Aroma", "Crust Tough"],
                        "highlight": "Great seasoning; note regarding slightly tough crust.",
                        "urgency_level": "LOW",
                        "barista_kitchen_alert": None
                    }
                ),
                OrderItem(
                    item_id="item-6",
                    name="Warm Pistachio Cardamom Croissant",
                    category="Fresh Bakery & Pastries",
                    price=5.95,
                    quantity=1,
                    feedback_submitted=False
                )
            ]
        )
        self.sessions[s1.id] = s1

        # Add seed feedback history for table 4
        self.feedback_history.append({
            "id": "fb-1",
            "session_id": s1.id,
            "table_number": 4,
            "item_name": "Honey Oat Flat White",
            "rating": 5,
            "comment": "Silky smooth oat milk and wonderful honey notes. Gorgeous swan latte art!",
            "tags": ["Rich & Smooth", "Steaming Hot", "Beautiful Art"],
            "sentiment_score": 0.95,
            "sentiment_label": "Delightful",
            "timestamp": (now - timedelta(minutes=25)).strftime("%H:%M")
        })
        self.feedback_history.append({
            "id": "fb-2",
            "session_id": s1.id,
            "table_number": 4,
            "item_name": "Truffle Mushroom Sourdough Toast",
            "rating": 4,
            "comment": "Mushrooms were seasoned to perfection! Bread crust was slightly tough to cut.",
            "tags": ["Savory", "Freshly Prepared"],
            "sentiment_score": 0.6,
            "sentiment_label": "Positive",
            "timestamp": (now - timedelta(minutes=15)).strftime("%H:%M")
        })

        # Seed Customer 2: Marcus Chen (Table 2)
        c2_id = "cust-marcus"
        w2 = Wallet(
            customer_id=c2_id,
            customer_name="Marcus Chen",
            balance=95,
            tier="Bronze",
            transactions=[]
        )
        self.wallets[c2_id] = w2

        # Seed Session 2: Table 2 (Active, 2 members)
        s2_time_in = (now - timedelta(minutes=18)).strftime("%H:%M")
        s2 = TableSession(
            id="session-tbl-2",
            cafe_id=self.cafe_id,
            table_number=2,
            table_label="Table 2 (Patio Sun Deck)",
            members=["Marcus Chen", "David Kim"],
            time_in=s2_time_in,
            time_out=None,
            is_active=True,
            wallet_id=c2_id,
            customer_name="Marcus Chen",
            total_bill=18.00,
            items_ordered=[
                OrderItem(
                    item_id="item-2",
                    name="Kyoto Style Nitro Cold Brew",
                    category="Espresso & Coffee",
                    price=6.25,
                    quantity=1,
                    feedback_submitted=True,
                    rating=5,
                    feedback_text="Phenomenal cascade and chocolate notes. Best cold brew in the neighborhood.",
                    sentiment={
                        "sentiment_score": 0.98,
                        "sentiment_label": "Delightful",
                        "emotion_tags": ["Crisp Cascade", "Velvety", "Deep Cacao"],
                        "highlight": "Called it the best cold brew in the neighborhood.",
                        "urgency_level": "LOW",
                        "barista_kitchen_alert": None
                    }
                ),
                OrderItem(
                    item_id="item-3",
                    name="Ceremonial Iced Matcha Latte",
                    category="Specialty Matcha & Tea",
                    price=6.50,
                    quantity=1,
                    feedback_submitted=True,
                    rating=2,
                    feedback_text="Felt a bit clumped at the bottom and a bit lukewarm instead of iced.",
                    sentiment={
                        "sentiment_score": -0.5,
                        "sentiment_label": "Needs Attention",
                        "emotion_tags": ["Clumpy", "Lukewarm", "Needs Whisking"],
                        "highlight": "Matcha powder clumped and drink was lukewarm.",
                        "urgency_level": "HIGH",
                        "barista_kitchen_alert": "Table 2: Whisk ceremonial matcha thoroughly with chasen whisk & add fresh ice."
                    }
                )
            ]
        )
        self.sessions[s2.id] = s2

        self.feedback_history.append({
            "id": "fb-3",
            "session_id": s2.id,
            "table_number": 2,
            "item_name": "Kyoto Style Nitro Cold Brew",
            "rating": 5,
            "comment": "Phenomenal cascade and chocolate notes. Best cold brew in the neighborhood.",
            "tags": ["Velvety Head", "Deep Cacao", "Ice Cold"],
            "sentiment_score": 0.98,
            "sentiment_label": "Delightful",
            "timestamp": (now - timedelta(minutes=12)).strftime("%H:%M")
        })
        self.feedback_history.append({
            "id": "fb-4",
            "session_id": s2.id,
            "table_number": 2,
            "item_name": "Ceremonial Iced Matcha Latte",
            "rating": 2,
            "comment": "Felt a bit clumped at the bottom and a bit lukewarm instead of iced.",
            "tags": ["Clumpy", "Lukewarm"],
            "sentiment_score": -0.5,
            "sentiment_label": "Needs Attention",
            "timestamp": (now - timedelta(minutes=8)).strftime("%H:%M")
        })

        self.alerts.append({
            "id": "alert-1",
            "table_number": 2,
            "item_name": "Ceremonial Iced Matcha Latte",
            "message": "Table 2 flagged clumpy and lukewarm matcha. Check prep whisk & ice levels.",
            "urgency": "HIGH",
            "timestamp": (now - timedelta(minutes=8)).strftime("%H:%M"),
            "resolved": False
        })

    def get_or_create_wallet(self, customer_id: str, customer_name: str) -> Wallet:
        if customer_id not in self.wallets:
            self.wallets[customer_id] = Wallet(
                customer_id=customer_id,
                customer_name=customer_name,
                balance=100,  # 100 welcome points!
                tier="Bronze",
                transactions=[
                    WalletTransaction(
                        id=str(uuid.uuid4())[:8],
                        timestamp=datetime.now().strftime("%b %d, %H:%M"),
                        type="BONUS",
                        amount=100,
                        description="Welcome bonus to Aura Cafe Rewards"
                    )
                ]
            )
        return self.wallets[customer_id]

    def add_wallet_points(self, customer_id: str, amount: int, desc: str, item_name: Optional[str] = None):
        wallet = self.wallets.get(customer_id)
        if not wallet:
            wallet = self.get_or_create_wallet(customer_id, "Guest")
        wallet.balance += amount
        # Update tier
        if wallet.balance >= 500:
            wallet.tier = "VIP Club"
        elif wallet.balance >= 300:
            wallet.tier = "Gold"
        elif wallet.balance >= 150:
            wallet.tier = "Silver"
        else:
            wallet.tier = "Bronze"

        wallet.transactions.insert(0, WalletTransaction(
            id=str(uuid.uuid4())[:8],
            timestamp=datetime.now().strftime("%b %d, %H:%M"),
            type="EARNED",
            amount=amount,
            description=desc,
            item_name=item_name
        ))

    def redeem_reward(self, customer_id: str, cost: int, title: str) -> bool:
        wallet = self.wallets.get(customer_id)
        if not wallet or wallet.balance < cost:
            return False
        wallet.balance -= cost
        wallet.transactions.insert(0, WalletTransaction(
            id=str(uuid.uuid4())[:8],
            timestamp=datetime.now().strftime("%b %d, %H:%M"),
            type="REDEEMED",
            amount=-cost,
            description=f"Redeemed: {title}"
        ))
        return True

storage = CafeStorage()
