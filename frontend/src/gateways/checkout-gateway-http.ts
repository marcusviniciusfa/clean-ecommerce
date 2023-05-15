import { Order } from "../entities/order"
import { Product } from "../entities/product"
import { HttpClient } from "../infra/http/http-client"
import { CheckoutGateway, CheckoutOutput } from "./checkout-gateway"

export class CheckoutGatewayHttp implements CheckoutGateway {
  constructor (private httpClient: HttpClient, private baseUrl: string) {}

  async getProducts(): Promise<Product[]> {
    const productsData = await this.httpClient.get(`${this.baseUrl}/products`)
    const products: Array<Product> = []
    productsData.map((product: any) => {
      products.push({
        id: product.id,
        description: product.description,
        price: product.price
      })
    })
    return products
  }
  async checkout(order: Order): Promise<CheckoutOutput> {
    const response = this.httpClient.post(`${this.baseUrl}/checkout`, order)
    return response
  }
}
