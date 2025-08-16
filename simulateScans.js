import fetch from 'node-fetch'

const URL = 'https://qr-limit.vercel.app/api/qrcode'  // 你的云函数 URL
const COUNT_URL = 'https://qr-limit.vercel.app/api/count'  // 查询总次数
const TOTAL = 105  // 模拟次数，比限制多几次

async function simulateScans() {
  for (let i = 1; i <= TOTAL; i++) {
    try {
      const res = await fetch(URL, { redirect: 'manual' })
      const location = res.headers.get('location') || 'no redirect'
      console.log(`Scan ${i}: Redirected to -> ${location}`)
    } catch (err) {
      console.error(`Scan ${i}: Error ->`, err)
    }
  }

  // 最后获取当前总次数
  try {
    const countRes = await fetch(COUNT_URL)
    const data = await countRes.json()
    console.log(`\nFinal QR scan count (should not exceed 100): ${data.scans}`)
  } catch (err) {
    console.error('Error fetching final count:', err)
  }
}

simulateScans()
