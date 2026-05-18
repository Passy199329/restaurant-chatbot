const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    sessionId: String,

    items: [
      {
        name: String,
        price: Number,
      },
    ],

    totalAmount: {
      type: Number,
      default: 0,
    },

    customerEmail: String,

    paymentReference: String,

    paidAt: Date,

    scheduledTime: Date,

    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);