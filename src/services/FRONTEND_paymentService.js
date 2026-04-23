// src/services/paymentService.js
// ─────────────────────────────────────────────────────────────────────────────
// Drop this file in your React project at:  src/services/paymentService.js
// It handles the full Razorpay payment flow end-to-end.
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = "http://localhost:5000/api";

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Ask backend to create a Razorpay order
// ─────────────────────────────────────────────────────────────────────────────
export const createRazorpayOrder = async (amount, items) => {
  const res = await fetch(`${API_BASE}/payment/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, items }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to create order.");
  }

  return data.order; // { id, amount, currency }
};

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Verify payment with backend after Razorpay popup success
// ─────────────────────────────────────────────────────────────────────────────
export const verifyRazorpayPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  items,
  amount,
}) => {
  const res = await fetch(`${API_BASE}/payment/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      amount,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Payment verification failed.");
  }

  return data; // { success, orderId, paymentId, amount }
};

// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — Load Razorpay script dynamically (call once on app mount)
// ─────────────────────────────────────────────────────────────────────────────
export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ─────────────────────────────────────────────────────────────────────────────
// Main exported function — call this when user clicks "Proceed to Payment"
//
// Usage in your component:
//   await handleRazorpayPayment({ cart, totalAmount, onSuccess, onFailure });
// ─────────────────────────────────────────────────────────────────────────────
export const handleRazorpayPayment = async ({
  cart,           // array of cart items (from your React state)
  totalAmount,    // number in rupees  e.g. 799
  onSuccess,      // callback(responseData) — clear cart, show success screen
  onFailure,      // callback(errorMessage) — show error toast/modal
}) => {
  try {
    // 1. Load SDK
    const loaded = await loadRazorpayScript();
    if (!loaded) throw new Error("Razorpay SDK failed to load. Check your connection.");

    // 2. Create order on your backend
    const order = await createRazorpayOrder(totalAmount, cart);

    // 3. Configure the Razorpay checkout popup
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from frontend .env
      amount: order.amount,                        // in paise (backend already set this)
      currency: order.currency,
      name: "Pizza Dome 🍕",
      description: `Order of ${cart.length} item(s)`,
      image: "https://via.placeholder.com/80?text=🍕",
      order_id: order.id,

      // 4. On payment success — verify with your backend
      handler: async (response) => {
        try {
          const verifyData = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            items: cart,
            amount: totalAmount,
          });

          onSuccess(verifyData);
        } catch (verifyErr) {
          onFailure(verifyErr.message);
        }
      },

      prefill: {
        name: "",    // fill from user profile if you have auth
        email: "",
        contact: "",
      },

      theme: {
        color: "#1a8fd1", // matches Pizza Dome brand blue
      },

      modal: {
        ondismiss: () => {
          console.log("Payment modal closed by user.");
        },
      },
    };

    const rzp = new window.Razorpay(options);

    // Handle payment failure inside the popup (e.g. wrong card)
    rzp.on("payment.failed", (response) => {
      onFailure(response.error.description || "Payment failed. Please retry.");
    });

    rzp.open();
  } catch (error) {
    onFailure(error.message);
  }
};
