# EthioSugar Farm Automation – Frontend Specification (MVP)

Version: 1.0  
Owner: Product Lead  
Audience: Frontend Engineering Agent  
Scope: MVP (Frozen Scope)

---

# 1. SYSTEM OVERVIEW

## 1.1 Purpose

Build the web dashboard for the EthioSugar Farm Automation MVP.

The frontend must:

- Authenticate users
- Enforce role-based UI access
- Display field operational status
- Allow structured incident reporting
- Allow irrigation log submission
- Display tasks
- Handle loading, error, and empty states properly
- Be production-ready and deployable

This is a responsive web dashboard (desktop-first).

No mobile app.
No advanced analytics.
No predictive charts.

---

# 2. TECH STACK (MANDATORY)

- Framework: React (Vite recommended)
- Language: TypeScript
- State Management: Redux Toolkit (RTK) + RTK Query
- Routing: React Router
- HTTP Client: RTK Query or Axios (if needed)
- Styling: TailwindCSS or clean CSS modules
- Form Handling: React Hook Form
- Validation: Zod
- Deployment Target: Vercel or Firebase Hosting

---

# 3. ARCHITECTURE STYLE

Feature-based modular structure.

src/
app/
features/
auth/
dashboard/
fields/
incidents/
irrigation/
tasks/
components/
services/
types/
utils/
hooks/

No business logic inside components.
Keep logic in hooks or feature services.

---

# 4. AUTHENTICATION FLOW

## 4.1 Login

User enters:

- email
- password

POST /auth/login

Store JWT in:

- memory (preferred)
  or
- httpOnly cookie (if backend supports)

Store user info in Redux state.

---

## 4.2 Protected Routes

Routes must be protected by role:

- ADMIN
- SUPERVISOR
- WORKER

Unauthorized access → redirect to login.

---

# 5. ROUTING STRUCTURE

/login

/dashboard
/fields
/incidents
/irrigation
/tasks

Access Control:

ADMIN:

- All routes

SUPERVISOR:

- dashboard
- fields
- incidents
- tasks

WORKER:

- dashboard
- fields (read-only)
- incidents (create only)
- irrigation

---

# 6. UI PAGES SPECIFICATION

---

## 6.1 LOGIN PAGE

Fields:

- Email
- Password
- Submit button

States:

- Loading
- Invalid credentials
- Network error

---

---

## 6.2 DASHBOARD PAGE

Purpose:
High-level operational overview.

Must display:

- Total incidents (today)
- Open incidents
- Critical fields count
- Pending tasks count

Data source:
GET /internal/daily-summary (via n8n or direct backend endpoint)

Also show:

- Latest 5 incidents
- Latest 5 tasks

---

---

## 6.3 FIELDS PAGE

Display all fields in cards or table.

Each field must show:

- Field name
- Crop type
- Status indicator:

Green → NORMAL  
Yellow → WARNING  
Red → CRITICAL

Status derived from:
Latest irrigation log evaluation.

Clicking field:
Opens detailed view:

- Threshold values
- Last irrigation entries
- Open incidents related to field

---

---

## 6.4 INCIDENTS PAGE

Two modes:

Supervisor/Admin:

- List all incidents
- Filter by status
- Update status

Worker:

- Submit new incident
- View incidents created by self

Incident form:

Fields:

- Field selector
- Type dropdown
- Severity dropdown
- Description textarea

Validation required.

After submission:

- Show success message
- Reset form
- Redirect to incident list

---

---

## 6.5 IRRIGATION PAGE

Accessible to Worker + Supervisor.

Form:

- Field selector
- Moisture deficit numeric input

After submission:

Backend returns:
{
status: NORMAL | WARNING | CRITICAL
}

UI must display:

Green badge → NORMAL  
Yellow badge → WARNING  
Red badge → CRITICAL

If CRITICAL:
Show warning banner.

---

---

## 6.6 TASKS PAGE

Display:

- Task title
- Field
- Priority
- Status

Color coding:

NORMAL → Gray  
WARNING → Yellow  
CRITICAL → Red

Supervisor/Admin:
Can mark task as completed.

Worker:
Read-only.

---

# 7. COMPONENT REQUIREMENTS

Reusable Components:

- Layout
- Sidebar
- Topbar
- StatusBadge
- ProtectedRoute
- LoadingSpinner
- ErrorMessage
- EmptyState

StatusBadge must support:

- NORMAL
- WARNING
- CRITICAL

---

# 8. STATE MANAGEMENT

Use RTK Query for:

- Auth
- Fields
- Incidents
- Irrigation Logs
- Tasks

Use Redux slice for:

- Auth state
- User role

Caching strategy:

- Fields: cache 5 minutes
- Incidents: no long caching
- Tasks: auto-refetch on update

---

# 9. FORM VALIDATION RULES

Incident Form:

- fieldId required
- type required
- severity required
- description min length 10

Irrigation Form:

- fieldId required
- moistureDeficit must be positive number

---

# 10. ERROR HANDLING

All API errors must:

- Display readable message
- Not crash UI
- Fallback gracefully

Show:

- Network error banner
- Unauthorized session expiration → redirect login

---

# 11. ROLE-BASED UI LOGIC

Sidebar items must render conditionally:

ADMIN:

- All menu items

SUPERVISOR:

- No user management menu

WORKER:

- No tasks editing
- No threshold editing

Role must be enforced visually AND via route guards.

---

# 12. LOADING & UX REQUIREMENTS

Every API call must show:

- Spinner or skeleton

No blank screens.

Empty states must display helpful text.

Example:
"No incidents reported today."

---

# 13. PERFORMANCE REQUIREMENTS

- Initial load < 2 seconds
- Avoid unnecessary re-renders
- Use memoization where needed
- Lazy load pages

---

# 14. ENVIRONMENT VARIABLES

Required:

VITE_API_BASE_URL

---

# 15. ACCESSIBILITY REQUIREMENTS

- Proper label tags
- Button types specified
- Color contrast accessible
- Keyboard navigable forms

---

# 16. OUT OF SCOPE

- Charts
- Advanced analytics
- Real-time WebSocket updates
- Dark mode
- Multi-language support
- Mobile-native layout

---

# 17. DEFINITION OF DONE

Frontend is complete when:

- All routes functional
- Role-based restrictions validated
- Incident creation triggers backend successfully
- Irrigation submission shows correct status
- Tasks update works
- No console errors
- Deployed to production
- Tested across modern browsers

---

# 18. DESIGN PRINCIPLES

- Clean
- Professional
- Operational
- Minimal distraction
- Status clarity is priority

Color emphasis:
Green, Yellow, Red must visually dominate.

---

END OF FRONTEND SPECIFICATION
