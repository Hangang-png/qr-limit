import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const targetUrl = "https://jiajiale.ai/";
const expiredUrl = "/expired.html";
const limit = 500;

export default async function handler(req, res) {
  try {
    const count = await redis.incr('qrcode_count');
    if (count > limit) {
      res.writeHead(302, { Location: expiredUrl });
    } else {
      res.writeHead(302, { Location: targetUrl });
    }
    res.end();
  } catch (err) {
    console.error("Redis error:", err);
    res.statusCode = 500;
    res.end("Server error");
  }
}