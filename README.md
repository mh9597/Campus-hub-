# Student Resource Hub

A clean, scalable, production-ready React + Vite application structure designed for seamless integration with Google Stitch-generated frontends, Firebase services, and an Express/Prisma backend. It acts as an academic portal for discovering, managing, and moderating student study materials.

## Key Features

- **Student Portal:** Discover, search, and bookmark academic resources and opportunities.
- **Resource Management:** Upload and review study materials (Notes, Papers, Syllabuses, etc.).
- **Admin Dashboard:** Moderation tools to approve/reject student uploads and manage catalog data.
- **Secure Architecture:** Role-based access control with robust JWT authentication.

---

## Tech Stack

- **Language**: JavaScript / TypeScript
- **Frontend**: React 19, Vite, Tailwind CSS 4
- **Backend**: Node.js, Express.js 4
- **Database**: MySQL, Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) with Refresh Token rotation
- **File Uploads**: Multer (Local Disk Storage)

---

## Dependencies

### Frontend (`frontend/package.json`)
- **Core:** `react`, `react-dom`, `react-router-dom`
- **Build/Styling:** `vite`, `tailwindcss` (v4), `postcss`
- **Linting:** `oxlint`

### Backend (`backend/package.json`)
- **Core:** `express`, `dotenv`, `cors`, `helmet`
- **Database:** `@prisma/client`, `prisma` (CLI)
- **Security & Auth:** `bcryptjs`, `jsonwebtoken`, `express-rate-limit`, `express-validator`
- **Uploads & Logging:** `multer`, `morgan`, `uuid`

---

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [MySQL](https://www.mysql.com/) (v8 or higher)
- [Git](https://git-scm.com/)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Krish-Rupareliya/student-resource-hub.git
cd student-resource-hub
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

### 4. Environment Setup

**Backend Configuration:**
Copy the example environment file inside the `backend/` directory:

```bash
cd backend
cp .env.example .env
```
Update `backend/.env` with your MySQL credentials and JWT secrets:
```env
DATABASE_URL="mysql://root:password@localhost:3306/student_resource_hub"
JWT_ACCESS_SECRET="your_secure_access_secret"
JWT_REFRESH_SECRET="your_secure_refresh_secret"
CLIENT_ORIGIN="http://localhost:5173"
```

**Frontend Configuration:**
Copy the example environment file inside the `frontend/` directory:

```bash
cd ../frontend
cp .env.example .env.local
```
Ensure your frontend connects to the backend properly. By default, it uses `http://localhost:3000` set via `VITE_API_BASE_URL`.

### 5. Database Setup

Ensure MySQL is running on your local machine, then navigate to the backend directory and run the Prisma migrations to create the database schema:

```bash
cd ../backend
npm run db:migrate
```
Seed the database with initial categories and roles:
```bash
npm run db:seed
```

### 6. Start Development Servers

You need to run both the backend API and the frontend application concurrently.

**Terminal 1: Start the Backend (Express)**
```bash
cd backend
npm run dev
```
*The API will start on `http://localhost:3001`.*

**Terminal 2: Start the Frontend (Vite/React)**
```bash
cd frontend
npm run dev
```
*The frontend will start on `http://localhost:5173`.*

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Architecture Overview

### Directory Structure

```text
student-resource-hub/
├── frontend/               # FRONTEND CODE (React + Vite)
│   ├── public/             # Static assets served to the client
│   ├── src/                
│   │   ├── assets/         # Raw assets (images, icons, fonts)
│   │   ├── components/     # Reusable React components (UI Kit, Layouts)
│   │   ├── hooks/          # Custom React hooks for data fetching
│   │   ├── pages/          # Routing entry points (Views)
│   │   ├── layouts/        # Shared layouts (AppLayout, AdminLayout)
│   │   ├── routes/         # Route configurations
│   │   ├── services/       # External service integration adapters
│   │   └── lib/api.js      # Axios configuration and API client
│   └── vite.config.ts      # Vite bundler config
│
└── backend/                # BACKEND CODE (Express + Prisma)
    ├── prisma/             
    │   ├── schema.prisma   # Prisma schema definitions
    │   └── seed.js         # Database seed script
    ├── src/
    │   ├── controllers/    # Route controllers (req, res handling)
    │   ├── services/       # Business logic layer and DB operations
    │   ├── routes/         # Express route definitions
    │   ├── middlewares/    # Custom middlewares (auth, validation, errors)
    │   ├── config/         # App configuration (multer, prisma client)
    │   └── utils/          # Utility functions (jwt, response formatting)
    ├── uploads/            # Locally stored user uploads
    └── server.js           # Express app setup and server entry point
```

### Request Lifecycle

1. User interacts with a React component in the `frontend`.
2. The component calls a service function inside `frontend/src/services/` using Axios.
3. The HTTP request hits the Express router in `backend/src/routes/`.
4. Middleware (e.g., `auth.middleware.js`) authenticates and validates the payload.
5. The request reaches the Controller (`backend/src/controllers/`), which delegates business logic to the Service layer (`backend/src/services/`).
6. The Service layer queries MySQL using the Prisma Client.
7. The Controller receives the database result and sends a JSON response using `utils/response.js`.
8. The React frontend receives the response, updates state, and triggers a re-render.

### Data Flow

```text
User Action → React Component → Axios Hook → Express Route → Controller → Service → Prisma ORM → MySQL
       ↓                                                                                         ↓
   UI Update ←----------------------- Axios Response ←--------------------------------------- DB Result
```

### Database Schema

```text
users
├── id (String, PK, uuid)
├── email (String, unique)
├── passwordHash (String)
├── name (String)
├── role (Enum: ADMIN, MODERATOR)
└── created_at (DateTime)

refresh_tokens
├── id (String, PK, uuid)
├── userId (String, FK -> users)
├── tokenHash (String)
└── expiresAt (DateTime)

semesters
├── id (Int, PK, autoincrement)
├── departmentId (Int, FK -> departments)
├── semesterNumber (Int)
└── name (String)

subjects
├── id (String, PK, uuid)
├── semesterId (Int, FK -> semesters)
├── code (String, unique)
└── title (String)

resources
├── id (String, PK, uuid)
├── subjectId (String, FK -> subjects)
├── title (String)
├── resourceType (String)
├── fileUrl (String)
└── isActive (Boolean)

resource_uploads (User submissions pending moderation)
├── id (String, PK, uuid)
├── subjectCode (String)
├── title (String)
├── fileUrl (String)
└── status (Enum: PENDING, APPROVED, REJECTED)
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | MySQL Connection String | `mysql://root:password@localhost:3306/hub` |
| `JWT_ACCESS_SECRET` | Secret to sign short-lived access tokens | `generated-secret` |
| `JWT_REFRESH_SECRET` | Secret to sign long-lived refresh tokens | `generated-secret` |
| `CLIENT_ORIGIN` | Allowed CORS origin (Frontend URL) | `http://localhost:5173` |
| `PORT` | The port the Express server listens on | `3001` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | API Base URL connecting to Express | `http://localhost:3001` |

---

## Available Scripts

### Backend (`backend/`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Express server with nodemon for hot-reloading |
| `npm start` | Start the Express server in production mode |
| `npm run db:generate` | Generate the Prisma Client after schema changes |
| `npm run db:migrate` | Run migrations against the database |
| `npm run db:push` | Push schema changes directly to DB (dev only) |
| `npm run db:seed` | Seed the database with initial data |
| `npm run db:studio` | Open the Prisma database GUI |

### Frontend (`frontend/`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the application for production |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Run the oxlint linter to check for code issues |

---

## Testing

*(Testing framework currently unconfigured. Unit tests using Jest/Vitest are planned for upcoming releases).*

---

## Deployment

The application consists of a static frontend (Vite) and a Node.js backend. 

### Docker (Recommended for Backend)

You can containerize the Express API using a standard Node.js Dockerfile, and deploy it to platforms like Railway, Render, or AWS ECS.

```bash
# Example Run Command
docker run -p 3001:3001 -e DATABASE_URL=mysql://... -e JWT_ACCESS_SECRET=... backend-image
```

### Vercel / Netlify (Recommended for Frontend)

1. Connect your GitHub repository to Vercel/Netlify.
2. Set the Root Directory to `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `VITE_API_BASE_URL` pointing to your deployed backend.

---

## Troubleshooting

### Database Connection Refused
**Error:** Backend crashes immediately with `PrismaClientInitializationError`.
**Solution:**
- Ensure MySQL is running on your machine.
- Verify the username, password, and port in `backend/.env`.
- Ensure the database specified in the URL actually exists (Prisma migrations will create it if the user has permissions, but manual creation may be required).

### API Calls Failing (CORS or 404)
**Error:** Console shows `CORS Policy Error` or `Failed to Fetch`.
**Solution:**
- Ensure the backend server is actually running on port `3001`.
- Verify that `CLIENT_ORIGIN` in `backend/.env` exactly matches your frontend URL (e.g., `http://localhost:5173`).
- Verify that `VITE_API_BASE_URL` in `frontend/.env.local` points exactly to `http://localhost:3001`.

### Prisma Unknown Model Error
**Error:** `Invalid 'prisma.user.findUnique()' invocation`
**Solution:**
You modified the schema but didn't generate the client. Run:
```bash
npm run db:generate
```
