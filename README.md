# takeuupward

A full-stack course platform where students sign in with Google, unlock paid course content via Razorpay, and work through interactive modules with notes, practice questions, and quizzes.

Live example course: **Cloud Computing** — 12 modules, each with study notes, self-check practice questions, and a scored quiz.

---

## ✨ Features

- **Google Sign-In** via Firebase Authentication
- **Razorpay payments** (order creation, signature verification, and webhook-based confirmation) to unlock course access
- **Access-gated course pages** — content only renders once payment is verified against the backend
- **Interactive module viewer** with three views per module:
  - 📖 **Notes** — structured study material
  - ✏️ **Practice** — instant right/wrong feedback per question
  - ✅ **Quiz** — full quiz with scoring on submit
- Responsive sidebar navigation across modules
- Clean separation between a Go/Gin API backend and a Next.js frontend

---

## 🧱 Tech Stack

**Backend** (`/backend`)
- [Go](https://go.dev/) + [Gin](https://github.com/gin-gonic/gin)
- [MongoDB](https://www.mongodb.com/) (via the official Go driver)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) — verifies ID tokens issued by the frontend
- [Razorpay](https://razorpay.com/) — order creation, payment signature verification, and webhook handling

**Frontend** (`/my-app`)
- [Next.js](https://nextjs.org/) (App Router) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/) client SDK (Google sign-in)
- [Razorpay Checkout.js](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/)
- [lucide-react](https://lucide.dev/) icons

---

## 📁 Project Structure

```
.
├── backend/
│   ├── config/       # Env loading (Mongo, Firebase, Razorpay)
│   ├── db/           # MongoDB connection
│   ├── handlers/     # HTTP handlers: user sync, payment, Razorpay client
│   ├── middleware/    # Firebase auth middleware
│   ├── models/        # User & Payment models
│   └── main.go        # Router + wiring
│
└── my-app/
    ├── app/
    │   ├── cloudComputing/     # Course page (access-gated)
    │   ├── components/         # module1 ... module12 (notes/practice/quiz)
    │   └── page.tsx             # Landing page (sign-in + payment modal)
    ├── hooks/                   # useAuth, useRazorpayPayment
    └── lib/                     # api.ts (backend calls), firebase.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Go 1.25+
- Node.js 18+ and npm
- A MongoDB instance (Atlas or self-hosted)
- A Firebase project (Auth enabled, Google provider on) + service account JSON
- A Razorpay account (API key/secret + webhook secret)

### 1. Backend setup

```bash
cd backend
cp .env.example .env   # create this if it doesn't exist — see Environment Variables below
go mod download
go run main.go
```

The API starts on `:8080` by default.

### 2. Frontend setup

```bash
cd my-app
npm install
npm run dev
```

Visit `http://localhost:3000`.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default `8080`) |
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB_NAME` | Database name (default `course_platform`) |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Path to Firebase service account JSON |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook signing secret |

### Frontend (`my-app/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL (default `http://localhost:8080`) |

> Firebase client config currently lives inline in `lib/firebase.ts`. Consider moving it to environment variables before making the repo public, even though these values are safe to expose client-side.

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/healthz` | — | Health check |
| `POST` | `/api/webhooks/razorpay` | Razorpay signature | Payment webhook (source of truth for payment status) |
| `POST` | `/api/user/sync` | Firebase | Upsert user after sign-in |
| `POST` | `/api/payment/order` | Firebase | Create a Razorpay order for a course |
| `POST` | `/api/payment/verify` | Firebase | Verify payment signature after Checkout.js success |
| `GET` | `/api/course/:courseId/access` | Firebase | Check whether the current user has paid for a course |

---

## 💳 Payment Flow

1. User signs in with Google → frontend calls `/api/user/sync` to upsert the user in MongoDB.
2. User clicks "Pay" → frontend calls `/api/payment/order` → backend creates a Razorpay order and stores a `created` payment record.
3. Razorpay Checkout.js opens; on success, frontend calls `/api/payment/verify`, which checks the HMAC signature and marks the payment `paid`.
4. Razorpay also sends a webhook to `/api/webhooks/razorpay` as a fallback confirmation path (covers cases where the browser callback never fires).
5. `/api/course/:courseId/access` checks for a `paid` payment record before the course page renders any content.

---

## 🛠️ Adding a New Course Module

Each module lives in `my-app/app/components/moduleN/page.tsx` and exports a component accepting a `view: 'notes' | 'practice' | 'quiz'` prop, backed by local `notes` and `questions` arrays. To add a new module:

1. Create `app/components/moduleN/page.tsx` following the pattern of an existing module.
2. Register it in `app/cloudComputing/page.tsx` (import + add to the `modules` array + `ModuleRenderer` switch).

