import json
import ollama

with open("plans.json","r") as f:
    plans = json.load(f)

prompt = f"""
You are EON.

Explain these two schedules.

Which user would prefer Option 1?

Which user would prefer Option 2?

Keep it under 150 words.

{json.dumps(plans, indent=2)}
"""

response = ollama.chat(
    model="gemma3:4b",
    messages=[
        {
            "role":"user",
            "content":prompt
        }
    ]
)

print(response["message"]["content"])