const app = require("./app");
const { connectMongo } = require("./db/mongo");

const PORT = process.env.PORT || 5000;

async function start() {
  await connectMongo();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});