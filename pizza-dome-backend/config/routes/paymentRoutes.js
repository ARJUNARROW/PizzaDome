const express = require("express");
const { body, param } = require("express-validator");
const {
  createOrder,
  verifyPayment,
  getOrder,
} = require("../controllers/paymentController");
const validate = require("../middleware/validate");

const router = express.Router();

// ── POST /api/payment/create-order ───────────────────────────────────────────
router.post(
  "/create-order",
  [
    body("amount")
      .isFloat({ min: 1 })
      .withMessage("Amount must be a positive number (in rupees)."),

    body("items")
      .isArray({ min: 1 })
      .withMessage("Cart must contain at least one item."),

    body("items.*.name")
      .isString()
      .notEmpty()
      .withMessage("Each item must have a name."),

    body("items.*.qty")
      .isInt({ min: 1 })
      .withMessage("Item quantity must be at least 1."),

    body("items.*.total")
      .isFloat({ min: 0 })
      .withMessage("Item total must be a non-negative number."),
  ],
  validate,
  createOrder
);

// ── POST /api/payment/verify ─────────────────────────────────────────────────
router.post(
  "/verify",
  [
    body("razorpay_order_id")
      .isString()
      .notEmpty()
      .withMessage("razorpay_order_id is required."),

    body("razorpay_payment_id")
      .isString()
      .notEmpty()
      .withMessage("razorpay_payment_id is required."),

    body("razorpay_signature")
      .isString()
      .notEmpty()
      .withMessage("razorpay_signature is required."),

    body("amount")
      .optional()
      .isFloat({ min: 1 })
      .withMessage("Amount must be a positive number."),
  ],
  validate,
  verifyPayment
);

// ── GET /api/payment/order/:id ───────────────────────────────────────────────
router.get(
  "/order/:id",
  [
    param("id").isMongoId().withMessage("Invalid order ID format."),
  ],
  validate,
  getOrder
);

module.exports = router;
