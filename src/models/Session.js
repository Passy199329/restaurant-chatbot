const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    sessionId: String,

    currentOrder: [
      {
        name: String,
        price: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Session", sessionSchema);