import { ProductRepository } from '../repositories/product-repository'

export class GetProducts {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<Output[]> {
    const output: Array<Output> = []
    const products = await this.productRepository.findAll()
    products.map((product) => {
      output.push({
        id: product.id,
        description: product.description,
        price: product.price,
      })
    })
    return output
  }
}

interface Output {
  id: number
  description: string
  price: number
}
