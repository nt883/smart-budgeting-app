# [ledger] — Smart Budgeting App

A full-stack personal budgeting app that tracks income and expenses, enforces category budgets, generates plain-language spending insights, tracks savings goals, and helps you plan a shopping trip against a budget.

## Tech Stack

**Frontend**
- React + Vite
- React Router (client-side routing)
- Axios (API requests)
- Recharts (dashboard charts)
- Papaparse (CSV preview parsing)
- lucide-react (icons)
- Plain CSS with a shared design-token system — no CSS framework

**Backend**
- FastAPI
- SQLAlchemy + PostgreSQL
- JWT authentication
- Pandas (CSV bulk import parsing)

## Features

### Core
- Email/password signup and login
- Add, edit, delete transactions
- Bulk CSV import
- Category selection via a shared dropdown, keeping spending grouped consistently
- Monthly category budgets with spend-vs-limit tracking
- Dashboard with income/expense/net balance summary and a spend-by-category chart

### Smart Insights
- Automatic month-over-month spending trends
- End-of-month spend forecasting
- Unusual transaction flagging
- Personalized savings suggestions

### Goals
- Create savings goals with a target amount and date
- Track progress toward each goal
- "Can I afford this?" check based on current spending pace
- 
### Account
- Settings page for session and account management

## Project Structure

```
smart-budgeting-app/
├── backend/
│   └── app/
│       ├── main.py
│       ├── routers/        # auth, transactions, budgets, dashboard, insights, goals, shopping
│       └── models/
│
└── budgeting-app-frontend/
    └── src/
        ├── api/
        ├── components/
        ├── constants/
        ├── context/
        ├── pages/
        └── index.css
```

## Git Workflow

- `main` — stable, production
- `dev` — integration branch
- `frontend` / `backend` — active feature branches

Work happens on individual branches, merges into `dev` for integration testing, then into `main` once stable.

## Status

Deployed at https://ledger-kxy6.onrender.com/
