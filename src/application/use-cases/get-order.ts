import { OrderRepository } from '../../order-repository'
import { OrderRepositoryDatabase } from '../../order-repository-database'

export class GetOrder {
  constructor(private readonly orderRepository: OrderRepository = new OrderRepositoryDatabase()) {}

  async execute(id: string): Promise<Output> {
    const order = await this.orderRepository.getById(id)
    const output: Output = {
      code: order.getCode(),
      total: order.getTotal(),
      freight: order.freight,
    }
    return output
  }
}

interface Output {
  code: string
  total: number
  freight: number
}
