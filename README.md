# 🧾 Smart Order & Invoice Toolkit

A full-stack web application for managing orders, invoices, products, and business profiles. Built with **React 19 + TypeScript + Vite** on the frontend and **Express.js + MongoDB** on the backend, secured with **JWT authentication**.

---

## ✨ Features

- 🔐 **Authentication** — Register & login with JWT-based session (7-day token)
- 📦 **Order Management** — Create, view, update status, delete orders with customer info and line items
- 🧾 **Invoice Management** — Auto-generate invoices linked to orders; export to PDF via `jsPDF`
- 🛍️ **Product Catalog** — Manage product list with pricing
- 👤 **User Profile** — Store company info, avatar, bio and user settings (theme, language, dashboard layout)
- 📊 **Dashboard** — Overview of recent orders and key stats
- 📜 **History** — Browse, search and filter past orders
- ⚙️ **Settings** — User preferences page

---

## 🗂️ Project Structure

```
SMART-ORDER-AND-INVOICE-TOOLKIT/
├── src/                        # React frontend
│   ├── components/             # Reusable UI components
│   │   └── layout/             # App shell / navigation
│   ├── context/                # React context providers
│   ├── lib/
│   │   └── auth.tsx            # AuthProvider & useAuth hook
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── CreateOrder.tsx
│   │   ├── History.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Settings.tsx
│   ├── main.tsx                # App entry point + routing
│   └── index.css               # Global styles
├── server/                     # Express.js backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts           # MongoDB connection
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts  # JWT verification
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Order.ts
│   │   │   ├── Invoice.ts
│   │   │   ├── Product.ts
│   │   │   └── Profile.ts
│   │   ├── routes/
│   │   │   ├── auth.ts         # POST /register, POST /login
│   │   │   ├── orderRoutes.ts
│   │   │   ├── invoiceRoutes.ts
│   │   │   ├── productRoutes.ts
│   │   │   └── profileRoutes.ts
│   │   └── index.ts            # Express app entry point
│   ├── .env                    # Backend environment variables
│   └── package.json
├── auth-system/                # Standalone auth module (frontend + backend)
│   ├── backend/
│   └── frontend/
├── public/                     # Static assets
├── docker-compose.yml          # Local MongoDB via Docker
├── package.json                # Frontend dependencies
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MongoDB** — either via Docker (see below) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

---

### 1. Clone the repository

```bash
git clone https://github.com/NguyenTanNHa/SMART-ORDER-AND-INVOICE-TOOLKIT.git
cd SMART-ORDER-AND-INVOICE-TOOLKIT
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create or edit `server/.env`:

```env
PORT=5000
JWT_SECRET=your_super_secret_key_here

# Option A: MongoDB Atlas (production)
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/smart-order-toolkit?retryWrites=true&w=majority

# Option B: Local MongoDB via Docker Compose (development)
# MONGO_URI=mongodb://127.0.0.1:27017/smart-order-toolkit
```

Start the backend dev server:

```bash
npm run dev
```

> The API will be available at `http://localhost:5000`

---

### 3. Frontend Setup

From the project root:

```bash
npm install
npm run dev
```

> The frontend will be available at `http://localhost:5173`

---

### 4. (Optional) Run MongoDB locally with Docker

```bash
docker-compose up -d
```

This starts a MongoDB container on port `27017` with a persistent volume (`mongodb_data`).

---

## 🌐 API Endpoints

All protected routes require the `Authorization: Bearer <token>` header.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register a new user |
| POST | `/api/auth/login` | ❌ | Login and receive JWT |
| GET | `/api/health` | ❌ | Health check |
| GET | `/api/orders` | ✅ | List orders (supports `?search=`) |
| POST | `/api/orders` | ✅ | Create a new order |
| PUT | `/api/orders/:id` | ✅ | Update order status |
| DELETE | `/api/orders/:id` | ✅ | Delete an order |
| GET | `/api/invoices` | ✅ | List invoices |
| POST | `/api/invoices` | ✅ | Create an invoice |
| PUT | `/api/invoices/:id` | ✅ | Update invoice |
| DELETE | `/api/invoices/:id` | ✅ | Delete an invoice |
| GET | `/api/products` | ✅ | List products |
| POST | `/api/products` | ✅ | Create a product |
| GET | `/api/profile` | ✅ | Get user profile |
| PUT | `/api/profile` | ✅ | Update user profile |

---

## 🗃️ Data Models

### Order
| Field | Type | Notes |
|-------|------|-------|
| `customerName` | String | Required |
| `customerEmail` | String | Optional |
| `phone` | String | Optional |
| `items` | `[{productName, quantity, price}]` | Line items |
| `totalAmount` | Number | Required |
| `status` | Enum | `Pending` / `Processing` / `Shipped` / `Delivered` |

### Invoice
| Field | Type | Notes |
|-------|------|-------|
| `orderId` | ObjectId | Links to Order |
| `invoiceNumber` | String | Unique |
| `status` | Enum | `Draft` / `Sent` / `Paid` / `Overdue` |
| `dueDate` | Date | Optional |
| `pdfUrl` | String | Optional, for generated PDF |

### Profile
| Field | Type | Notes |
|-------|------|-------|
| `fullName` | String | Optional |
| `companyName` | String | Optional |
| `bio` | String | Max 500 chars |
| `avatarUrl` | String | Optional |
| `settings` | Object | `{ theme, language, dashboardLayout }` |

---

## 🛠️ Tech Stack

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 6 | Type safety |
| Vite | 8 | Build tool & dev server |
| React Router DOM | 7 | Client-side routing |
| TailwindCSS | 4 | Utility-first CSS |
| React Hook Form | 7 | Form handling |
| Zod | 4 | Schema validation |
| jsPDF + jspdf-autotable | latest | PDF invoice generation |
| Framer Motion | 12 | Animations |
| Lucide React | latest | Icon library |
| React Hot Toast | 2 | Toast notifications |

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| Express | 4 | HTTP server |
| Mongoose | 8 | MongoDB ODM |
| jsonwebtoken | 9 | JWT auth |
| bcryptjs | 2 | Password hashing |
| dotenv | 16 | Environment config |
| ts-node-dev | 2 | TypeScript dev runner |

---

## 🔑 Environment Variables

### `server/.env`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Port for the API server |
| `MONGO_URI` | Yes | `mongodb://localhost:27017/smart-order-toolkit` | MongoDB connection string |
| `JWT_SECRET` | Yes | `super-secret-key-change-me` | Secret for signing JWTs — **change in production!** |

---

## 📜 Available Scripts

### Frontend (project root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest unit tests |

### Backend (`server/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend with ts-node-dev (hot reload) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |

---

## 🧪 Testing

Frontend tests use **Vitest** + **@testing-library/react**:

```bash
npm test
```

---

## ⚠️ Security Notes

- Change `JWT_SECRET` to a strong random string before deploying to production
- The `server/.env` file is excluded from version control — never commit real credentials
- All order, invoice, product, and profile routes are scoped per authenticated user (multi-tenant by design)

---

## 📄 License

MIT
