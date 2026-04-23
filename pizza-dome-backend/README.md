# 🍕 Pizza Dome — Backend Setup Guide

## Folder Structure

```
pizza-dome-backend/
├── config/
│   ├── db.js               ← MongoDB connection
│   └── razorpay.js         ← Razorpay singleton client
├── controllers/
│   └── paymentController.js ← Business logic (create order, verify, get order)
├── middleware/
│   ├── errorHandler.js     ← Global error handler
│   └── validate.js         ← express-validator runner
├── models/
│   └── Order.js            ← Mongoose schema
├── routes/
│   └── paymentRoutes.js    ← Route definitions + validation rules
├── server.js               ← Entry point
├── .env.example            ← Copy this to .env
└── package.json
```

---

## Step 1 — Clone / Create the folder

```bash
mkdir pizza-dome-backend
cd pizza-dome-backend
# paste all the files in their correct locations
```

---

## Step 2 — Install dependencies

```bash
npm install
```

---

## Step 3 — Create your .env file

```bash
cp .env.example .env
```

Then open `.env` and fill in real values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pizza-dome
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

> Get your Razorpay test keys from: https://dashboard.razorpay.com/app/keys

---

## Step 4 — Start MongoDB

Make sure MongoDB is running locally:

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows — start via MongoDB Compass or services
```

---

## Step 5 — Run the backend

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

You should see:
```
✅ MongoDB connected: localhost
🚀 Server running on http://localhost:5000
```

Test it: http://localhost:5000/api/health

---

## Frontend Integration

### 1. Add to your React project

Copy `FRONTEND_paymentService.js` into your React project:
```
pizza-dome/
└── src/
    └── services/
        └── paymentService.js   ← paste here
```

### 2. Add Razorpay Key to frontend .env

Create `pizza-dome/.env`:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
```

### 3. Replace the PaymentModal in PizzaDome.jsx

Find your `PaymentModal` component's `pay` function and replace it:

```jsx
// At the top of PizzaDome.jsx
import { handleRazorpayPayment } from './services/paymentService';

// Inside PaymentModal component, replace the pay() function:
const pay = async () => {
  setStep("processing");

  await handleRazorpayPayment({
    cart,                    // pass cart from parent via props
    totalAmount: total,      // total in rupees

    onSuccess: (data) => {
      setStep("success");
      setTimeout(onSuccess, 2800);  // existing callback
    },

    onFailure: (message) => {
      setStep("form");
      alert("Payment failed: " + message);
    },
  });
};
```

### 4. Pass cart to PaymentModal

Update your PaymentModal call in App:
```jsx
{paymentOpen && (
  <PaymentModal
    total={cartTotal}
    cart={cart}           // ← add this prop
    onClose={() => setPaymentOpen(false)}
    onSuccess={onSuccess}
    darkMode={darkMode}
  />
)}
```

And accept it in PaymentModal props:
```jsx
function PaymentModal({ total, cart, onClose, onSuccess, darkMode }) {
```

---

## API Reference

### POST /api/payment/create-order

**Request:**
```json
{
  "amount": 799,
  "items": [
    {
      "id": 1,
      "name": "Margherita Supreme",
      "emoji": "🍕",
      "size": "Large",
      "qty": 2,
      "price": 299,
      "total": 698,
      "addons": ["Extra Cheese"]
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_XXXXXXXXXXXX",
    "amount": 79900,
    "currency": "INR"
  },
  "dbOrderId": "668abc..."
}
```

---

### POST /api/payment/verify

**Request:**
```json
{
  "razorpay_order_id": "order_XXXXXXXXXXXX",
  "razorpay_payment_id": "pay_XXXXXXXXXXXX",
  "razorpay_signature": "abc123...",
  "items": [...],
  "amount": 799
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified. Order confirmed! 🍕",
  "orderId": "668abc...",
  "paymentId": "pay_XXXXXXXXXXXX",
  "amount": 799
}
```

---

### GET /api/payment/order/:id

**Response:**
```json
{
  "success": true,
  "order": {
    "_id": "668abc...",
    "razorpayOrderId": "order_XX...",
    "razorpayPaymentId": "pay_XX...",
    "items": [...],
    "amountRupees": 799,
    "status": "paid",
    "createdAt": "2025-01-01T12:00:00.000Z"
  }
}
```

---

## Payment Flow Diagram

```
Frontend                    Backend                  Razorpay
   │                           │                        │
   │── POST /create-order ────►│                        │
   │                           │── razorpay.orders.create ──►│
   │                           │◄── { id, amount } ─────────│
   │◄── { order.id } ──────────│                        │
   │                           │                        │
   │── open Razorpay popup ────────────────────────────►│
   │◄── user pays, handler() called ────────────────────│
   │                           │                        │
   │── POST /verify ──────────►│                        │
   │                           │── HMAC-SHA256 check    │
   │                           │── MongoDB update       │
   │◄── { success: true } ─────│                        │
   │                           │                        │
   │── show success screen     │                        │
```

---

## Common Issues

| Problem | Fix |
|---------|-----|
| `CORS error` | Check `CLIENT_ORIGIN` in `.env` matches your Vite port |
| `MongoDB connection failed` | Run `mongod` or check `MONGO_URI` |
| `Razorpay: BAD_REQUEST_ERROR` | Check Key ID/Secret in `.env` |
| `Payment verification failed` | Key Secret mismatch — must be the same in both backend .env and Razorpay dashboard |
| `Script not loading` | Razorpay CDN blocked — check network / firewall |
