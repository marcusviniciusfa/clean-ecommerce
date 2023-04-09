import express, { Request, Response } from 'express'
import { Client } from 'pg'
import { validateCpf } from '.'

const app = express()
app.use(express.json())

const SERVER_PORT = process.env.SERVER_PORT

const postgresClient = new Client({
  user: process.env.DATABASE_USERNAME,
  host: 'localhost',
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
})

postgresClient
  .connect()
  .then(() => {
    console.log(`[log] database is connected ✅`)
    app.listen(SERVER_PORT, () => {
      console.log(`[log] server listening 👂 on port ${SERVER_PORT}`)
    })
  })
  .catch((_error) => {
    console.error('[log] database is not connected ❌')
  })

postgresClient.on('error', () => {
  console.error('[log] database is not connected ❌')
  process.exit(1)
})

app.post('/checkout', async (req: Request, res: Response) => {
  const output: Output = {
    total: 0,
    code: 201,
    freight: 0,
  }
  const { items, cpf, coupon, from, to } = req.body
  const isValid = validateCpf(cpf)
  try {
    if (!isValid) {
      throw new Error('invalid cpf')
    }
    const addedItems: number[] = []
    if (items) {
      for (const item of items) {
        if (item.quantity <= 0) {
          throw new Error('invalid quantity')
        }
        if (addedItems.includes(item.id)) {
          throw new Error('duplicated items')
        }
        const {
          rows: [product],
        } = await postgresClient.query('select * from products where id = $1;', [item.id])
        if (product.width <= 0 || product.height <= 0 || product.depth <= 0 || Number(product.weight) <= 0) {
          throw new Error('invalid dimension')
        }
        addedItems.push(item.id)
        const volume = (product.width / 100) * (product.height / 100) * (product.depth / 100)
        const density = Number(product.weight) / volume
        const distance = 1000
        output.total += Number(product.price) * item.quantity
        const itemFreight = distance * volume * (density / 100)
        output.freight += Math.max(itemFreight, 10) * item.quantity
      }
      if (coupon) {
        const {
          rows: [existentCoupon],
        } = await postgresClient.query('select * from coupons where code = $1;', [coupon])
        if (existentCoupon && existentCoupon.expires_at.getTime() >= new Date().getTime()) {
          output.total -= output.total * (Number(existentCoupon.percentage) / 100)
        }
      }
      if (from && to) {
        output.total += output.freight
      }
    }
  } catch (error: any) {
    output.code = 400
    return res.status(output.code).json({ message: error.message })
  }
  res.status(output.code).json(output)
})

interface Output {
  total: number
  code: number
  freight: number
}
