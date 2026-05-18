const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const chatbotRoutes = require("./routes/chatbotRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const notFound = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();


// PAYSTACK WEBHOOK RAW BODY
app.use(
  "/api/payment/webhook",
  express.raw({ type: "*/*" })
);


// BODY PARSERS
app.use(express.json());


// CORS (frontend + backend safe)
app.use(
  cors({
    origin: "https://restaurant-chatbot-8lr4.onrender.com",
    credentials: true,
  })
);


// SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);


// STATIC FRONTEND
app.use(express.static(path.join(__dirname, "../public")));


// ROUTES
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/payment", paymentRoutes);


// HOME ROUTE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});


// ERROR HANDLING
app.use(notFound);
app.use(errorHandler);

module.exports = app;