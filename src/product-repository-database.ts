import { Product } from './domain/entity/product'
import { postgresClient } from './postgres-client'
import { ProductRepository } from './product-repository'

export class ProductRepositoryDatabase implements ProductRepository {
  async findById(id: number): Promise<Product> {
    const {
      rows: [productData],
    } = await postgresClient.query('select * from products where id = $1;', [id])
    const product = new Product(
      productData.id,
      productData.description,
      Number(productData.price),
      productData.width,
      productData.height,
      productData.depth,
      Number(productData.weight),
      productData.currency,
    )
    return product
  }
}
