import cors from 'cors'
import express, { Express, Request, Response } from 'express'
import { HttpServer } from './http-server'

type HttpMethod = 'post' | 'get' | 'put' | 'delete' | 'patch'

export class ExpressAdapter implements HttpServer {
  app: Express

  constructor() {
    this.app = express()
    this.app.use(express.json())
    this.app.use(cors())
  }

  on(method: string, url: string, callback: Function): void {
    this.app[method as HttpMethod](url, async (req: Request, res: Response) => {
      try {
        const output = await callback(req.params, req.body)
        res.status(201).json(output)
      } catch (error: any) {
        res.status(400).json({ message: error.message })
      }
    })
  }

  listen(port: number): void {
    this.app.listen(port)
  }
}
