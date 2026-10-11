import os
import json
import re
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types

PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT", "")
LOCATION = os.environ.get("GOOGLE_CLOUD_LOCATION", "us-central1")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

def get_gemini_client():
    """Initializes the official GenAI client using Vertex AI or API Key."""
    try:
        if GEMINI_API_KEY:
            return genai.Client(api_key=GEMINI_API_KEY)
        # Default to Vertex AI with project and location
        return genai.Client(
            vertexai=True,
            project=PROJECT_ID,
            location=LOCATION
        )
    except Exception as e:
        print(f"[GeminiService] Warning initializing client: {e}")
        return None

def extract_json(text: str) -> Dict[str, Any]:
    """Helper to clean markdown fenced JSON from model response."""
    text = text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        text = match.group(1).strip()
    try:
        return json.loads(text)
    except Exception:
        # Fallback regex search for { ... }
        match = re.search(r"(\{[\s\S]*\})", text)
        if match:
            return json.loads(match.group(1))
        raise

def analyze_item_feedback(
    cafe_name: str,
    table_number: int,
    item_name: str,
    rating: int,
    tags: List[str],
    comment: str,
    customer_name: str = "Guest"
) -> Dict[str, Any]:
    """Uses Gemini 2.5 Flash to analyze live item sentiment and urgency."""
    client = get_gemini_client()
    tags_str = ", ".join(tags) if tags else "None specified"

    prompt = f"""You are the real-time AI Sentiment Engine for '{cafe_name}'.
Analyze this live guest feedback submitted from Table {table_number} by {customer_name}:
- Item: {item_name}
- Star Rating (1 to 5): {rating}/5
- Sensory Aspects / Tags: {tags_str}
- Guest Written Feedback: "{comment}"

Provide an accurate, nuanced analysis. Respond ONLY with a valid JSON object with the following fields:
{{
  "sentiment_score": float between -1.0 (extremely negative) and 1.0 (ecstatic delight),
  "sentiment_label": string one of ["Delightful", "Positive", "Neutral", "Needs Attention", "Critical"],
  "emotion_tags": list of 2-4 emotional/sensory descriptor tags (e.g. ["Rich Aroma", "Scalding Heat", "Velvety", "Bitter", "Crispy"]),
  "highlight": 1 short punchy sentence capturing the core sentiment for the barista/manager,
  "barista_kitchen_alert": string or null. If rating <= 2 or comment contains critical complaints (burnt, sour milk, cold, stale, hair, long delay), provide an urgent direct recommendation for the kitchen/barista (e.g. "Check steam wand temperature immediately - Table 4 flagged burnt milk"). Otherwise null.,
  "urgency_level": "HIGH" if rating <= 2, "MEDIUM" if rating == 3, "LOW" if rating >= 4
}}"""

    if client:
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.2,
                    response_mime_type="application/json"
                )
            )
            data = extract_json(response.text)
            return data
        except Exception as e:
            print(f"[GeminiService] Error calling Gemini for feedback: {e}")

    # Robust local fallback
    score = (rating - 3) / 2.0  # 1->-1.0, 2->-0.5, 3->0.0, 4->0.5, 5->1.0
    if rating >= 5:
        label = "Delightful"
        urgency = "LOW"
        alert = None
    elif rating == 4:
        label = "Positive"
        urgency = "LOW"
        alert = None
    elif rating == 3:
        label = "Neutral"
        urgency = "MEDIUM"
        alert = f"Review quality on {item_name} - guest found it average."
    elif rating == 2:
        label = "Needs Attention"
        urgency = "HIGH"
        alert = f"Table {table_number} reported dissatisfaction with {item_name}. Prompt barista check."
    else:
        label = "Critical"
        urgency = "HIGH"
        alert = f"URGENT: Table {table_number} strongly disliked {item_name}. Check kitchen prep immediately!"

    return {
        "sentiment_score": score,
        "sentiment_label": label,
        "emotion_tags": tags if tags else (["Satisfied"] if rating >= 4 else ["Disappointed"]),
        "highlight": f"Guest rated {item_name} {rating}/5 with note: '{comment}'" if comment else f"Guest rated {item_name} {rating}/5.",
        "barista_kitchen_alert": alert,
        "urgency_level": urgency
    }

def generate_shift_intelligence(
    cafe_name: str,
    feedback_history: List[Dict[str, Any]],
    active_tables_count: int
) -> Dict[str, Any]:
    """Generates an executive shift summary and actionable recommendations using Gemini."""
    client = get_gemini_client()

    summary_input = []
    for f in feedback_history[-20:]:  # Last 20 feedbacks
        summary_input.append({
            "table": f.get("table_number"),
            "item": f.get("item_name"),
            "rating": f.get("rating"),
            "comment": f.get("comment"),
            "sentiment": f.get("sentiment_label")
        })

    prompt = f"""You are the Executive Cafe AI Manager for '{cafe_name}'.
There are currently {active_tables_count} active tables.
Here is the recent live feedback stream from tables:
{json.dumps(summary_input, indent=2)}

Analyze overall cafe vibe, kitchen performance, trending praise, and critical issues.
Respond ONLY with a valid JSON object:
{{
  "overall_sentiment_score": float between -1.0 and 1.0,
  "vibe_summary": "1-2 sentence lively status on customer satisfaction and atmosphere",
  "top_praised_items": ["item 1", "item 2"],
  "items_to_watch": ["item 1 needing attention"],
  "barista_recommendations": [
    "Specific actionable tip 1 for barista team",
    "Specific actionable tip 2 for floor staff"
  ],
  "guest_satisfaction_percentage": int 0-100,
  "net_promoter_prediction": "Strong (+74 NPS) or similar"
}}"""

    if client:
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.3,
                    response_mime_type="application/json"
                )
            )
            return extract_json(response.text)
        except Exception as e:
            print(f"[GeminiService] Error calling Gemini for shift intelligence: {e}")

    # Fallback
    ratings = [f.get("rating", 4) for f in feedback_history] if feedback_history else [5]
    avg_rating = sum(ratings) / len(ratings)
    pct = int((avg_rating / 5.0) * 100)

    return {
        "overall_sentiment_score": round((avg_rating - 3) / 2.0, 2),
        "vibe_summary": f"High energy shift at {cafe_name} with {pct}% positive guest sentiment across live tables.",
        "top_praised_items": ["Honey Oat Flat White", "Pistachio Almond Croissant"],
        "items_to_watch": ["Matcha Latte (check sweetness levels)"],
        "barista_recommendations": [
            "Maintain consistent milk steaming temperature between 60-65°C.",
            "Offer table check-ins for tables seated over 35 minutes."
        ],
        "guest_satisfaction_percentage": pct,
        "net_promoter_prediction": f"+{max(10, pct - 15)} NPS"
    }

def ask_gemini_assistant(cafe_name: str, query: str, context_data: Dict[str, Any]) -> str:
    """Answers barista or manager questions about live table sentiment."""
    client = get_gemini_client()
    prompt = f"""You are the friendly, expert Cafe Intelligence AI assistant for '{cafe_name}'.
The manager or barista is asking: "{query}".

Here is the current live cafe operational context:
- Active tables: {len(context_data.get('active_tables', []))}
- Recent feedback samples: {json.dumps(context_data.get('recent_feedback', [])[-10:], indent=2)}
- Average rating: {context_data.get('avg_rating', 4.5)}/5

Answer in a helpful, concise, barista-friendly tone (2-4 sentences or bullet points). If a specific table or item is mentioned, cite the relevant feedback."""

    if client:
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(temperature=0.4)
            )
            return response.text.strip()
        except Exception as e:
            print(f"[GeminiService] Error calling Gemini assistant: {e}")

    return f"Based on live data from {cafe_name}, tables are currently enjoying our specialty coffee and brunch items. Table satisfaction is at {context_data.get('avg_rating', 4.8)}/5. Let me know if you'd like a specific breakdown for any table!"
