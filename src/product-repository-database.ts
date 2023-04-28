import { postgresClient } from './postgres-client'
import { ProductRepository } from './product-repository'

export class ProductRepositoryDatabase implements ProductRepository {
  async findById(id: number): Promise<any> {
    const {
      rows: [product],
    } = await postgresClient.query('select * from products where id = $1;', [id])
    return product
  }
}
