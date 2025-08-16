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
    // 每次访问自动 +1
    const count = await redis.incr("qr_count")

    // 打印当前扫码次数到 Vercel 日志
    console.log(`QR scan occurred. Current count: ${count}`)

    if (count > LIMIT) {
      console.log("QR scan limit exceeded. Redirecting to expired page.")
      // 超过次数 → 跳转失效页面
      res.writeHead(302, { Location: expiredUrl })
      res.end()
      return
    }

    // 正常跳转
    res.writeHead(302, { Location: targetUrl })
    res.end()
  } catch (err) {
    console.error("Error in QR scan handler:", err)
    res.status(500).send("Server error")
  }
}
