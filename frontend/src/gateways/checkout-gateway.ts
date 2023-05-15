import { Order } from "../entities/order"
import { Product } from "../entities/product"

export interface CheckoutOutput {
  total: number
  freight: number
}

export interface CheckoutGateway {
  getProducts(): Promise<Array<Product>>
  checkout(order: Order): Promise<CheckoutOutput>
}
