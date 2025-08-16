import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
})

const LIMIT = 100
const targetUrl = "https://jiajiale.ai/"
const expiredUrl = "/expired.html"

export default async function handler(req, res) {
  try {
    // 先增加计数
    const newCount = await redis.incr("qr_count")

    if (newCount > LIMIT) {
      console.log(`QR scan limit exceeded (count=${newCount}). Redirecting to expired page.`)
      // 超过次数 → 跳转失效页面
      res.writeHead(302, { Location: expiredUrl })
      res.end()
      return
    }

    console.log(`QR scan occurred. Current count: ${newCount}`)
    // 正常跳转
    res.writeHead(302, { Location: targetUrl })
    res.end()
  } catch (err) {
    console.error("Error in QR scan handler:", err)
    res.status(500).send("Server error")
  }
}
