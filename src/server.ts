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
    console.log(`database is connected ✅`)
    app.listen(SERVER_PORT, () => {
      console.log(`server listening 👂 on port ${SERVER_PORT}`)
    })
  })
  .catch((error) => {
    console.log('database is not connected ❌')
    console.error(error)
  })

app.post('/checkout', async (req: Request, res: Response) => {
  const output: Output = {
    total: 0,
    code: 201,
  }
  const { items, cpf, coupon } = req.body
  const isValid = validateCpf(cpf)
  if (!isValid) {
    output.code = 400
    output.message = 'invalid CPF'
    return res.status(output.code).end()
  }
  if (items) {
    for (const item of items) {
      const {
        rows: [product],
      } = await postgresClient.query('select * from products where id = $1;', [
        item.id,
      ])
      output.total += parseFloat(product.price) * item.quantity
    }
    if (coupon) {
      const {
        rows: [validCoupon],
      } = await postgresClient.query('select * from coupons where code = $1;', [
        coupon,
      ])
      if (validCoupon) {
        output.total -= output.total * (Number(validCoupon.percentage) / 100)
      }
    }
  }
  res.status(output.code).json(output)
})

interface Output {
  total: number
  message?: string
  code: number
}
