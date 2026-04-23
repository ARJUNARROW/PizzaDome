# 🍕 Pizza Dome

**Street-style artisan pizza with a premium twist.**

Pizza Dome is a modern, full-stack web application for an artisan pizza brand. It features a stunning, responsive UI, a live kitchen visualizer, and a complete backend integration for payment processing and order management.

## ✨ Features

- 🌓 **Dynamic Dark Mode**: Beautifully crafted themes for day and night.
- 🎥 **Live Kitchen Feed**: Integrated video feed of the "Open Kitchen".
- 🛒 **Interactive Menu**: Fully customizable pizzas with size and add-on selections.
- 💳 **Secure Payments**: Full Razorpay integration with backend verification.
- 📦 **Order Tracking**: Database-backed order history and status.
- ⚡ **Vite Powered**: Blazing fast performance and developer experience.

## 🚀 Quick Start

### 1. Prerequisites
Refer to [requirements.md](./requirements.md) for detailed software requirements.

### 2. Backend Setup
```bash
cd pizza-dome-backend
npm install
# Configure your .env file with MongoDB and Razorpay keys
npm run dev
```

### 3. Frontend Setup
```bash
# In the root directory
npm install
npm run dev
```

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Payments**: Razorpay SDK
- **Fonts**: Syne & DM Sans

## 📁 Project Structure

- `/`: Frontend application (Vite + React)
- `/pizza-dome-backend`: Node.js/Express backend server
- `/public/video`: Assets for the live kitchen feed
- `PizzaDome.jsx`: Main UI component

## 🔧 Environment Variables

### Backend (.env)
- `PORT`: Server port (default 5000)
- `MONGO_URI`: MongoDB connection string
- `RAZORPAY_KEY_ID`: Your Razorpay Key
- `RAZORPAY_KEY_SECRET`: Your Razorpay Secret

---
Made with ❤️ & 🍕 by [ARJUNARROW](https://github.com/ARJUNARROW)
