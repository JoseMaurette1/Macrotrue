import { db } from "./src/db";
import { users } from "./src/db/schema";

async function testConnection() {
  try {
    const result = await db.select().from(users).limit(1);
    console.log("✅ Database connected successfully!");
    console.log("Current users in database:", result);
    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

testConnection();
