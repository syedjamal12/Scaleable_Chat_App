import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL, {
    tls: {}, // 👈 This enables TLS/SSL
});
export default redis;
