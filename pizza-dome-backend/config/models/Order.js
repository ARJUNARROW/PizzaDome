const mongoose = require("mongoose");

// ── Sub-schema: individual cart item ─────────────────────────────────────────
const orderItemSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    emoji: { type: String, default: "🍕" },
    size: { type: String, default: "Regular" },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },   // unit price
    total: { type: Number, required: true, min: 0 },   // price * qty + addons
    addons: [{ type: String, trim: true }],
  },
  { _id: false }
);

// ── Main Order schema ─────────────────────────────────────────────────────────
const orderSchema = new mongoose.Schema(
  {
    // Payment identifiers
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },

    // Cart snapshot
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Order must contain at least one item.",
      },
    },

    // Financials — stored in PAISE (Razorpay standard)
    amountPaise: { type: Number, required: true, min: 100 },
    amountRupees: { type: Number, required: true, min: 1 },

    // Lifecycle
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
      index: true,
    },

    // Optional customer info (extend later with auth)
    customerNote: { type: String, default: "" },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
    toJSON: { virtuals: true },
  }
);

// ── Virtual: human-readable summary ──────────────────────────────────────────
orderSchema.virtual("itemCount").get(function () {
  return this.items.reduce((sum, i) => sum + i.qty, 0);
});

// ── Static: find paid orders ──────────────────────────────────────────────────
orderSchema.statics.findPaid = function () {
  return this.find({ status: "paid" }).sort({ createdAt: -1 });
};

module.exports = mongoose.model("Order", orderSchema);
