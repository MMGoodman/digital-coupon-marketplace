export default function Hero() {
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