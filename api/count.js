import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
})

export default async function handler(req, res) {
  try {
    const count = parseInt(await redis.get("qr_count")) || 0
    res.status(200).json({ scans: count })
  } catch (err) {
    console.error("Error fetching scan count:", err)
    res.status(500).json({ error: "Server error" })
  }
}
