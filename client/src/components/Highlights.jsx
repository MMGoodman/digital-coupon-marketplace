export default function Highlights() {
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