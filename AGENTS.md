# Student Resource Hub Architecture Rules

This project strictly adheres to a **Backend Proxy** architecture for all backend data interactions.

## Architectural Constraints

1. **Frontend Isolation**: 
   - The React/Vite frontend must call only internal backend proxy endpoints.
   - The browser must never query database tables directly.
   - No frontend code may import a backend database client library directly.

2. **Backend Proxy**:
   - Database access happens *only* through backend proxy services.
   - Proxy services act as a secure bridge between the client and the database.

3. **Secrets Management**:
   - No private backend keys should be bundled into browser code.
   - The frontend may only use `VITE_API_BASE_URL`.
   - Backend secrets must live in `.env.local` for local development and secure environment storage for deployed services.
   - Private database keys must never be exposed to the browser.

4. **Security/RLS**:
   - All tables must have Row Level Security (RLS) enabled.
   - Direct `anon` and `authenticated` table access (Select, Insert, Update, Delete) must be revoked/disabled.
   - Do not add public select/insert policies because all access must go through Edge Functions using the service role key.
