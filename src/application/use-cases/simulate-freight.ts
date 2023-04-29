import { FreightCalculator } from '../../domain/entity/freight-calculator'
import { ProductRepository } from '../../product-repository'
import { ProductRepositoryDatabase } from '../../product-repository-database'

export class SimulateFreight {
  constructor(private readonly productRepository: ProductRepository = new ProductRepositoryDatabase()) {}

  async execute(input: Input): Promise<Output> {
    const output: Output = {
      freight: 0,
    }
    if (input.items) {
      for (const item of input.items) {
        const product = await this.productRepository.findById(item.id)
        const itemFreight = FreightCalculator.calculate(product)
        output.freight += Math.max(itemFreight, 10) * item.quantity
      }
    }
    return output
  }
}

interface Input {
  items: Array<{ id: number; quantity: number }>
  from?: string
  to?: string
}

interface Output {
  freight: number
}
