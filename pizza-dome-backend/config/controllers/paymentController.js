const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Order = require("../models/Order");

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payment/create-order
// Creates a Razorpay order and stores a pending record in MongoDB.
// ─────────────────────────────────────────────────────────────────────────────
const createOrder = async (req, res, next) => {
  try {
    const { amount, items } = req.body;

    // amount arrives as rupees from frontend → convert to paise
    const amountPaise = Math.round(amount * 100);

    if (amountPaise < 100) {
      return res.status(400).json({
        success: false,
        message: "Minimum order amount is ₹1.",
      });
    }

    // 1️⃣ Create order on Razorpay
    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        source: "pizza-dome-app",
        itemCount: items?.length ?? 0,
      },
    });

    // 2️⃣ Persist a "created" order in MongoDB (payment not yet confirmed)
    const order = await Order.create({
      razorpayOrderId: razorpayOrder.id,
      items: items || [],
      amountPaise,
      amountRupees: amount,
      status: "created",
    });

    // 3️⃣ Return everything the frontend Razorpay SDK needs
    return res.status(201).json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      dbOrderId: order._id, // useful if you add order-tracking later
    });
  } catch (error) {
    next(error); // passed to global error handler
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payment/verify
// Verifies Razorpay HMAC signature, marks order as paid, and updates MongoDB.
// ─────────────────────────────────────────────────────────────────────────────
const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      amount,
    } = req.body;

    // ── 1. Signature Verification (HMAC-SHA256) ─────────────────────────────
    // Razorpay signs: "{order_id}|{payment_id}" with your Key Secret
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isAuthentic = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isAuthentic) {
      // Mark the order as failed in DB for audit trail
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed" }
      );

      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }

    // ── 2. Update order to "paid" ────────────────────────────────────────────
    const updatedOrder = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
        // Refresh items/amount in case frontend sends updated snapshot
        ...(items && { items }),
        ...(amount && {
          amountRupees: amount,
          amountPaise: Math.round(amount * 100),
        }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found. Cannot verify payment.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified. Order confirmed! 🍕",
      orderId: updatedOrder._id,
      paymentId: razorpay_payment_id,
      amount: updatedOrder.amountRupees,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payment/order/:id  (bonus utility endpoint)
// Fetch a single order by MongoDB _id — useful for order-tracking page.
// ─────────────────────────────────────────────────────────────────────────────
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).lean();

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, verifyPayment, getOrder };
