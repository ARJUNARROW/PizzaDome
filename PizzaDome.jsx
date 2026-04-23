
import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const MENU = {
  veg: [
    { id: 1, name: "Margherita Supreme", price: 299, emoji: "🍕", desc: "Classic tomato, mozzarella, fresh basil", tag: "Bestseller" },
    { id: 2, name: "Paneer Tikka Dome", price: 349, emoji: "🧀", desc: "Tandoori paneer, capsicum, onion, smoky sauce", tag: "Chef's Pick" },
    { id: 3, name: "Garden Fresh", price: 279, emoji: "🥦", desc: "Broccoli, zucchini, bell peppers, pesto", tag: null },
    { id: 4, name: "Corn & Jalapeño", price: 319, emoji: "🌽", desc: "Sweet corn, jalapeño, cream cheese, oregano", tag: "Spicy" },
    { id: 5, name: "Four Cheese Melt", price: 399, emoji: "🫕", desc: "Mozzarella, cheddar, gouda, parmesan blend", tag: "Premium" },
    { id: 6, name: "Mushroom Forest", price: 329, emoji: "🍄", desc: "Wild mushroom medley, truffle oil, thyme", tag: null },
  ],
  nonveg: [
    { id: 7, name: "Chicken Inferno", price: 399, emoji: "🔥", desc: "Grilled chicken, ghost pepper sauce, jalapeños", tag: "Hot🔥" },
    { id: 8, name: "Pepperoni Blaze", price: 379, emoji: "🥩", desc: "Double pepperoni, mozzarella, marinara", tag: "Bestseller" },
    { id: 9, name: "BBQ Chicken Dome", price: 419, emoji: "🍗", desc: "Smoked BBQ chicken, caramelized onions, cheddar", tag: "Chef's Pick" },
    { id: 10, name: "Keema Spice", price: 389, emoji: "🫙", desc: "Spiced minced meat, onions, green chutney base", tag: "Desi Special" },
    { id: 11, name: "Prawn Coastal", price: 449, emoji: "🦐", desc: "Goan prawns, coconut cream sauce, curry leaves", tag: "Premium" },
    { id: 12, name: "Meat Overload", price: 469, emoji: "🥓", desc: "Chicken, pepperoni, salami, bacon all-in", tag: "Epic" },
  ],
  drinks: [
    { id: 13, name: "Blue Ocean Mojito", price: 129, emoji: "🫙", desc: "Blue curaçao, mint, lime, sparkling water", tag: "Signature", isDrink: true },
    { id: 14, name: "Strawberry Dome", price: 149, emoji: "🍓", desc: "Fresh strawberry, lychee, soda float", tag: "Instagram Pick", isDrink: true },
    { id: 15, name: "Mango Bliss", price: 119, emoji: "🥭", desc: "Alphonso mango, turmeric, coconut cream", tag: null, isDrink: true },
    { id: 16, name: "Cold Brew Premium", price: 159, emoji: "☕", desc: "18hr cold brew, oat milk, vanilla pod", tag: "Premium", isDrink: true },
    { id: 17, name: "Watermelon Mint Soda", price: 99, emoji: "🍉", desc: "Chilled watermelon, fresh mint, sea salt", tag: null, isDrink: true },
    { id: 18, name: "Virgin Colada", price: 139, emoji: "🥥", desc: "Coconut cream, pineapple, crushed ice", tag: "Fan Fav", isDrink: true },
  ],
};

const SIZES = [
  { label: '8"', name: "Regular", extra: 0 },
  { label: '12"', name: "Large", extra: 100 },
];

const ADDONS = [
  { id: "cheese", label: "Extra Cheese", price: 49, emoji: "🧀" },
  { id: "jalapeno", label: "Jalapeños", price: 29, emoji: "🌶️" },
  { id: "olives", label: "Olives", price: 39, emoji: "🫒" },
  { id: "paneer", label: "Paneer", price: 59, emoji: "🧱" },
  { id: "chicken", label: "Chicken", price: 79, emoji: "🍗" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function useIsMobile(breakpoint = 768) {
  const getValue = () => (typeof window !== "undefined" ? window.innerWidth <= breakpoint : false);
  const [isMobile, setIsMobile] = useState(getValue);

  useEffect(() => {
    const onResize = () => setIsMobile(getValue());
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}

// ─── LOADER ──────────────────────────────────────────────────────────────────
function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let v = 0;
    const t = setInterval(() => {
      v += Math.random() * 14 + 4;
      if (v >= 100) { v = 100; clearInterval(t); setTimeout(onDone, 400); }
      setPct(Math.min(v, 100));
    }, 80);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#e8f4fd", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 9999, fontFamily: "'Syne', sans-serif" }}>
      <div style={{ fontSize: 80, animation: "spinPizza 1.2s linear infinite", display: "inline-block", filter: "drop-shadow(0 0 24px #57b8f8)" }}>🍕</div>
      <div style={{ marginTop: 24, fontSize: 28, fontWeight: 800, letterSpacing: "-1px", color: "#0a3d62", background: "linear-gradient(135deg,#0a3d62,#1a8fd1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PIZZA DOME</div>
      <div style={{ marginTop: 20, width: 220, height: 4, background: "#cce7fa", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#1a8fd1,#57b8f8)", borderRadius: 99, transition: "width 0.1s" }} />
      </div>
      <div style={{ marginTop: 10, fontSize: 13, color: "#1a8fd1", fontWeight: 600, letterSpacing: 2 }}>LOADING… {Math.round(pct)}%</div>
      <style>{`@keyframes spinPizza { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({ cartCount, onCartOpen, darkMode, setDarkMode }) {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const bg = darkMode
    ? scrolled ? "rgba(8,18,30,0.92)" : "transparent"
    : scrolled ? "rgba(255,255,255,0.85)" : "transparent";

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, width: "100%", boxSizing: "border-box", zIndex: 100, padding: isMobile ? "calc(10px + env(safe-area-inset-top, 0px)) 16px 12px" : "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: isMobile ? 8 : 20, backdropFilter: scrolled ? "blur(20px)" : "none", background: bg, borderBottom: scrolled ? `1px solid ${darkMode ? "rgba(90,170,255,0.15)" : "rgba(0,90,180,0.08)"}` : "none", transition: "all 0.4s", boxShadow: scrolled ? "0 4px 32px rgba(26,143,209,0.08)" : "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 10, cursor: "pointer", minWidth: 0, flexShrink: 1 }}>
        <span style={{ fontSize: isMobile ? 22 : 26, flexShrink: 0 }}>🍕</span>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: isMobile ? 18 : 22, letterSpacing: "-0.5px", background: "linear-gradient(135deg,#0a3d62,#1a8fd1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>PIZZA DOME</span>
      </div>
      <div style={{ display: "flex", gap: isMobile ? 6 : 8, alignItems: "center", flexShrink: 0 }}>
        {!isMobile && ["Menu", "About", "Track"].map(n => (
          <a key={n} href="#" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14, color: darkMode ? "#a0c8f0" : "#0a3d62", padding: "6px 14px", borderRadius: 99, textDecoration: "none", transition: "all 0.2s", opacity: 0.85 }}>{n}</a>
        ))}
        <button onClick={() => setDarkMode(d => !d)} style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.55)", border: "none", borderRadius: "50%", width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, cursor: "pointer", fontSize: 18, opacity: 0.9, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: scrolled ? "0 6px 18px rgba(26,143,209,0.12)" : "none" }}>{darkMode ? "☀️" : "🌙"}</button>
        <button onClick={onCartOpen} style={{ position: "relative", background: "linear-gradient(135deg,#1a8fd1,#0d6eac)", border: "none", borderRadius: 99, padding: isMobile ? "10px 14px" : "10px 20px", minWidth: isMobile ? 80 : "auto", cursor: "pointer", color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 4px 20px rgba(26,143,209,0.35)", transition: "transform 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <span style={{ fontSize: 16 }}>🛒</span>
          <span>{isMobile ? `Cart${cartCount ? ` (${cartCount})` : ""}` : "Cart"}</span>
          {cartCount > 0 && <span style={{ background: "#ff4757", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, position: "absolute", top: -5, right: -5 }}>{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ darkMode, onOrderNow, onExplore }) {
  const [offset, setOffset] = useState(0);
  const isMobile = useIsMobile();
  useEffect(() => {
    const fn = () => setOffset(window.scrollY * 0.4);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const bg = darkMode
    ? "linear-gradient(160deg, #060e1a 0%, #0a1f35 40%, #07152b 100%)"
    : "linear-gradient(160deg, #dff0fc 0%, #b8dcf8 40%, #e8f6ff 100%)";
  return (
    <section style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: isMobile ? "calc(108px + env(safe-area-inset-top, 0px))" : 80, paddingBottom: isMobile ? 40 : 0 }}>
      {/* BG Orbs */}
      {[
        { size: isMobile ? 360 : 600, x: isMobile ? "84%" : "70%", y: "10%", color: "rgba(26,143,209,0.12)", delay: 0 },
        { size: isMobile ? 260 : 400, x: isMobile ? "10%" : "10%", y: isMobile ? "62%" : "60%", color: "rgba(87,184,248,0.1)", delay: 1 },
        { size: isMobile ? 220 : 300, x: isMobile ? "88%" : "85%", y: isMobile ? "80%" : "70%", color: "rgba(10,61,98,0.08)", delay: 2 },
      ].map((o, i) => (
        <div key={i} style={{ position: "absolute", width: o.size, height: o.size, borderRadius: "50%", background: `radial-gradient(circle, ${o.color}, transparent 70%)`, left: o.x, top: o.y, transform: "translate(-50%,-50%)", animation: `floatOrb ${6 + i}s ease-in-out infinite alternate`, animationDelay: `${o.delay}s`, pointerEvents: "none" }} />
      ))}

      {/* Floating pizza rings */}
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{ position: "absolute", width: (isMobile ? 90 : 120) + i * (isMobile ? 56 : 80), height: (isMobile ? 90 : 120) + i * (isMobile ? 56 : 80), borderRadius: "50%", border: `1px solid rgba(26,143,209,${0.12 - i * 0.03})`, left: isMobile ? "50%" : `${15 + i * 5}%`, top: isMobile ? `${30 + i * 3}%` : `${20 + i * 10}%`, transform: isMobile ? "translateX(-50%)" : undefined, animation: `spinSlow ${20 + i * 8}s linear infinite`, pointerEvents: "none" }} />
      ))}

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 18px" : "0 24px", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: isMobile ? 28 : 40 }}>
        {/* Left text */}
        <div style={{ flex: "1 1 440px", maxWidth: 540, width: "100%", textAlign: isMobile ? "center" : "left", order: isMobile ? 2 : 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: darkMode ? "rgba(26,143,209,0.15)" : "rgba(26,143,209,0.1)", border: "1px solid rgba(26,143,209,0.25)", borderRadius: 99, padding: "6px 16px", marginBottom: isMobile ? 18 : 24, backdropFilter: "blur(8px)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a8fd1", boxShadow: "0 0 8px #1a8fd1", animation: "pulse 1.5s infinite" }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: "#1a8fd1", letterSpacing: 1 }}>NOW OPEN · MUMBAI</span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: isMobile ? "clamp(34px, 11vw, 52px)" : "clamp(42px, 6vw, 76px)", lineHeight: 1.05, letterSpacing: isMobile ? "-1.4px" : "-2px", color: darkMode ? "#e8f4fd" : "#0a3d62", marginBottom: 16 }}>
            First Slice,<br />
            <span style={{ background: "linear-gradient(135deg,#1a8fd1,#57b8f8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Forever Love</span>
            <span style={{ display: "inline-block", marginLeft: 12, animation: "bounce 1.5s infinite" }}>🍕</span>
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 16 : 18, color: darkMode ? "#7aaecf" : "#3a6d94", lineHeight: 1.7, marginBottom: isMobile ? 26 : 36, maxWidth: isMobile ? 320 : 420, marginInline: isMobile ? "auto" : undefined }}>
            Street-style artisan pizza with a premium twist. Crafted live, delivered fresh, and built to blow your mind.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
            <button onClick={onOrderNow} style={{ background: "linear-gradient(135deg,#1a8fd1,#0d6eac)", color: "#fff", border: "none", borderRadius: 99, padding: isMobile ? "15px 24px" : "16px 36px", minWidth: isMobile ? 150 : "auto", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 8px 32px rgba(26,143,209,0.45)", transition: "all 0.25s", letterSpacing: 0.5 }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px) scale(1.03)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(26,143,209,0.55)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(26,143,209,0.45)"; }}
            >Order Now ⚡</button>
            <button onClick={onExplore} style={{ background: "transparent", color: darkMode ? "#57b8f8" : "#1a8fd1", border: `2px solid ${darkMode ? "rgba(87,184,248,0.4)" : "rgba(26,143,209,0.3)"}`, borderRadius: 99, padding: isMobile ? "13px 22px" : "14px 32px", minWidth: isMobile ? 150 : "auto", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer", backdropFilter: "blur(8px)", transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.background = darkMode ? "rgba(87,184,248,0.1)" : "rgba(26,143,209,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
            >Explore Menu 🍽️</button>
          </div>
          {/* Stats */}
          <div style={{ display: "flex", gap: isMobile ? 18 : 32, marginTop: isMobile ? 30 : 48, flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
            {[["4.9★", "Rating"], ["50K+", "Orders"], ["20 Min", "Delivery"]].map(([val, lbl]) => (
              <div key={lbl} style={{ minWidth: isMobile ? 84 : "auto" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: isMobile ? 22 : 26, color: darkMode ? "#57b8f8" : "#0a3d62" }}>{val}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: darkMode ? "#5a8aaa" : "#5a8aaa", marginTop: 2 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right – Big pizza emoji visual */}
        <div style={{ flex: "1 1 340px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", order: isMobile ? 1 : 2, paddingInline: isMobile ? 8 : 0 }}>
          <div style={{ width: isMobile ? 260 : 320, height: isMobile ? 260 : 320, borderRadius: "50%", background: darkMode ? "rgba(26,143,209,0.08)" : "rgba(26,143,209,0.07)", border: `2px solid rgba(26,143,209,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 80px rgba(26,143,209,0.18)", animation: "floatBig 4s ease-in-out infinite alternate", position: "relative" }}>
            <div style={{ position: "absolute", inset: isMobile ? 16 : 20, borderRadius: "50%", border: "1px solid rgba(26,143,209,0.15)", animation: "spinSlow 20s linear infinite" }} />
            <span style={{ fontSize: isMobile ? 132 : 160, filter: "drop-shadow(0 12px 40px rgba(26,143,209,0.3))" }}>🍕</span>
          </div>
          {/* floating badges */}
          {[
            { emoji: "🔥", text: "Fresh Daily", top: isMobile ? "6%" : "8%", left: isMobile ? "0%" : "-5%" },
            { emoji: "⚡", text: "20 Min", top: isMobile ? "76%" : "75%", left: isMobile ? "0%" : "-8%" },
            { emoji: "🌶️", text: "Craft Spice", top: isMobile ? "6%" : "12%", right: isMobile ? "0%" : "-5%" },
            { emoji: "🧀", text: "Real Cheese", top: isMobile ? "76%" : "72%", right: isMobile ? "0%" : "-6%" },
          ].map((b, i) => (
            <div key={i} style={{ position: "absolute", top: b.top, left: b.left, right: b.right, background: darkMode ? "rgba(8,20,36,0.85)" : "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", border: `1px solid ${darkMode ? "rgba(87,184,248,0.2)" : "rgba(26,143,209,0.15)"}`, borderRadius: 12, padding: isMobile ? "7px 10px" : "8px 14px", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 8px 32px rgba(26,143,209,0.12)", animation: `floatOrb ${4 + i}s ease-in-out infinite alternate`, maxWidth: isMobile ? 126 : "none" }}>
              <span style={{ fontSize: 18 }}>{b.emoji}</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: isMobile ? 11 : 12, color: darkMode ? "#a0c8f0" : "#0a3d62", whiteSpace: "nowrap" }}>{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      {!isMobile && <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.5, animation: "bounce 2s infinite" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: darkMode ? "#57b8f8" : "#1a8fd1", letterSpacing: 2, fontWeight: 600 }}>SCROLL</span>
        <span style={{ fontSize: 18 }}>↓</span>
      </div>}

      <style>{`
        @keyframes floatOrb { from { transform: translateY(0) scale(1); } to { transform: translateY(-8px) scale(1.04); } }
        @keyframes floatBig { from { transform: translateY(0); } to { transform: translateY(-16px); } }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; box-shadow: 0 0 8px #1a8fd1; } 50% { opacity:0.5; box-shadow: 0 0 20px #1a8fd1; } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
    </section>
  );
}

// ─── LIVE SECTION ─────────────────────────────────────────────────────────────
function LiveSection({ darkMode }) {
  const [ref, inView] = useInView();
  const isMobile = useIsMobile();
  const isTablet = useIsMobile(1024);
  const bg = darkMode ? "linear-gradient(160deg,#060e1a,#0a1f35)" : "linear-gradient(160deg,#f0f8ff,#e0f2fe)";
  return (
    <section ref={ref} style={{ background: bg, padding: isMobile ? "72px 16px" : isTablet ? "88px 20px" : "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", gap: isMobile ? 36 : isTablet ? 48 : 60, flexWrap: "wrap" }}>
        {/* Oven animation */}
        <div style={{ flex: "1 1 320px", display: "flex", justifyContent: "center", width: "100%" }}>
          <div style={{ position: "relative", width: isMobile ? 260 : isTablet ? 280 : 300, height: isMobile ? 260 : isTablet ? 280 : 300 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: darkMode ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.1)", border: `2px solid rgba(26,143,209,0.25)`, backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>
              <video autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}>
                <source src="/video/PizaadomeV.mp4" type="video/mp4" />
              </video>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)" }} />
            </div>
            {/* Glow ring */}
            <div style={{ position: "absolute", inset: -2, borderRadius: 26, border: "2px solid rgba(255,120,0,0.15)", animation: "pulseRing 2s ease-in-out infinite" }} />
            {/* Live badge */}
            <div style={{ position: "absolute", top: isMobile ? -10 : -14, right: isMobile ? 6 : -14, background: "#ff4757", color: "#fff", borderRadius: 99, padding: isMobile ? "4px 10px" : "4px 12px", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: 1, display: "flex", alignItems: "center", gap: 5, boxShadow: "0 4px 16px rgba(255,71,87,0.4)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", animation: "pulse 1s infinite" }} />LIVE
            </div>
          </div>
        </div>
        {/* Text */}
        <div style={{ flex: "1 1 360px", maxWidth: isMobile ? 420 : 520, textAlign: isMobile ? "center" : "left", opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(40px)", transition: "all 0.8s ease" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#1a8fd1", letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>Open Kitchen</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.1, letterSpacing: "-1.5px", color: darkMode ? "#e8f4fd" : "#0a3d62", marginBottom: 20 }}>
            Freshly Made<br />
            <span style={{ background: "linear-gradient(135deg,#ff6b35,#ff4757)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>In Front of You</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 16 : 17, color: darkMode ? "#7aaecf" : "#3a6d94", lineHeight: 1.75, marginBottom: isMobile ? 26 : 32, maxWidth: isMobile ? 340 : 400, marginInline: isMobile ? "auto" : undefined }}>
            Watch your pizza come alive — from dough to dome. Our open kitchen is a show of mastery, speed, and passion.
          </p>
          {[
            { emoji: "🌡️", text: "Wood-fire oven at 450°C for perfect char" },
            { emoji: "⏱️", text: "Prepped and ready in under 12 minutes" },
            { emoji: "📹", text: "Live feed available at our counters" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, maxWidth: isMobile ? 340 : "none", marginInline: isMobile ? "auto" : undefined, opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(30px)", transition: `all 0.7s ease ${0.2 + i * 0.1}s` }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: darkMode ? "rgba(26,143,209,0.1)" : "rgba(26,143,209,0.08)", border: "1px solid rgba(26,143,209,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{f.emoji}</div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: darkMode ? "#a0c8f0" : "#1a4a6e", flex: 1, lineHeight: 1.4, textAlign: "left" }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes flame { from { transform: scaleY(1) translateY(0); } to { transform: scaleY(1.3) translateY(-8px); } }
        @keyframes pulseRing { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
      `}</style>
    </section>
  );
}

// ─── MENU CARD ────────────────────────────────────────────────────────────────
function MenuCard({ item, onCustomize, onDirectAdd, darkMode }) {
  const [hover, setHover] = useState(false);
  const isMobile = useIsMobile();
  const isGlass = darkMode
    ? { background: hover ? "rgba(26,50,80,0.95)" : "rgba(15,30,55,0.85)", border: `1px solid ${hover ? "rgba(87,184,248,0.4)" : "rgba(87,184,248,0.15)"}` }
    : { background: hover ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.75)", border: `1px solid ${hover ? "rgba(26,143,209,0.3)" : "rgba(26,143,209,0.12)"}` };

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...isGlass, borderRadius: 20, padding: isMobile ? "22px 18px" : "24px 20px", backdropFilter: "blur(16px)", boxShadow: hover && !isMobile ? "0 20px 60px rgba(26,143,209,0.18)" : "0 4px 24px rgba(26,143,209,0.07)", transition: "all 0.3s cubic-bezier(.22,.61,.36,1)", transform: hover && !isMobile ? "translateY(-6px)" : "translateY(0)", cursor: "pointer" }}>
      {/* Emoji */}
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <span style={{ fontSize: isMobile ? 56 : 64, display: "inline-block", transition: "transform 0.3s", transform: hover && !isMobile ? "scale(1.15) rotate(-5deg)" : "scale(1)" }}>{item.emoji}</span>
      </div>
      {/* Tag */}
      {item.tag && <div style={{ display: "inline-block", background: "linear-gradient(135deg,#1a8fd1,#57b8f8)", color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: 1.5, padding: "3px 10px", borderRadius: 99, marginBottom: 8, fontFamily: "'Syne', sans-serif", textTransform: "uppercase" }}>{item.tag}</div>}
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: isMobile ? 16 : 17, color: darkMode ? "#e8f4fd" : "#0a3d62", marginBottom: 6, lineHeight: 1.3 }}>{item.name}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 12.5 : 13, color: darkMode ? "#7aaecf" : "#5a8aaa", lineHeight: 1.6, marginBottom: 16 }}>{item.desc}</p>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", justifyContent: "space-between", gap: isMobile ? 12 : 16 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20, color: "#1a8fd1" }}>₹{item.price}</span>
        <button onClick={() => item.isDrink ? onDirectAdd(item) : onCustomize(item)}
          style={{ background: "linear-gradient(135deg,#1a8fd1,#0d6eac)", color: "#fff", border: "none", borderRadius: 99, padding: isMobile ? "10px 16px" : "8px 18px", width: isMobile ? "100%" : "auto", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 16px rgba(26,143,209,0.3)", transition: "all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >+ Add</button>
      </div>
    </div>
  );
}

// ─── MENU SECTION ─────────────────────────────────────────────────────────────
function MenuSection({ darkMode, onCustomize, onDirectAdd }) {
  const [tab, setTab] = useState("veg");
  const [ref, inView] = useInView();
  const isMobile = useIsMobile();
  const isTablet = useIsMobile(1024);
  const bg = darkMode ? "linear-gradient(160deg,#07152b,#060e1a)" : "linear-gradient(160deg,#f8fbff,#eaf5ff)";
  const tabs = [{ key: "veg", label: "🥦 Veg" }, { key: "nonveg", label: "🍗 Non-Veg" }, { key: "drinks", label: "🥤 Drinks" }];

  return (
    <section id="menu" ref={ref} style={{ background: bg, padding: isMobile ? "72px 16px" : isTablet ? "88px 20px" : "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 36 : 60, opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: "all 0.7s ease" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#1a8fd1", letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>Our Menu</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.1, letterSpacing: "-1.5px", color: darkMode ? "#e8f4fd" : "#0a3d62", marginBottom: 16 }}>
            Pick Your <span style={{ background: "linear-gradient(135deg,#1a8fd1,#57b8f8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Masterpiece</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 16 : 17, color: darkMode ? "#7aaecf" : "#3a6d94", maxWidth: isMobile ? 340 : 480, margin: "0 auto" }}>Every pizza is a canvas. Every bite is a story. Craft yours below.</p>
        </div>
        {/* Tabs */}
        <div style={{ display: isMobile ? "grid" : "flex", gridTemplateColumns: isMobile ? "repeat(3, minmax(0, 1fr))" : undefined, justifyContent: "center", gap: 8, marginBottom: isMobile ? 28 : 48, flexWrap: "wrap", width: "100%", maxWidth: isMobile ? 420 : "none", marginInline: "auto" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: isMobile ? 13 : 15, padding: isMobile ? "12px 8px" : "12px 28px", width: isMobile ? "100%" : "auto", borderRadius: 99, border: "none", cursor: "pointer", transition: "all 0.25s", background: tab === t.key ? "linear-gradient(135deg,#1a8fd1,#0d6eac)" : darkMode ? "rgba(26,143,209,0.1)" : "rgba(26,143,209,0.07)", color: tab === t.key ? "#fff" : darkMode ? "#57b8f8" : "#1a8fd1", boxShadow: tab === t.key ? "0 6px 24px rgba(26,143,209,0.35)" : "none", transform: tab === t.key ? "scale(1.05)" : "scale(1)" }}>
              {t.label}
            </button>
          ))}
        </div>
        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, minmax(0, 1fr))" : "repeat(auto-fill, minmax(280px,1fr))", gap: isMobile ? 16 : 24 }}>
          {MENU[tab].map((item, i) => (
            <div key={item.id} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `all 0.6s ease ${i * 0.06}s` }}>
              <MenuCard item={item} onCustomize={onCustomize} onDirectAdd={onDirectAdd} darkMode={darkMode} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CUSTOMISE MODAL ──────────────────────────────────────────────────────────
function CustomizeModal({ item, onClose, onAddToCart, darkMode }) {
  const [size, setSize] = useState(0);
  const [addons, setAddons] = useState({});
  const [qty, setQty] = useState(1);

  const addonTotal = Object.entries(addons).filter(([, v]) => v).reduce((s, [k]) => s + (ADDONS.find(a => a.id === k)?.price || 0), 0);
  const total = (item.price + SIZES[size].extra + addonTotal) * qty;

  const toggleAddon = id => setAddons(a => ({ ...a, [id]: !a[id] }));

  const bg = darkMode ? "rgba(6,14,26,0.97)" : "rgba(255,255,255,0.97)";
  const borderC = darkMode ? "rgba(87,184,248,0.2)" : "rgba(26,143,209,0.15)";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: bg, border: `1px solid ${borderC}`, borderRadius: "28px 28px 0 0", padding: "32px 28px 40px", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", animation: "slideUp 0.35s cubic-bezier(.22,.61,.36,1)", boxShadow: "0 -20px 80px rgba(26,143,209,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 44 }}>{item.emoji}</span>
              <div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20, color: darkMode ? "#e8f4fd" : "#0a3d62", margin: 0 }}>{item.name}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: darkMode ? "#7aaecf" : "#5a8aaa", margin: "4px 0 0" }}>{item.desc}</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", color: darkMode ? "#e8f4fd" : "#0a3d62" }}>×</button>
        </div>

        {/* Size */}
        <Label dark={darkMode}>Choose Size</Label>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {SIZES.map((s, i) => (
            <button key={i} onClick={() => setSize(i)} style={{ flex: 1, padding: "14px 8px", borderRadius: 14, border: `2px solid ${size === i ? "#1a8fd1" : darkMode ? "rgba(87,184,248,0.15)" : "rgba(26,143,209,0.15)"}`, background: size === i ? "linear-gradient(135deg,rgba(26,143,209,0.15),rgba(87,184,248,0.08))" : "transparent", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, color: size === i ? "#1a8fd1" : darkMode ? "#7aaecf" : "#3a6d94" }}>{s.label}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: darkMode ? "#5a8aaa" : "#8aaac0" }}>{s.name}</div>
              {s.extra > 0 && <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: "#1a8fd1", fontWeight: 700, marginTop: 2 }}>+₹{s.extra}</div>}
            </button>
          ))}
        </div>

        {/* Add-ons */}
        <Label dark={darkMode}>Add-ons</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
          {ADDONS.map(a => (
            <button key={a.id} onClick={() => toggleAddon(a.id)} style={{ padding: "8px 14px", borderRadius: 99, border: `1.5px solid ${addons[a.id] ? "#1a8fd1" : darkMode ? "rgba(87,184,248,0.2)" : "rgba(26,143,209,0.2)"}`, background: addons[a.id] ? "linear-gradient(135deg,rgba(26,143,209,0.18),rgba(87,184,248,0.1))" : "transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: addons[a.id] ? "#1a8fd1" : darkMode ? "#7aaecf" : "#3a6d94", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
              {a.emoji} {a.label} <span style={{ opacity: 0.7 }}>+₹{a.price}</span>
            </button>
          ))}
        </div>

        {/* Qty */}
        <Label dark={darkMode}>Quantity</Label>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          {[-1, qty, 1].map((v, i) => i === 1 ? (
            <span key="qty" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 26, color: darkMode ? "#e8f4fd" : "#0a3d62", minWidth: 32, textAlign: "center" }}>{qty}</span>
          ) : (
            <button key={i} onClick={() => setQty(q => Math.max(1, q + v))} style={{ width: 40, height: 40, borderRadius: "50%", border: `1.5px solid rgba(26,143,209,0.3)`, background: "transparent", cursor: "pointer", fontSize: 20, color: "#1a8fd1", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(26,143,209,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >{v === -1 ? "−" : "+"}</button>
          ))}
        </div>

        {/* Total + Add */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: darkMode ? "rgba(26,143,209,0.08)" : "rgba(26,143,209,0.05)", border: `1px solid rgba(26,143,209,0.12)`, borderRadius: 16, padding: "14px 18px", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: darkMode ? "#7aaecf" : "#5a8aaa" }}>Total Price</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 26, color: "#1a8fd1" }}>₹{total}</div>
          </div>
          <button onClick={() => { onAddToCart({ ...item, size: SIZES[size].name, addons: Object.keys(addons).filter(k => addons[k]).map(k => ADDONS.find(a => a.id === k).label), qty, price: Math.round(total / qty), total }); onClose(); }}
            style={{ background: "linear-gradient(135deg,#1a8fd1,#0d6eac)", color: "#fff", border: "none", borderRadius: 14, padding: "14px 28px", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 24px rgba(26,143,209,0.4)", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >Add to Cart 🛒</button>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity:0; } to { transform: translateY(0); opacity:1; } }`}</style>
    </div>
  );
}

function Label({ children, dark }) {
  return <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: dark ? "#57b8f8" : "#1a8fd1", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{children}</div>;
}

// ─── CART PANEL ───────────────────────────────────────────────────────────────
function CartPanel({ cart, onClose, onRemove, onCheckout, darkMode }) {
  const isMobile = useIsMobile();
  const total = cart.reduce((s, i) => s + i.total, 0);
  const bg = darkMode ? "rgba(6,14,26,0.98)" : "rgba(248,252,255,0.98)";
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 600, display: "flex", justifyContent: isMobile ? "center" : "flex-end", alignItems: isMobile ? "flex-end" : "stretch", background: "rgba(2,9,18,0.34)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: isMobile ? "100%" : 420, height: isMobile ? "min(82vh, 720px)" : "100%", background: bg, borderLeft: isMobile ? "none" : `1px solid ${darkMode ? "rgba(87,184,248,0.15)" : "rgba(26,143,209,0.12)"}`, borderTop: isMobile ? `1px solid ${darkMode ? "rgba(87,184,248,0.15)" : "rgba(26,143,209,0.12)"}` : "none", borderRadius: isMobile ? "26px 26px 0 0" : 0, backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", animation: `${isMobile ? "slideUp" : "slideRight"} 0.35s cubic-bezier(.22,.61,.36,1)`, boxShadow: isMobile ? "0 -24px 80px rgba(26,143,209,0.18)" : "-20px 0 80px rgba(26,143,209,0.1)" }}>
        <div style={{ padding: isMobile ? "18px 18px 16px" : "28px 24px 20px", borderBottom: `1px solid ${darkMode ? "rgba(87,184,248,0.1)" : "rgba(26,143,209,0.08)"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, color: darkMode ? "#e8f4fd" : "#0a3d62", margin: 0 }}>Your Cart 🛒</h2>
          <button onClick={onClose} style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 18, color: darkMode ? "#e8f4fd" : "#0a3d62", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 18px" : "20px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 60 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🍕</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: darkMode ? "#5a8aaa" : "#8aaac0" }}>Your cart is empty.<br />Go pick something delicious!</p>
            </div>
          ) : cart.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: `1px solid ${darkMode ? "rgba(87,184,248,0.07)" : "rgba(26,143,209,0.07)"}` }}>
              <span style={{ fontSize: 32 }}>{item.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: darkMode ? "#e8f4fd" : "#0a3d62" }}>{item.name}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: darkMode ? "#5a8aaa" : "#8aaac0", marginTop: 2 }}>{item.size} · Qty: {item.qty}{item.addons?.length ? ` · ${item.addons.join(", ")}` : ""}</div>
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: "#1a8fd1" }}>₹{item.total}</div>
              <button onClick={() => onRemove(i)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: 0.5 }}>🗑️</button>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={{ padding: isMobile ? "18px 18px calc(18px + env(safe-area-inset-bottom, 0px))" : "20px 24px 32px", borderTop: `1px solid ${darkMode ? "rgba(87,184,248,0.1)" : "rgba(26,143,209,0.08)"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", color: darkMode ? "#7aaecf" : "#5a8aaa" }}>Subtotal</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: darkMode ? "#e8f4fd" : "#0a3d62" }}>₹{total}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", color: darkMode ? "#7aaecf" : "#5a8aaa" }}>Delivery</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#1a8fd1" }}>FREE 🎉</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, padding: "12px 0", borderTop: `1px solid ${darkMode ? "rgba(87,184,248,0.1)" : "rgba(26,143,209,0.1)"}` }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 18, color: darkMode ? "#e8f4fd" : "#0a3d62" }}>Total</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, color: "#1a8fd1" }}>₹{total}</span>
            </div>
            <button onClick={() => { onClose(); onCheckout(); }} style={{ width: "100%", background: "linear-gradient(135deg,#1a8fd1,#0d6eac)", color: "#fff", border: "none", borderRadius: 14, padding: "16px", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 8px 32px rgba(26,143,209,0.4)", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >Proceed to Payment 💳</button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
}

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────
function PaymentModal({ total, onClose, onSuccess, darkMode }) {
  const [step, setStep] = useState("form"); // form | processing | success
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const pay = () => {
    setStep("processing");
    setTimeout(() => { setStep("success"); setTimeout(onSuccess, 2800); }, 2200);
  };

  const bg = darkMode ? "rgba(6,14,26,0.97)" : "rgba(255,255,255,0.97)";

  if (step === "processing") return (
    <div style={{ position: "fixed", inset: 0, zIndex: 700, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 72, animation: "spinPizza 1s linear infinite", display: "inline-block" }}>🍕</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", marginTop: 20 }}>Processing Payment…</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>Please don't close the app</div>
      </div>
      <style>{`@keyframes spinPizza { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (step === "success") return (
    <div style={{ position: "fixed", inset: 0, zIndex: 700, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div style={{ background: bg, borderRadius: 28, padding: "48px 36px", textAlign: "center", maxWidth: 360, width: "90%", animation: "popIn 0.5s cubic-bezier(.22,.61,.36,1)" }}>
        <div style={{ fontSize: 80, animation: "bounce 0.6s ease", display: "inline-block" }}>🎉</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 28, color: "#1a8fd1", marginTop: 16 }}>Order Placed!</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: darkMode ? "#7aaecf" : "#5a8aaa", marginTop: 10, lineHeight: 1.6 }}>Your pizza is firing up in the oven. ETA: <strong style={{ color: darkMode ? "#e8f4fd" : "#0a3d62" }}>18–22 mins</strong> 🔥</div>
        <div style={{ marginTop: 20, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, color: darkMode ? "#e8f4fd" : "#0a3d62" }}>₹{total} Paid ✓</div>
        <div style={{ marginTop: 24, display: "flex", gap: 8, justifyContent: "center" }}>
          {[...Array(5)].map((_, i) => <span key={i} style={{ fontSize: 22, animation: `bounce 0.4s ease ${i * 0.1}s both` }}>⭐</span>)}
        </div>
      </div>
      <style>{`@keyframes popIn { from { transform: scale(0.8); opacity:0; } to { transform: scale(1); opacity:1; } }`}</style>
    </div>
  );

  const inp = (placeholder, value, onChange, type = "text") => (
    <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${darkMode ? "rgba(87,184,248,0.2)" : "rgba(26,143,209,0.2)"}`, background: darkMode ? "rgba(26,143,209,0.06)" : "rgba(26,143,209,0.03)", color: darkMode ? "#e8f4fd" : "#0a3d62", fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 700, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: bg, border: `1px solid ${darkMode ? "rgba(87,184,248,0.15)" : "rgba(26,143,209,0.12)"}`, borderRadius: "28px 28px 0 0", padding: "32px 28px 40px", width: "100%", maxWidth: 480, maxHeight: "92vh", overflowY: "auto", animation: "slideUp 0.35s cubic-bezier(.22,.61,.36,1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, color: darkMode ? "#e8f4fd" : "#0a3d62", margin: 0 }}>💳 Secure Payment</h3>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: darkMode ? "#7aaecf" : "#5a8aaa", marginTop: 4 }}>Powered by RazorPay · SSL Encrypted</div>
          </div>
          <button onClick={onClose} style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 18, color: darkMode ? "#e8f4fd" : "#0a3d62", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        {/* Order summary */}
        <div style={{ background: darkMode ? "rgba(26,143,209,0.07)" : "rgba(26,143,209,0.05)", border: `1px solid rgba(26,143,209,0.12)`, borderRadius: 14, padding: "14px 18px", marginBottom: 24, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", color: darkMode ? "#7aaecf" : "#5a8aaa" }}>Order Total</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20, color: "#1a8fd1" }}>₹{total}</span>
        </div>
        {/* Method selector */}
        <Label dark={darkMode}>Payment Method</Label>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {[{ id: "upi", label: "UPI", emoji: "📲" }, { id: "card", label: "Card", emoji: "💳" }, { id: "wallet", label: "Wallet", emoji: "👛" }].map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)} style={{ flex: 1, padding: "12px 8px", borderRadius: 12, border: `2px solid ${method === m.id ? "#1a8fd1" : darkMode ? "rgba(87,184,248,0.15)" : "rgba(26,143,209,0.15)"}`, background: method === m.id ? "rgba(26,143,209,0.1)" : "transparent", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: method === m.id ? "#1a8fd1" : darkMode ? "#7aaecf" : "#5a8aaa", transition: "all 0.2s" }}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
        {method === "upi" && (
          <div>
            <Label dark={darkMode}>UPI ID</Label>
            {inp("yourname@upi", upiId, setUpiId)}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {["GPay", "PhonePe", "Paytm", "BHIM"].map(app => (
                <div key={app} style={{ padding: "6px 14px", background: darkMode ? "rgba(26,143,209,0.08)" : "rgba(26,143,209,0.06)", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: darkMode ? "#7aaecf" : "#3a6d94", fontWeight: 600 }}>{app}</div>
              ))}
            </div>
          </div>
        )}
        {method === "card" && (
          <div>
            <Label dark={darkMode}>Card Details</Label>
            {inp("Card Number", cardNo, v => setCardNo(v.replace(/\D/g, "").slice(0, 16)))}
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>{inp("MM/YY", expiry, setExpiry)}</div>
              <div style={{ flex: 1 }}>{inp("CVV", cvv, v => setCvv(v.slice(0, 3)), "password")}</div>
            </div>
          </div>
        )}
        {method === "wallet" && (
          <div>
            <Label dark={darkMode}>Wallet</Label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              {["Paytm Wallet", "Amazon Pay", "Freecharge"].map(w => (
                <div key={w} style={{ padding: "10px 16px", background: darkMode ? "rgba(26,143,209,0.08)" : "rgba(26,143,209,0.06)", border: "1px solid rgba(26,143,209,0.12)", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: darkMode ? "#7aaecf" : "#3a6d94", fontWeight: 600, cursor: "pointer" }}>{w}</div>
              ))}
            </div>
          </div>
        )}
        <button onClick={pay} style={{ width: "100%", background: "linear-gradient(135deg,#1a8fd1,#0d6eac)", color: "#fff", border: "none", borderRadius: 14, padding: "16px", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 8px 32px rgba(26,143,209,0.4)", transition: "all 0.2s", marginTop: 8 }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >Pay ₹{total} Securely 🔒</button>
        <div style={{ textAlign: "center", marginTop: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: darkMode ? "#5a8aaa" : "#8aaac0" }}>🔒 256-bit SSL · No Cash · Instant Confirmation</div>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ darkMode }) {
  const bg = darkMode ? "#04090f" : "#0a1f35";
  return (
    <footer style={{ background: bg, padding: "60px 24px 32px", color: "#e8f4fd" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "space-between", marginBottom: 40 }}>
          <div style={{ flex: "1 1 260px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>🍕</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: "-0.5px", background: "linear-gradient(135deg,#57b8f8,#1a8fd1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PIZZA DOME</span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 280 }}>Where street spirit meets premium craft. Every dome tells a story.</p>
          </div>
          {[{ title: "Menu", links: ["Veg Pizzas", "Non-Veg", "Drinks", "Combos"] }, { title: "Company", links: ["About Us", "Careers", "Press", "Partners"] }, { title: "Support", links: ["Track Order", "FAQs", "Contact", "Feedback"] }].map(col => (
            <div key={col.title} style={{ flex: "1 1 160px" }}>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#57b8f8", letterSpacing: 2, marginBottom: 16, textTransform: "uppercase" }}>{col.title}</h4>
              {col.links.map(l => <div key={l} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>© 2025 Pizza Dome · All rights reserved</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Made with ❤️ & 🍕 in Mumbai</div>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [customizeItem, setCustomizeItem] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const menuRef = useRef(null);

  const addToCart = item => {
    setCart(c => [...c, item]);
  };

  const directAdd = item => {
    setCart(c => [...c, { ...item, size: "—", addons: [], qty: 1, total: item.price }]);
  };

  const removeFromCart = idx => setCart(c => c.filter((_, i) => i !== idx));
  const cartTotal = cart.reduce((s, i) => s + i.total, 0);

  const onSuccess = () => {
    setCart([]);
    setPaymentOpen(false);
  };

  if (!loaded) return <Loader onDone={() => setLoaded(true)} />;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: darkMode ? "#060e1a" : "#f8fbff", minHeight: "100vh", width: "100%", overflowX: "hidden", position: "relative" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { scroll-behavior: smooth; overflow-x: hidden; width: 100%; position: relative; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(26,143,209,0.3); border-radius: 3px; }
        input::placeholder { color: rgba(90,138,170,0.6); }
      `}</style>

      <Navbar cartCount={cart.length} onCartOpen={() => setCartOpen(true)} darkMode={darkMode} setDarkMode={setDarkMode} />
      <Hero darkMode={darkMode} onOrderNow={() => setCartOpen(true)} onExplore={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })} />
      <LiveSection darkMode={darkMode} />
      <MenuSection darkMode={darkMode} onCustomize={setCustomizeItem} onDirectAdd={directAdd} />
      <Footer darkMode={darkMode} />

      {/* Floating mobile cart button */}
      {cart.length > 0 && !cartOpen && (
        <button onClick={() => setCartOpen(true)} style={{ position: "fixed", bottom: "calc(16px + env(safe-area-inset-bottom, 0px))", left: "50%", transform: "translateX(-50%)", width: "min(calc(100% - 24px), 360px)", background: "linear-gradient(135deg,#1a8fd1,#0d6eac)", color: "#fff", border: "none", borderRadius: 99, padding: "14px 22px", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, cursor: "pointer", zIndex: 200, boxShadow: "0 8px 40px rgba(26,143,209,0.5)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, animation: "slideUpBtn 0.3s ease", whiteSpace: "nowrap" }}>
          🛒 {cart.length} item{cart.length > 1 ? "s" : ""} · ₹{cartTotal}
          <style>{`@keyframes slideUpBtn { from { transform: translateX(-50%) translateY(20px); opacity:0; } to { transform: translateX(-50%) translateY(0); opacity:1; } }`}</style>
        </button>
      )}

      {cartOpen && <CartPanel cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onCheckout={() => setPaymentOpen(true)} darkMode={darkMode} />}
      {customizeItem && <CustomizeModal item={customizeItem} onClose={() => setCustomizeItem(null)} onAddToCart={addToCart} darkMode={darkMode} />}
      {paymentOpen && <PaymentModal total={cartTotal} onClose={() => setPaymentOpen(false)} onSuccess={onSuccess} darkMode={darkMode} />}
    </div>
  );
}
