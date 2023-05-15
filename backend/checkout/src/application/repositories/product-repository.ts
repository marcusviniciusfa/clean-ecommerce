import { Product } from '../../domain/entity/product'

export interface ProductRepository {
  findById(id: number): Promise<Product>
  findAll(): Promise<Product[]>
}
