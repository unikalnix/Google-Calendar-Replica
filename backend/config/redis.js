import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redisClient = createClient({ url: redisUrl });

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient.connect()
  .then(() => console.log("Connected to Redis"))
  .catch((err) => console.error("Redis connection failed:", err));

export { redisClient, redisUrl };