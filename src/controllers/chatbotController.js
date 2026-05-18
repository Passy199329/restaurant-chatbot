const menu = require("../utils/menuData");
const calculateTotal = require("../utils/calculateTotal");
const generateResponse = require("../utils/generateResponse");
const { getWelcomeMessage, getMenu } = require("../services/chatbotService");
const Order = require("../models/Order");
const baseUrl = process.env.BASE_URL || "http://localhost:5000";
exports.chatBot = async (req, res) => {
  try {

    const { message } = req.body;

    // INIT SESSION CART
    if (!req.session.cart) {
      req.session.cart = [];
    }

    // WELCOME
    if (!message || message === "welcome") {
      return res.json(generateResponse(getWelcomeMessage()));
    }

    // SHOW MENU
    if (message === "1") {
      return res.json(generateResponse(getMenu()));
    }

    // ADD ITEM
    const item = menu.find(m => m.code === Number(message));

    if (item) {
      req.session.cart.push(item);

      return res.json(
        generateResponse(`${item.name} added to cart ✅`)
      );
    }

    // CURRENT ORDER
    if (message === "97") {

      if (req.session.cart.length === 0) {
        return res.json(generateResponse("🛒 No current order"));
      }

      let text = "🛒 Current Order\n\n";
      let total = 0;

      req.session.cart.forEach(i => {
        text += `${i.name} - ₦${i.price}\n`;
        total += i.price;
      });

      text += `\nTotal: ₦${total}`;

      return res.json(generateResponse(text));
    }

    // CANCEL
    if (message === "0") {
      req.session.cart = [];
      return res.json(generateResponse("❌ Order cancelled"));
    }

    // CHECKOUT
    if (message === "99") {

      if (req.session.cart.length === 0) {
        return res.json(generateResponse("🛒 No order to place"));
      }

      const total = calculateTotal(req.session.cart);

      const order = await Order.create({
        sessionId: req.sessionID,
        items: req.session.cart,
        totalAmount: total,
        status: "pending"
      });

      req.session.cart = [];

      return res.json({
        reply: `✅ Order placed successfully\nTotal: ₦${total}`,
        paymentUrl: `${baseUrl}/api/payment/pay/${order._id}`
      });
    }

    // HISTORY
    if (message === "98") {
      const orders = await Order.find({ sessionId: req.sessionID });

      if (!orders.length) {
        return res.json(generateResponse("📦 No order history"));
      }

      let text = "📦 Order History\n\n";

      orders.forEach((o, i) => {
        text += `Order ${i + 1}: ₦${o.totalAmount} (${o.status})\n`;
      });

      return res.json(generateResponse(text));
    }

    return res.json(generateResponse("❌ Invalid option"));

  } catch (err) {
    console.log(err);
    return res.status(500).json({ reply: "Server error" });
  }
};