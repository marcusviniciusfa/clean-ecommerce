import express, { Request, Response } from 'express'
import { Checkout } from './application/use-cases/checkout'

const app = express()
app.use(express.json())

const SERVER_PORT = process.env.SERVER_PORT

app.listen(SERVER_PORT, () => {
  console.log(`[log] server listening 👂 on port ${SERVER_PORT}`)
})

app.post('/checkout', async (req: Request, res: Response) => {
  try {
    const checkout = new Checkout()
    const output = await checkout.execute(req.body)
    res.status(201).json(output)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
})
