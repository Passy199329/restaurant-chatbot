const axios = require("axios");
const crypto = require("crypto");
const Order = require("../models/Order");

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;


// ==============================
// INITIALIZE PAYMENT
// ==============================
exports.makePayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send("Order not found");
    }

    if (order.status === "paid") {
      return res.send("Order already paid");
    }

   
    const email = order.customerEmail || "test@email.com";

    const payload = {
      email,
      amount: order.totalAmount * 100, // kobo
      callback_url: process.env.PAYSTACK_CALLBACK_URL,
      metadata: {
        orderId: order._id.toString(),
      },
    };

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      payload,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.redirect(response.data.data.authorization_url);

  } catch (error) {
    console.log("PAYSTACK INIT ERROR:", error.response?.data || error.message);
    return res.status(500).send("Payment failed");
  }
};


// ==============================
// CALLBACK (FRONTEND REDIRECT)
// ==============================
exports.paymentCallback = async (req, res) => {
  try {
    const { reference } = req.query;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    const paymentData = response.data.data;

    if (paymentData.status !== "success") {
      return res.send("Payment failed");
    }

    const orderId = paymentData.metadata?.orderId;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.send("Order not found");
    }

    if (order.status === "paid") {
      return res.send(`
        <h1>Payment already verified</h1>
        <a href="/">Return to ChatBot</a>
      `);
    }

    order.status = "paid";
    order.paymentReference = reference;
    order.paidAt = new Date();

    await order.save();

    return res.send(`
      <h1>Payment Successful ✅</h1>
      <a href="/">Return to ChatBot</a>
    `);

  } catch (error) {
    console.log("CALLBACK ERROR:", error.response?.data || error.message);
    return res.status(500).send("Verification failed");
  }
};


// ==============================
// WEBHOOK (SECURE PAYSTACK)
// ==============================
exports.verifyWebhook = async (req, res) => {
  try {
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(req.body)
      .digest("hex");

    const signature = req.headers["x-paystack-signature"];

    if (hash !== signature) {
      return res.status(401).send("Invalid signature");
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === "charge.success") {
      const paymentData = event.data;

      const orderId = paymentData.metadata?.orderId;

      const order = await Order.findById(orderId);

      if (!order || order.status === "paid") {
        return res.sendStatus(200);
      }

      order.status = "paid";
      order.paymentReference = paymentData.reference;
      order.paidAt = new Date();

      await order.save();

      console.log("Webhook payment verified ✅");
    }

    return res.sendStatus(200);

  } catch (error) {
    console.log("WEBHOOK ERROR:", error.message);
    return res.sendStatus(500);
  }
};