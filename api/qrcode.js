import { Redis } from '@upstash/redis';

// 初始化 Upstash Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const targetUrl = "https://jiajiale.ai/";   // 正常访问页面
const expiredUrl = "/expired.html";         // 超过次数后跳转 Vercel public 页面
const limit = 100;                          // 最大访问次数

export default async function handler(req, res) {
  try {
    // Redis 原子计数
    const count = await redis.incr('qrcode_count');

    if (count > limit) {
      // 超过限制，跳转到失效页面
      res.writeHead(302, { Location: expiredUrl });
    } else {
      // 前 100 次，跳转到目标页面
      res.writeHead(302, { Location: targetUrl });
    }

    res.end();
  } catch (err) {
    console.error("Redis error:", err);

    // Redis 异常时也跳转到失效页面，防止 500
    res.writeHead(302, { Location: expiredUrl });
    res.end();
  }
}
