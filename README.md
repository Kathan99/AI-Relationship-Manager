# AI Relationship Manager

This project is an AI-powered financial assistant designed to help users manage their portfolios, track expenses, and receive personalized investment recommendations. It consists of a FastAPI backend powered by a Groq LLM agent and a React frontend with a modern dashboard interface.

## Project Structure

- **backend/**: Contains the FastAPI application, the LangChain agent logic, and mock data.
- **frontend/**: Contains the React application for the user interface.

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- Node.js and npm
- A Groq API Key

## Setup Instructions

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment:
```bash
python -m venv venv
```

Activate the virtual environment:
- On macOS/Linux:
  ```bash
  source venv/bin/activate
  ```
- On Windows:
  ```bash
  venv\Scripts\activate
  ```

Install the required Python packages:
```bash
pip install -r requirements.txt
```

Create a .env file in the backend directory and add your Groq API key:
```
GROQ_API_KEY=your_api_key_here
```

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install the dependencies:
```bash
npm install
```

## Running the Application

### Start the Backend Server

In the backend directory (with the virtual environment activated), run:
```bash
python -m uvicorn main:app --reload
```

The backend API will be available at http://localhost:8000.

### Start the Frontend Application

In the frontend directory, run:
```bash
npm run dev
```

Open your browser and navigate to the URL shown in the terminal (usually http://localhost:5173).

## Features

- **Interactive Dashboard**: View your risk profile, total portfolio value, and top holdings.
- **AI Chat Interface**: Ask questions about your finances, such as "How much did I spend on food?" or "Where should I invest?".
- **Dynamic Recommendations**: The AI analyzes your risk profile and suggests suitable financial products from a catalog.
- **Data Visualization**: Visual representation of your portfolio holdings.
