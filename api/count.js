import { Redis } from '@upstash/redis'

// 使用 Vercel 环境变量
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
})

export default async function handler(req, res) {
  try {
    const count = await redis.get("qr_count") || 0
    res.status(200).json({ scans: parseInt(count) })
  } catch (err) {
    console.error("Error fetching QR count:", err)
    res.status(500).json({ error: "Unable to fetch QR scan count" })
  }
}