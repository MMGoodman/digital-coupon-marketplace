import "./App.css";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000";

function Header() {
  return (
    <header className="header">
      <div className="container headerInner">
        <div className="logo">Digital Coupon Marketplace</div>
        <a
          className="githubBtn"
          href="https://github.com/MMGoodman/digital-coupon-marketplace"
          target="_blank"
          rel="noreferrer"
        >
          View GitHub
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="container heroContent">
        <div className="heroText">
          <span className="badge">Backend + Frontend Demo</span>
          <h1>Digital coupons with a clean purchase flow</h1>
          <p>
            A simple marketplace demo built with React, Node.js, MongoDB and Docker.
            Each coupon can be sold only once, with safe server-side purchase logic.
          </p>
          <a href="#coupons" className="primaryBtn">
            View Coupons
          </a>
        </div>

        <div className="heroCard">
          <h3>Project Highlights</h3>
          <ul>
            <li>Clean React interface</li>
            <li>Connected to real backend API</li>
            <li>MongoDB persistence</li>
            <li>Atomic purchase protection</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function CouponCard({ coupon, onPurchase, purchasingId }) {
  const isPurchasing = purchasingId === coupon.id;

  return (
    <div className="couponCard">
      <img
        src={coupon.image_url}
        alt={coupon.name}
        className="couponImage"
      />

      <div className="couponBody">
        <div className="couponTop">
          <h3>{coupon.name}</h3>
          <span className="priceTag">${coupon.price}</span>
        </div>

        <p>{coupon.description}</p>

        <button
          className="purchaseBtn"
          onClick={() => onPurchase(coupon.id)}
          disabled={isPurchasing}
        >
          {isPurchasing ? "Processing..." : "Purchase"}
        </button>
      </div>
    </div>
  );
}

function Highlights() {
  return (
    <section className="highlights">
      <div className="container">
        <h2>Why this project stands out</h2>

        <div className="highlightsGrid">
          <div className="highlightCard">
            <h3>Real API Integration</h3>
            <p>
              The frontend fetches available coupons from the backend and updates
              the UI after purchase.
            </p>
          </div>

          <div className="highlightCard">
            <h3>Safe Purchase Logic</h3>
            <p>
              A coupon can only be sold once. The backend uses atomic MongoDB
              updates to prevent duplicate purchases.
            </p>
          </div>

          <div className="highlightCard">
            <h3>Docker Ready</h3>
            <p>
              The backend and MongoDB run with Docker Compose for simple local setup.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footerInner">
        <p>Built by Moshe Goodman</p>
        <a
          href="https://github.com/MMGoodman/digital-coupon-marketplace"
          target="_blank"
          rel="noreferrer"
        >
          GitHub Repository
        </a>
      </div>
    </footer>
  );
}

export default function App() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [purchasingId, setPurchasingId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resellerHeaders = {
    Authorization: "Bearer dev-token-123",
    "Content-Type": "application/json",
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await fetch(`${API_BASE}/api/v1/products`, {
        headers: resellerHeaders,
      });

      if (!response.ok) {
        throw new Error("Failed to load coupons");
      }

      const data = await response.json();
      setCoupons(Array.isArray(data) ? data : data.value || []);
    } catch (error) {
      setPageError("Could not load coupons. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (couponId) => {
    try {
      setPurchasingId(couponId);
      setSuccessMessage("");
      setPageError("");

      const response = await fetch(`${API_BASE}/api/v1/products/${couponId}/purchase`, {
        method: "POST",
        headers: resellerHeaders,
        body: JSON.stringify({ reseller_price: 120 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Purchase failed");
      }

      setSuccessMessage(`Purchase completed successfully. Coupon value: ${data.value}`);
      setCoupons((prev) => prev.filter((item) => item.id !== couponId));
    } catch (error) {
      setPageError(error.message || "Purchase failed");
    } finally {
      setPurchasingId("");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="app">
      <Header />
      <Hero />

      <main className="mainContent" id="coupons">
        <div className="container">
          <div className="sectionTitle">
            <h2>Available Coupons</h2>
            <p>Live data from the backend service</p>
          </div>

          {successMessage && <div className="successBox">{successMessage}</div>}
          {pageError && <div className="errorBox">{pageError}</div>}

          {loading ? (
            <div className="stateBox">Loading coupons...</div>
          ) : coupons.length === 0 ? (
            <div className="stateBox">No available coupons right now.</div>
          ) : (
            <div className="couponsGrid">
              {coupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onPurchase={handlePurchase}
                  purchasingId={purchasingId}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Highlights />
      <Footer />
    </div>
  );
}