# Student Resource Hub

A clean, scalable, production-ready React + Vite application structure designed for seamless integration with Google Stitch-generated frontends, Firebase services, and an Express/Prisma backend.

## Key Features
- **Student Portal:** Discover, search, and bookmark academic resources and opportunities.
- **Resource Management:** Upload and review study materials (Notes, Papers, Syllabuses, etc.).
- **Admin Dashboard:** Moderation tools to approve/reject student uploads and manage catalog data.
- **Secure Architecture:** Role-based access control with JWT authentication.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL, Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer (Local Disk Storage)

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
git clone <repository-url>
cd student-resource-hub
```

### 2. Install Dependencies

You'll need to install dependencies for both the frontend and the backend.

```bash
# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup

**Backend Configuration:**
Create a `.env` file inside the `backend/` directory:

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
Ensure your frontend connects to the backend properly. By default, it uses `http://localhost:3000` (set in `frontend/vite.config.ts` or via env variables).

### 4. Database Setup

Navigate to the backend directory and run the Prisma migrations to create the database schema:

```bash
cd backend
npx prisma migrate dev --name init
```
*(Optional) Seed the database if a seed script is available:*
```bash
npx prisma db seed
```

### 5. Start Development Servers

You need to run both the backend API and the frontend application concurrently.

**Terminal 1: Start the Backend (Express)**
```bash
cd backend
npm run dev
```
*The API will start on `http://localhost:3000`.*

**Terminal 2: Start the Frontend (Vite/React)**
```bash
npm run dev
```
*The frontend will start on `http://localhost:5173`.*

---

## Architecture Overview

### Directory Structure

```text
student-resource-hub/
├── public/                 # Static assets served to the client
├── src/                    # FRONTEND CODE
│   ├── assets/             # Raw assets (images, icons, fonts)
│   ├── components/         # Reusable React components (UI Kit, Layouts)
│   ├── features/           # Feature-based domain logic and state
│   ├── pages/              # Routing entry points (Views)
│   ├── layouts/            # Shared layouts (AppLayout, AdminLayout)
│   ├── routes/             # Route configurations
│   ├── services/           # External service integration adapters
│   └── lib/api.js          # Axios configuration and API client
├── server/                 # BACKEND CODE
│   ├── prisma/             # Prisma schema and migrations
│   ├── src/
│   │   ├── controllers/    # Route controllers (req, res handling)
│   │   ├── services/       # Business logic layer and DB operations
│   │   ├── routes/         # Express route definitions
│   │   ├── middlewares/    # Custom middlewares (auth, validation, errors)
│   │   └── config/         # App configuration (multer, prisma client)
│   └── app.js              # Express app setup
└── README.md               # Main project documentation
```

### Data Flow
```
User Action → React Component (Vite) → Axios Request → Express Router → Controller → Service → Prisma ORM → MySQL Database
```

---

## Available Scripts

### Frontend (Root Directory)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the application for production |
| `npm run preview` | Locally preview the production build |

### Backend (`backend/` Directory)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Express server with nodemon |
| `npm start` | Start the Express server in production mode |
| `npx prisma studio` | Open the Prisma database GUI |

---

## Troubleshooting

### Database Connection Refused
If the backend crashes immediately with a database error:
- Ensure MySQL is running on your machine.
- Verify the username, password, and port in `backend/.env`.
- Ensure the database `student_resource_hub` actually exists (Prisma migrations will try to create it, but sometimes manual creation is required depending on your MySQL setup).

### API Calls Failing (CORS or 404)
- Ensure the backend server is running on port `3000`.
- Verify that `CLIENT_ORIGIN` in `backend/.env` exactly matches your frontend URL (e.g., `http://localhost:5173`).
