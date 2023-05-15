import { Checkout } from '../../application/use-cases/checkout'
import { GetProducts } from '../../application/use-cases/get-products'
import { HttpServer } from './http-server'

export class HttpController {
  constructor(readonly httpServer: HttpServer, readonly checkout: Checkout, readonly getProducts: GetProducts) {
    httpServer.on('post', '/checkout', async (_params: any, body: any) => {
      const output = await checkout.execute(body)
      return output
    })

    httpServer.on('get', '/products', async (_params: any, _body: any) => {
      const output = await getProducts.execute()
      return output
    })
  }
}
