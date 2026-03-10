const fallbackImage =
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=900&q=80";

export default function CouponCard({ coupon, onPurchase, purchasingId }) {
  const isPurchasing = purchasingId === coupon.id;

  return (
    <div className="couponCard">
      <img
        src={coupon.image_url || fallbackImage}
        alt={coupon.name}
        className="couponImage"
        onError={(e) => {
          e.currentTarget.src = fallbackImage;
        }}
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