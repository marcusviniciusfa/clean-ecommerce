import { FreightCalculator } from './freight-calculator'
import { ProductRepository } from './product-repository'
import { ProductRepositoryDatabase } from './product-repository-database'

export class SimulateFreight {
  constructor(private readonly productRepository: ProductRepository = new ProductRepositoryDatabase()) {}

  async execute(input: Input): Promise<Output> {
    const { items } = input
    const output: Output = {
      code: 201,
      freight: 0,
    }
    for (const item of items) {
      if (item.quantity <= 0) {
        throw new Error('invalid quantity')
      }
      const product = await this.productRepository.findById(item.id)
      if (product.width <= 0 || product.height <= 0 || product.depth <= 0 || Number(product.weight) <= 0) {
        throw new Error('invalid dimension')
      }
      const productFreight = FreightCalculator.calculate(product)
      output.freight += Math.max(productFreight, 10) * item.quantity
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
  code: number
  freight: number
}
