import { OrderRepository } from './order-repository'
import { OrderRepositoryDatabase } from './order-repository-database'

export class GetOrder {
  constructor(private readonly orderRepository: OrderRepository = new OrderRepositoryDatabase()) {}

  async execute(id: string): Promise<Output> {
    const output: Output = {
      total: 0,
      code: '',
      freight: 0,
    }
    const order = await this.orderRepository.getById(id)
    output.total = Number(order.total)
    output.code = order.code
    output.freight = Number(order.freight)
    return output
  }
}

interface Output {
  total: number
  code: string
  freight: number
}
