Use this:

# Restaurant ChatBot 🍽️

A fullstack restaurant chatbot application built with:

- Node.js
- Express.js
- MongoDB
- Express Session
- Paystack Payment Gateway

---

# Features

- Place food orders
- View current order
- Cancel order
- Checkout order
- View order history
- Paystack payment integration
- Webhook verification
- Session-based cart system

---

# Tech Stack

- Backend: Node.js + Express
- Database: MongoDB Atlas
- Payment: Paystack
- Frontend: HTML/CSS/JavaScript

---

# Installation

## Clone repository

```bash
git clone https://github.com/YOUR_USERNAME/restaurant-chatbot.git
```

---

## Install dependencies

```bash
npm install
```

---

## Create .env file

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

SESSION_SECRET=yoursecret

PAYSTACK_SECRET_KEY=your_paystack_secret

PAYSTACK_CALLBACK_URL=http://localhost:5000/api/payment/callback
```

---

# Run application

```bash
npm run dev
```

Open:

```text
http://localhost:5000
```

---

# ChatBot Commands

| Command | Action |
|---|---|
| 1 | Show menu |
| 2 | Fried Rice |
| 3 | Fried Rice |
| 4 | Chicken |
| 5 | Burger |
| 6 | Jollof Rice|
| 97 | Current order |
| 98 | Order history |
| 99 | Checkout |
| 0 | Cancel order |

---

# Deployment

Deployed on Render.

---

# Author

Nnamdi Paschal
