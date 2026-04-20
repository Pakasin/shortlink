import "dotenv/config"; // 🔥 สำคัญมาก ต้องอยู่บรรทัดแรก
import postgres from "postgres";

// ใช้จาก .env เท่านั้น (ไม่ fallback มั่ว)
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing in .env");
  process.exit(1);
}

// debug ให้เห็นจริงว่าใช้ค่าอะไร
console.log("📌 Connecting to:", DATABASE_URL);

export const sql = postgres(DATABASE_URL);

// Test connection
(async () => {
  try {
    await sql`SELECT 1`;
    console.log("✅ Database connected: PostgreSQL");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
})();

export default sql;