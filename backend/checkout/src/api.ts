import express, { Request, Response } from 'express'
import { Checkout } from './application/use-cases/checkout'
import { CouponRepositoryDatabase } from './coupon-repository-database'
import { PgAdapter } from './infra/database/pg-adapter'
import { OrderRepositoryDatabase } from './infra/database/repositories/order-repository-database'
import { CurrencyGatewayHttp } from './infra/gateway/currency-gateway-http'
import { ProductRepositoryDatabase } from './product-repository-database'

const app = express()
app.use(express.json())

const SERVER_PORT = process.env.SERVER_PORT

app.listen(SERVER_PORT, () => {
  console.log(`[log] server listening 👂 on port ${SERVER_PORT}`)
})

app.post('/checkout', async (req: Request, res: Response) => {
  try {
    const databaseConnection = new PgAdapter()
    const currencyGateway = new CurrencyGatewayHttp()
    const productRepository = new ProductRepositoryDatabase(databaseConnection)
    const couponRepository = new CouponRepositoryDatabase(databaseConnection)
    const orderRepository = new OrderRepositoryDatabase(databaseConnection)
    const checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository)
    const output = await checkout.execute(req.body)
    res.status(201).json(output)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
})
