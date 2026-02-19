# EthioSugar Farm Automation - Frontend

A React-based web dashboard for farm automation and management.

## Tech Stack

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **State Management:** Redux Toolkit (RTK) + RTK Query
- **Routing:** React Router v7
- **Forms:** React Hook Form + Zod validation
- **Styling:** TailwindCSS

## Project Structure

```
src/
├── app/              # Redux store configuration
├── components/       # Reusable UI components
├── features/         # Feature modules
│   ├── auth/        # Authentication
│   ├── dashboard/   # Dashboard page
│   ├── fields/      # Fields management
│   ├── incidents/   # Incident reporting
│   ├── irrigation/  # Irrigation logs
│   └── tasks/       # Task management
├── hooks/           # Custom hooks
├── services/        # API service layer
├── types/           # TypeScript types
└── utils/           # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
# Create .env file with your API URL
cp .env.example .env

# Start development server
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `/api` |

## Role-Based Access

| Role | Access |
|------|--------|
| **ADMIN** | All routes and features |
| **SUPERVISOR** | All routes except user management |
| **WORKER** | Dashboard, Fields (read-only), Incidents (create), Irrigation |

## API Endpoints

The frontend expects the following backend endpoints:

- `POST /auth/login` - User authentication
- `GET /internal/daily-summary` - Dashboard summary
- `GET /fields` - List fields
- `GET /fields/:id` - Field details
- `GET /incidents` - List incidents
- `POST /incidents` - Create incident
- `PATCH /incidents/:id/status` - Update incident status
- `POST /irrigation` - Create irrigation log
- `GET /irrigation` - List irrigation logs
- `GET /tasks` - List tasks
- `PATCH /tasks/:id/status` - Update task status

## Deployment (Vercel)

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set environment variable `VITE_API_BASE_URL` in Vercel dashboard
4. Deploy

The `vercel.json` configuration handles SPA routing.

## Features

- ✅ User authentication with JWT
- ✅ Role-based access control
- ✅ Dashboard with operational summary
- ✅ Field management with status indicators
- ✅ Incident reporting and management
- ✅ Irrigation logging with status feedback
- ✅ Task management
- ✅ Responsive design
- ✅ Loading, error, and empty states
