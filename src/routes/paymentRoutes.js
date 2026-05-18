const express = require("express");

const router = express.Router();

const {
  makePayment,
  paymentCallback,
  verifyWebhook,
} = require("../controllers/paymentController");


router.get(
  "/pay/:orderId",
  makePayment
);

router.get(
  "/callback",
  paymentCallback
);

router.post(
  "/webhook",
  express.raw({ type: "*/*" }),
  verifyWebhook
);

module.exports = router;