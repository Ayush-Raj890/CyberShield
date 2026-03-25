SCAM_KEYWORDS = [
    "win", "lottery", "prize", "claim",
    "urgent", "click", "verify", "otp",
    "bank", "free", "offer", "link",
    "account", "suspended"
]

def predict_scam(text):
    text = text.lower()

    score = 0

    for word in SCAM_KEYWORDS:
        if word in text:
            score += 1

    if score >= 3:
        return {"label": "MALICIOUS", "confidence": 0.9}
    elif score == 2:
        return {"label": "SUSPICIOUS", "confidence": 0.6}
    else:
        return {"label": "SAFE", "confidence": 0.8}
