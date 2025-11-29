import os
import json
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import get_agent_executor

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

def load_data(filename: str):
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        path = os.path.join(base_dir, "data", filename)
        with open(path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

@app.get("/context")
async def get_context():
    profile = load_data("profile.json")
    investments = load_data("investments.json")
    
    portfolio_value = sum(item["current_value"] for item in investments)
    total_invested = sum(item["invested_amount"] for item in investments)
    
    return {
        "user": profile,
        "portfolio": {
            "current_value": portfolio_value,
            "total_invested": total_invested,
            "holdings": investments
        }
    }

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        agent = get_agent_executor()
        result = agent.invoke({"input": request.message})
        return {"response": result["output"]}
    except Exception as e:
        traceback.print_exc()

    return {"response": response_text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)