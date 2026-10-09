# TaskFlow — FastAPI & Supabase Backend

This is the backend service for **TaskFlow**, built with Python FastAPI and designed to integrate directly with Supabase PostgreSQL.

---

## 1. Setup Instructions

### Prerequisites
- Python 3.10+
- A [Supabase](https://supabase.com/) project

### 1.1 Virtual Environment & Installation
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Linux / macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 1.2 Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your Supabase credentials:
```ini
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
PORT=8000
```

---

## 2. Supabase PostgreSQL Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Development policy: Allow full CRUD operations
CREATE POLICY "Allow full access to tasks"
ON public.tasks
FOR ALL
USING (true)
WITH CHECK (true);
```

---

## 3. Running the Server

Start the development server with hot reload:
```bash
uvicorn app.main:app --reload --port 8000
```

API documentation will be accessible at:
- Interactive Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 4. API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks` or `/api/tasks` | List all tasks |
| `POST` | `/tasks` or `/api/tasks` | Create a new task |
| `PATCH` | `/tasks/{task_id}` or `/api/tasks/{task_id}` | Update task (completion, title, priority, due date) |
| `DELETE` | `/tasks/{task_id}` or `/api/tasks/{task_id}` | Delete task permanently |
| `GET` | `/` | API health check |
