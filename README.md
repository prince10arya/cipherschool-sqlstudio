# CipherSQL Studio

A browser-based SQL learning platform where students can practice SQL queries against pre-configured assignments with real-time execution and intelligent hints.

<div style="display: flex; justify-content: space-between;">
   <img src="./ui_ss/Screenshot (18).png" alt="homepage" width="32%">
   <img src="./ui_ss/Screenshot (19).png" alt="workspace" width="32%">
   <img src="./ui_ss/Screenshot (20).png" alt="admin" width="32%">
</div>

## Project Structure

```
ciphershool/
├── client/my-react-app/     # Frontend (React + SCSS + Monaco Editor)
│   ├── src/
│   │   ├── pages/           # Home, Workspace pages
│   │   ├── styles/          # SCSS files
│   │   └── App.jsx
│   └── package.json
│
└── server/                  # Backend (Express + MongoDB + PostgreSQL)
    ├── models/              # Mongoose schemas
    ├── routes/              # API routes
    ├── config/              # Database configuration
    ├── server.js
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- PostgreSQL (local or remote)
- Groq API key

### Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Create `.env` file (copy from `.env.example`):
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ciphersql
   PG_HOST=localhost
   PG_PORT=5432
   PG_DATABASE=sqlsandbox
   PG_USER=postgres
   PG_PASSWORD=yourpassword
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client/my-react-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser

## 🐳 Docker Deployment (Recommended)

The easiest way to run CipherSQL Studio is using Docker:

### Quick Start with Docker

1. **Prerequisites**:
   - Docker and Docker Compose installed
   - Groq API key ([Get one here](https://console.groq.com))

2. **Setup**:
   ```bash
   # Clone the repository
   cd ciphershool

   # Create environment file
   cp .env.docker .env
   
   # Edit .env and add your Groq API key
   nano .env  # or use your preferred editor
   ```

3. **Run**:
   ```bash
   # Build and start all services
   docker-compose up -d

   # Seed sample assignments (first time only)
   docker-compose exec backend node seed.js

   # View logs
   docker-compose logs -f
   ```

4. **Access**:
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:5000`

5. **Stop**:
   ```bash
   docker-compose down
   
   # To remove volumes (database data)
   docker-compose down -v
   ```

### Docker Services

- **Frontend**: Nginx serving React app on port 80
- **Backend**: Express server on port 5000
- **MongoDB**: Database on port 27017 (assignments)
- **PostgreSQL**: Database on port 5432 (query sandbox)

---

## 💻 Manual Setup (Development)

If you prefer to run without Docker:

## Features

### ✅ Core Features
- **Assignment Listing**: Browse SQL challenges with difficulty levels
- **SQL Editor**: Monaco-powered code editor with syntax highlighting
- **Query Execution**: Real-time SQL query execution against PostgreSQL
- **Sample Data Viewer**: View table schemas and sample data
- **LLM Hints**: Get intelligent hints (not solutions) from Groq AI
- **Mobile Responsive**: Fully responsive design (320px - 1920px+)

### 🎨 Design Features
- Glassmorphism effects
- Smooth animations and transitions
- Dark mode interface
- Mobile-first responsive design
- Touch-friendly UI

## Tech Stack

**Frontend:**
- React.js
- Vite
- SCSS (vanilla, mobile-first)
- Monaco Editor
- React Router

**Backend:**
- Node.js + Express
- MongoDB (assignments storage)
- PostgreSQL (query sandbox)
- Groq AI (hints)

## API Endpoints

- `GET /api/assignments` - List all assignments
- `GET /api/assignments/:id` - Get assignment details
- `POST /api/query/execute` - Execute SQL query
- `POST /api/hint` - Get AI-powered hint

## Security

- Query sanitization (prevents DROP, DELETE, etc.)
- Transaction-based rollback for query execution
- CORS enabled
- Input validation

## Development

To add new assignments, insert them into MongoDB using the Assignment schema:

```javascript
{
  title: "Assignment Title",
  difficulty: "Easy|Medium|Hard",
  description: "Brief description",
  question: "Full question text",
  sampleData: {
    tableName: {
      schema: [{ name: "id", type: "INTEGER" }],
      rows: [{ id: 1 }]
    }
  }
}
```
