const Razorpay = require("razorpay");

// Singleton Razorpay instance — initialised once, reused everywhere
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpay;
