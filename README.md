# LLM-Powered Portfolio Advisor

A full-stack fintech application for portfolio analysis and AI-generated investment recommendations. Users can upload portfolio snapshots via CSV, track holdings over time, and receive structured recommendations powered by Gemini 2.5.

## Tech Stack

- **Frontend:** React
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL
- **Market Data:** yfinance
- **AI:** Google Gemini 2.5

## Features

- Upload portfolio snapshots via CSV with versioned storage using unique IDs and timestamps
- Compute portfolio-level metrics across multiple assets
- Fetch real-time market data via yfinance integration
- Generate AI-powered investment recommendations via Gemini 2.5
- Track portfolio performance longitudinally across snapshots
- Structured error handling throughout the stack

## Getting Started

### Prerequisites

- Node.js
- Python 3.8+
- PostgreSQL
- A `.env` file with your API keys (see below)

### Environment Variables

Create a `.env` file in the backend directory with the following:
```
GEMINI_API_KEY=your_key_here
DATABASE_URL=your_postgresql_connection_string
```

### Installation

Clone the repository:
```bash
git clone https://github.com/RoyalAscot1/website
cd website
```

Start the backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Start the frontend:
```bash
cd frontend
npm install
npm start
```

The app will be running at `http://localhost:3000`

## Project Structure
```
website/
├── frontend/       # React application
├── backend/        # FastAPI server
└── README.md
```
