# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (React)
```bash
npm start        # dev server on localhost:3000
npm test         # run tests (interactive watch mode)
npm test -- --watchAll=false  # run tests once (CI mode)
npm run build    # production build
```

### Backend (FastAPI)
```bash
cd api
uvicorn main:app --reload   # dev server on localhost:8000
```

The backend requires a running PostgreSQL instance. Connection string is in `api/.env` as `DATABASE_URL`. Schema is managed via **Alembic** migrations (not `create_all`). To apply migrations:
```bash
cd api
alembic upgrade head
```

## Architecture

This is a full-stack investment advisor app: a **React frontend** (`src/`) and a **FastAPI backend** (`api/`) that run independently on ports 3000 and 8000.

### Frontend

Built with Create React App + [Material Kit 2 React](https://www.creative-tim.com/product/material-kit-react) (a MUI-based component library). The `MK*` components in `src/components/` are the design system primitives (MKBox, MKButton, MKTypography, etc.). Custom UI is built using these rather than raw MUI components.

Routing is defined in `src/routes.js` and rendered in `src/App.js`. The main feature is the **Investment Advisor flow** at `/services/investment-advisor`, which is a 3-step wizard managed by a `step` state in `src/pages/InvestmentAdvisor/index.js`:
1. **Step 1 – UploadCSV**: user uploads a CSV (`TickerSymbol, QuantityHeld, AveragePurchasePrice`) → POST to `/upload-CSV`
2. **Step 2 – Survey**: user answers 4 risk-profile questions (each 1–3) → POST to `/upload-survey`
3. **Step 3 – RecommendationCard**: fires POST to `/recommendations` with `snapshotId` + `surveyId`, renders Gemini's text response

All API calls are hardcoded to `http://localhost:8000`.

### Backend

FastAPI app with async PostgreSQL via the `databases` library. Schema is defined with raw SQLAlchemy `Table` objects in `api/models.py` (not ORM). Two data domains:

- **Investments**: `investment_snapshots` (one per CSV upload) → `investments` (one row per holding, FK to snapshot). On CSV upload, `yahoo_service.py` enriches each ticker with current price, beta, and name via `yfinance`.
- **Surveys**: flat `surveys` table, one row per submission with 4 integer scores.

All endpoints require a valid **Clerk JWT** in the `Authorization: Bearer <token>` header. `api/auth.py` validates tokens against Clerk's JWKS endpoint and returns the `sub` (user ID) as a FastAPI dependency.

Routers:
- `POST /upload-CSV` — parses CSV (max 5 MB), enriches via Yahoo Finance, persists snapshot + investments; **rate-limited to 3/minute**
- `POST /upload-survey` — validates and persists survey answers (Pydantic-validated before write)
- `GET /snapshots/` — list all snapshots (desc)
- `GET /snapshots/{id}` — investments for a snapshot
- `GET /analyze/{snapshot_id}` — runs `analytics_service.compute_portfolio_analytics()` (pandas), returns JSON with total value/P&L, per-stock breakdown, concentration risk, volatility exposure
- `POST /recommendations` — calls `analyze_snapshot()` internally, fetches survey, then sends both to **Gemini 2.5 Pro** (`google-genai` SDK) for a structured narrative + 4 bullet recommendations; **rate-limited to 5/minute**

Rate limiting is implemented via `slowapi` (`api/limiter.py`), keyed by remote IP.

### Environment variables (`api/.env`)
- `DATABASE_URL` — PostgreSQL connection string
- `GEMINI_API_KEY` — Google Gemini API key
- `CLERK_JWKS_URL` — Clerk JWKS endpoint for JWT validation
- `ALLOWED_ORIGINS` — comma-separated list of allowed CORS origins (defaults to `http://localhost:3000,https://localhost:3000`)
