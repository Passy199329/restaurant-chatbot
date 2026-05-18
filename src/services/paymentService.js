const axios = require("axios");

const initializePayment = async (payload) => {

  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    payload,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

module.exports = {
  initializePayment,
};