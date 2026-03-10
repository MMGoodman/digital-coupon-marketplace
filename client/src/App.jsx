import "./App.css";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CouponCard from "./components/CouponCard";
import Highlights from "./components/Highlights";
import Footer from "./components/Footer";

const API_BASE = "http://localhost:5000";

export default function App() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingDemo, setCreatingDemo] = useState(false);
  const [pageError, setPageError] = useState("");
  const [purchasingId, setPurchasingId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resellerHeaders = {
    Authorization: "Bearer dev-token-123",
    "Content-Type": "application/json",
  };

  const normalizeCoupons = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.value)) return data.value;
    return [];
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
      const normalizedData = normalizeCoupons(data);
      setCoupons(normalizedData);
    } catch (error) {
      console.error("fetchCoupons error:", error);
      setPageError("Could not load coupons. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const createDemoCoupon = async () => {
    try {
      setCreatingDemo(true);
      setPageError("");
      setSuccessMessage("");

      const body = {
        name: "Amazon $100 Coupon",
        description: "Gift card",
        image_url:
          "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=900&q=80",
        cost_price: 80,
        margin_percentage: 25,
        coupon_value_type: "STRING",
        coupon_value: "ABCD-1234",
      };

      const response = await fetch(`${API_BASE}/api/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to create demo coupon");
      }

      setSuccessMessage("Demo coupon created successfully.");
      await fetchCoupons();
    } catch (error) {
      console.error("createDemoCoupon error:", error);
      setPageError("Could not create a demo coupon.");
    } finally {
      setCreatingDemo(false);
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
      console.error("purchase error:", error);
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
            <div className="titleRow">
              <div>
                <h2>Available Coupons</h2>
                <p>Live data from the backend service</p>
              </div>

              <div className="actionsRow">
                <button
                  className="secondaryBtn"
                  onClick={createDemoCoupon}
                  disabled={creatingDemo}
                >
                  {creatingDemo ? "Creating..." : "Create Demo Coupon"}
                </button>
              </div>
            </div>
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