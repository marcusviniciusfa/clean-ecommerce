import { FreightCalculator } from '../../domain/entity/freight-calculator'
import { ProductRepository } from '../repositories/product-repository'

export class SimulateFreight {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: Input): Promise<Output> {
    const output: Output = {
      freight: 0,
    }
    if (input.items) {
      for (const item of input.items) {
        const product = await this.productRepository.findById(item.id)
        output.freight += FreightCalculator.calculate(product, item.quantity)
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
