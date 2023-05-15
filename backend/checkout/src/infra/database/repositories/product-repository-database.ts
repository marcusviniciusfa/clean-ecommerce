import { ProductRepository } from '../../../application/repositories/product-repository'
import { Product } from '../../../domain/entity/product'
import { DatabaseConnection } from '../database-connection'

export class ProductRepositoryDatabase implements ProductRepository {
  constructor(readonly databaseConnection: DatabaseConnection) {}

  async findById(id: number): Promise<Product> {
    const {
      rows: [productData],
    } = await this.databaseConnection.query('select * from products where id = $1;', [id])
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

  async findAll(): Promise<Product[]> {
    const { rows: productsData } = await this.databaseConnection.query('select * from products where id in (1, 2, 3)')
    const products = productsData.map((productData: any) => {
      return new Product(
        productData.id,
        productData.description,
        Number(productData.price),
        productData.width,
        productData.height,
        productData.depth,
        Number(productData.weight),
        productData.currency,
      )
    })
    return products
  }
}
