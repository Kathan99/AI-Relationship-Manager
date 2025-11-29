from agent import get_agent_executor
from dotenv import load_dotenv
import traceback

load_dotenv()

try:
    print("Initializing agent...")
    agent = get_agent_executor()
    print("Invoking agent...")
    # Test the agent with a query that requires dynamic reasoning
    result = agent.invoke({"input": "Where should I invest?"})
    print("Result:", result)
except Exception:
    traceback.print_exc()
