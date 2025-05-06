import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL as string, {
  tls: {}, // 👈 This enables TLS/SSL
});

export default redis;
