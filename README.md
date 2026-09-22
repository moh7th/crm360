# CRM360 - Enterprise SaaS Customer Relationship Management Platform

CRM360 is a full-featured, production-ready MERN SaaS application designed for modern business teams to centralize client directories, sales pipelines, lead conversions, task execution, and role-based collaboration.

---

## Key Features

- **Multi-Role Authentication**: Built-in support for Admin, Sales Manager, and Sales Executive with JWT authentication and bcrypt password hashing.
- **Interactive Executive Dashboard**: Real-time KPI metric cards (Total Customers, Active Leads, Pending Tasks, Closed Deals & Total Won Value), visual sales pipeline stage breakdown, and live activity timeline.
- **Complete Customer Relationship Management**: Full CRUD operations for client organizations, multi-parameter search, pagination, detailed profile view, and quick navigation.
- **Visual Sales Pipeline**: Kanban board and data-table views for tracking deals across stages (`New`, `Contacted`, `Qualified`, `Proposal Sent`, `Won`, `Lost`), quick stage promotions, and total deal sum calculations.
- **Action Tasks & Deadlines**: Priority-coded operations (`High`, `Medium`, `Low`), single-click completion toggles, overdue indicators, and links to customers or deals.
- **Polymorphic Relations**: Connect tasks and leads directly to client accounts.
- **Modern Responsive Design**: Tailwind CSS styling with glassmorphism, responsive navigation drawer, and desktop sidebar.

---

## Tech Stack

### Backend
- **Node.js & Express.js**: RESTful API architecture with modular routers and controllers.
- **MongoDB & Mongoose**: Schemas, pre-save encryption hooks, index validation, and relationships.
- **JWT & BcryptJS**: Token generation, role authorization, and credential protection.
- **In-Memory Fallback**: Automatic local development fallback when external MongoDB instances are offline.

### Frontend
- **React.js 18**: Modular component hierarchy and single-page routing with React Router v6.
- **Zustand**: Lightweight, decoupled state management stores for authentication, customers, leads, and tasks.
- **Axios**: Configured client with request and response interceptors for JWT token injection and error handling.
- **Tailwind CSS & React Icons**: Polished UI, color-coded badges, cards, and modal forms.

---

## Directory Layout

```
crm360/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   ├── dashboardController.js
│   │   ├── leadController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── roleCheck.js
│   ├── models/
│   │   ├── Customer.js
│   │   ├── Lead.js
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── customers.js
│   │   ├── dashboard.js
│   │   ├── leads.js
│   │   └── tasks.js
│   ├── scripts/
│   │   └── seed.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomerForm.js
│   │   │   ├── Layout.js
│   │   │   ├── LeadForm.js
│   │   │   ├── MetricCard.js
│   │   │   ├── Navbar.js
│   │   │   ├── Sidebar.js
│   │   │   └── TaskForm.js
│   │   ├── hooks/
│   │   │   └── usePrivateRoute.js
│   │   ├── pages/
│   │   │   ├── CustomerDetail.js
│   │   │   ├── Customers.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Leads.js
│   │   │   ├── Login.js
│   │   │   ├── NotFound.js
│   │   │   ├── Register.js
│   │   │   └── Tasks.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── customerStore.js
│   │   │   ├── leadStore.js
│   │   │   └── taskStore.js
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## Environment Setup

### 1. Backend Configuration (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/crm360
JWT_SECRET=crm360_super_secret_jwt_key_2026_production_ready
```

---

## Installation & Running

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Seed Demo Records (Optional but Recommended)

Populate the database with pre-configured accounts, enterprise customers, pipeline deals, and action tasks:

```bash
npm run seed
```

### Step 3: Start the Backend Server

```bash
npm start
```
The server will run on `http://localhost:5000`.

### Step 4: Install Frontend Dependencies & Start

Open a second terminal:

```bash
cd frontend
npm install
npm start
```
The web application will launch at `http://localhost:3000`.

---

## Pre-Configured Demo Accounts

You can log in instantly using the demo buttons on the login screen or with these credentials:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@crm360.com` | `Admin@123` |
| **Sales Manager** | `manager@crm360.com` | `Manager@123` |
| **Sales Executive** | `executive@crm360.com` | `Executive@123` |

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate user & get JWT token
- `GET /api/auth/me` - Fetch profile of logged-in user
- `GET /api/auth/users` - Fetch team members for assignment

### Customers
- `GET /api/customers` - Fetch paginated & searchable customers
- `GET /api/customers/:id` - Fetch single customer with related leads & tasks
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer & clean relationships

### Sales Leads
- `GET /api/leads` - Fetch leads with status and assignee filters
- `GET /api/leads/:id` - Fetch single lead
- `POST /api/leads` - Create lead
- `PUT /api/leads/:id` - Update lead details
- `PATCH /api/leads/:id/status` - Quick stage change
- `DELETE /api/leads/:id` - Delete lead

### Tasks
- `GET /api/tasks` - Fetch tasks with status, priority, and user filters
- `GET /api/tasks/user/assigned` - Fetch tasks assigned to authenticated user
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Toggle task completion status
- `DELETE /api/tasks/:id` - Delete task

### Dashboard
- `GET /api/dashboard/metrics` - Aggregated KPI counts and won contract volume
- `GET /api/dashboard/recent-activities` - 10 most recent team operations
- `GET /api/dashboard/sales-pipeline` - Grouped pipeline volume and conversion percentage
