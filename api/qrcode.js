import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
})

const LIMIT = 100
const targetUrl = "https://jiajiale.ai/"
const expiredUrl = "/expired.html" // Vercel public 下的失效页面

export default async function handler(req, res) {
  try {
    // 先获取当前计数，不立即增加
    const count = parseInt(await redis.get("qr_count")) || 0

    if (count >= LIMIT) {
      console.log(`QR scan limit exceeded (count=${count}). Redirecting to expired page.`)
      // 超过次数 → 跳转失效页面，不再增加计数
      res.writeHead(302, { Location: expiredUrl })
      res.end()
      return
    }

    // 正常访问 → 增加计数
    const newCount = await redis.incr("qr_count")
    console.log(`QR scan occurred. Current count: ${newCount}`)

    // 跳转到目标页面
    res.writeHead(302, { Location: targetUrl })
    res.end()
  } catch (err) {
    console.error("Error in QR scan handler:", err)
    res.status(500).send("Server error")
  }
}
