import json
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor

load_dotenv()

def load_json(filename: str):
    """Helper to read data safely."""
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        path = os.path.join(base_dir, "data", filename)
        with open(path, "r") as f:
            return json.load(f)
    except Exception as e:
        return {"error": str(e)}

@tool
def get_my_transactions(ignore: str = None):
    """
    Retrieves the user's transaction history. 
    Use for: 'How much did I spend?', 'Show expenses'.
    """
    return load_json("transactions.json")

@tool
def get_my_investments(ignore: str = None):
    """
    Retrieves the user's investment portfolio.
    Use for: 'How is Tata Steel performing?', 'Portfolio value'.
    """
    return load_json("investments.json")

@tool
def get_my_profile(ignore: str = None):
    """
    Retrieves the user's personal profile (Risk Level, Income, Age).
    Use for: Understanding the user's background before giving advice.
    """
    return load_json("profile.json")

@tool
def get_available_products(ignore: str = None):
    """
    Retrieves the catalog of available financial products (Mutual Funds, FDs, etc.).
    Use this to find suitable investments for the user.
    """
    return load_json("products.json")

def get_agent_executor():
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
    tools = [get_my_transactions, get_my_investments, get_my_profile, get_available_products]
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", """
        You are an AI Relationship Manager for a Bank.
        
        YOUR CAPABILITIES:
        1. DATA ACCESS: You can access the User's Transactions, Investments, and Profile.
        2. PRODUCT CATALOG: You can access a list of available financial products using 'get_available_products'.
        
        HOW TO HANDLE REQUESTS:
        - **Investment Advice:** 
          1. ALWAYS fetch the User's Profile (`get_my_profile`) to understand their Risk Level.
          2. Fetch the Product Catalog (`get_available_products`).
          3. REASON: Match products to the user's risk profile. (e.g., If Aggressive, suggest Small Cap/Sectoral funds; if Conservative, suggest FDs/Liquid funds).
          4. RECOMMEND: Present the best matches with a brief explanation of WHY.
        
        - **Financial Insights:**
          - If asked about spending (e.g., "How much did I spend on food?"), use `get_my_transactions` and calculate the total yourself.
          - If asked about portfolio (e.g., "How are my funds doing?"), use `get_my_investments`.
        
        TONE & COMPLIANCE:
        - Be professional, empathetic, and concise.
        - FORMATTING: Use Markdown to make your responses readable.
          - Use **bold** for key terms and numbers.
          - Use lists (bullet points or numbered) for recommendations.
          - Use `code blocks` or tables if presenting structured data.
        - ALWAYS end investment advice with: "(Disclaimer: Market investments are subject to risk. Please read all scheme documents carefully.)"
        """),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])

    agent = create_tool_calling_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
    
    return agent_executor