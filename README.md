# AuraCafe Live — Real-Time Sentiment & Guest Rewards Platform

A full-stack, enterprise-grade live hospitality intelligence platform built with **React (Frontend)**, **FastAPI / Python (Backend)**, **Google Gemini 2.5 Flash (AI Sentiment Engine)**, and deployed serverless to **Google Cloud Run**.

---

## 🌟 Key Features

### 1. 🍽️ Table & Guest Session Management
- **Cafe Context:** Dedicated cafe profile (*Aura Artisan Coffee & Kitchen*) with live seating and diner metrics.
- **Table Number & Diner Identification:** Select or create table sessions (Table 1 through Table 12, Window Banquette, Patio Sun Deck, etc.) with names of all dining members.
- **Session Duration Tracking:**
  - **Time In:** Automatic recording of check-in time.
  - **Live Elapsed Duration:** Dynamic counter showing seated minutes.
  - **Time Out & Checkout:** Seal table session, calculate final stay duration, and credit a +50 bonus loyalty point reward to the customer wallet.

### 2. ☕ Items Ordered & Live Feedback
- **Menu Catalog:** Artisanal coffees (Honey Oat Flat White, Kyoto Nitro Cold Brew), specialty teas (Ceremonial Uji Matcha Latte), brunch plates (Truffle Mushroom Sourdough Toast), and fresh bakery items.
- **Per-Item Feedback:**
  - Interactive 1 to 5 star ratings.
  - Sensory tags (e.g., *Silky & Rich*, *Steaming Hot*, *Flaky & Fresh*, *Needs Whisking*, *Lukewarm*).
  - Detailed commentary box with live incentive tracker (`+50 bonus points unlocked at 15+ characters`).

### 3. 🤖 Powered by Google Gemini AI (Vertex AI & Agent Platform)
- **Instant Live Sentiment Analysis (`gemini-2.5-flash`):**
  - High-precision sentiment scoring (`-1.0` to `+1.0`) and categorization (*Delightful*, *Positive*, *Neutral*, *Needs Attention*, *Critical*).
  - Nuanced emotional & sensory tags extraction (e.g. `["Flaky", "Aromatic", "Velvety"]`).
  - Barista & Kitchen Alert generation for critical complaints (e.g. lukewarm milk, clumpy matcha powder).
- **Gemini Shift Intelligence:**
  - Generates comprehensive shift briefs summarizing overall cafe vibe, top praised items, dishes to watch, and actionable floor/barista advice.
- **Ask Gemini Assistant:**
  - Natural language chat drawer answering barista/manager questions regarding live customer sentiment, table trends, and operational tips.

### 4. 🪙 Customer Rewards Wallet
- **Dynamic Point Accrual:**
  - `+25 pts` base per item rated.
  - `+50 pts` bonus for thorough written comments.
  - `+15 pts` sensory tags bonus.
  - `+50 pts` table visit checkout bonus.
- **Loyalty Tiers:** Bronze (0+), Silver (150+), Gold (300+), VIP Club (500+).
- **Rewards Redemption Shop:** Redeem perks (Free Double Espresso, Fresh Pastry, Signature Beverage, $10 off bill) with instant deduction and celebratory confetti!
- **Audited Ledger:** Transparent transaction history of earnings and redemptions.

### 5. 📊 Live Cafe Command Center (Staff & Manager)
- Net Sentiment Score & Delight % live gauges.
- Real-time kitchen alert stream with one-click resolution.
- Live active table grid and dish sentiment leaderboard.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Lucide Icons, Canvas Confetti, Google Fonts (*Outfit* & *Inter*), CSS Design System (Warm Espresso Dark Mode & Crema Gold accents).
- **Backend:** Python 3.12+, FastAPI, Uvicorn, Pydantic.
- **AI / LLM:** Google GenAI SDK (`google-genai`), Vertex AI `gemini-2.5-flash`.
- **Infrastructure:** Docker multi-stage build, Google Cloud Run, Google Artifact Registry.

---

## 🚀 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rakredv/gc-builder-pop.git
   cd gc-builder-pop
   ```

2. **Set up Python Virtual Environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Install Frontend Dependencies & Build:**
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

4. **Run Server:**
   ```bash
   python run.py
   ```
   Open your browser at `http://localhost:8080`.

---

## ☁️ Deploying to Google Cloud Run

Deploy directly from source using the Google Cloud CLI:
```bash
gcloud run deploy aura-cafe-sentiment \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --project YOUR_PROJECT_ID \
  --set-env-vars GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID,GOOGLE_CLOUD_LOCATION=us-central1
```
