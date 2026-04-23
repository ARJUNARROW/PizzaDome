// ─────────────────────────────────────────────────────────────────────────────
// Global Error Handler — must be registered LAST in server.js
// Catches anything passed via next(error) from controllers.
// ─────────────────────────────────────────────────────────────────────────────
const errorHandler = (err, req, res, next) => {
  // Log full stack in dev, just message in prod
  if (process.env.NODE_ENV !== "production") {
    console.error("\n❌ ERROR:", err.stack || err.message);
  } else {
    console.error("❌ ERROR:", err.message);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(422).json({
      success: false,
      message: "Database validation failed.",
      errors: messages,
    });
  }

  // Mongoose duplicate key (e.g. duplicate razorpayOrderId)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate value for field: ${field}.`,
    });
  }

  // Mongoose cast error (bad ObjectId format)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for field: ${err.path}.`,
    });
  }

  // Razorpay API errors come with a statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.error?.description || "Razorpay error occurred.",
    });
  }

  // Fallback — 500 Internal Server Error
  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong. Please try again."
        : err.message,
  });
};

module.exports = errorHandler;
